const { Pinecone } = require('@pinecone-database/pinecone');
require('dotenv').config();

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

const index = "chatbot-rag";

const checkExistingIndexes = async() => {
    const existingIndexes = await pc.listIndexes();
    return existingIndexes.indexes.some((i) => i.name === index);
};

const createNewIndex = async () => {
    await pc.createIndex({
        name: index,
        dimension: 384,
        metric: 'cosine',
        spec: {
            serverless: {
                cloud: 'aws',
                region: 'us-east-1',
            }
        },
        waitUntilReady: true
    });
}

const main = async() => {

    const exists = await checkExistingIndexes();

    if(!exists) {
        await createNewIndex();
        console.log('Index créé');
    } else {
        console.log('Index existant')
    }
}

main();