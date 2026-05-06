require("dotenv").config();

const readline = require("readline");
const { pipeline } = require("@xenova/transformers");
const { Pinecone } = require("@pinecone-database/pinecone");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function main() {
    const extractor = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2"
    );

    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    });

    const index = pinecone.Index("chatbot-rag");

    async function vectoriserQuestion(question) {
        const output = await extractor(question, {
            pooling: "mean",
            normalize: true,
        });

        return Array.from(output.data);
    }

    async function chercherContexte(vecteurQuestion) {
        const resultats = await index.query({
            vector: vecteurQuestion,
            topK: 30,
            includeMetadata: true,
        });

        const contexte = resultats.matches
            .map((match) => match.metadata.texte)
            .join("\n\n");

        return contexte;
    }

    async function appellerLLM(question, contexte) {
        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "system",
                            content: `Tu es un assistant basé uniquement sur un contexte fourni.

Règles :
- Utilise uniquement les informations présentes dans le contexte pour répondre.
- Ne fais aucune supposition et n’invente rien.
- Si le contexte contient des éléments partiels, réponds avec ce que tu sais uniquement.
- Si aucune information pertinente n’est présente dans le contexte, réponds exactement : "Je ne sais pas".

Réponds de manière claire, concise et factuelle. Contexte :
${contexte}`,
                        },
                        {
                            role: "user",
                            content: question,
                        },
                    ],
                }),
            }
        );

        const data = await response.json();
        return data.choices[0].message.content;
    }

    function poserQuestion() {
        rl.question("Vous : ", async (question) => {
            if (question.toLowerCase() === "exit") {
                rl.close();
                return;
            }

            try {
                const vecteurQuestion = await vectoriserQuestion(question);
                const contexte = await chercherContexte(vecteurQuestion);

                const reponse = await appellerLLM(question, contexte);

                console.log("Assistant :", reponse);
            } catch (err) {
                console.error("Erreur :", err);
            }

            poserQuestion();
        });
    }

    console.log("🌸 Chatbot RAG prêt ! Tape 'exit' pour quitter.\n");
    poserQuestion();
}

main().catch(console.error);