require('dotenv').config();

const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const { pipeline } = require("@xenova/transformers");
const { Pinecone } = require("@pinecone-database/pinecone");

async function main() {

  const dossier = "documents";

  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  const index = pinecone.Index("chatbot-rag");

  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );

  // Lecture de tous les fichiers du dossier
  const files = await fsp.readdir(dossier);

  for (const file of files) {

    if (!file.endsWith(".txt")) continue;

    const filePath = path.join(dossier, file);

    const buffer = fs.readFileSync(filePath);

    // Normalisation de retour en ligne
    const texte = buffer
      .toString("utf-8")
      .replace(/\0/g, "")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .trim();

    // Chunks par paragraphe
    const seen = new Set();

    const chunks = texte
      .split(/\n{2,}/)
      .map(p => p.trim())
      .filter(p => {
        if (!p) return false;
        if (seen.has(p)) return false;
        seen.add(p);
        return true;
      });

    console.log(`${file} → ${chunks.length} chunks`);

    // Embedding + upsert
    for (let i = 0; i < chunks.length; i++) {

      const chunk = chunks[i];

      const output = await extractor(chunk, {
        pooling: "mean",
        normalize: true,
      });

      const vecteur = Array.from(output.data);

      await index.upsert([
        {
          id: `${file}-chunk-${i}`,
          values: vecteur,
          metadata: {
            texte: chunk,
            fichier: file,
          },
        },
      ]);
    }
  }

  console.log("Tous les fichiers ont été indexés dans Pinecone");
}

main().catch(console.error);