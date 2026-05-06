thomasr8_
thomasr8_
En ligne

thomasr8_ — 06/02/2026 15:32
use Symfony\Component\String\Slugger\AsciiSlugger;
$slugger = new AsciiSlugger();
            $slug = $slugger->slug($form->get('title')->getData())->lower();
JeSaisPas — 04/05/2026 09:32
Type de fichier joint : archive
Node ia.zip
48.72 KB
JeSaisPas — Hier à 15:12
https://app.pinecone.io/organizations/-OpHX9uxRZfPvIDyu-_3/projects/4f07a181-e506-4f22-a3f2-c9004c617fb1/keys
Pinecone Console
Long-term memory for AI
JeSaisPas — 15:24
require("dotenv").config();

const readline = require("readline");
const { pipeline } = require("@xenova/transformers");
const { Pinecone } = require("@pinecone-database/pinecone");

message.txt
3 Ko
JeSaisPas — 15:33
Tu es un assistant.
Réponds UNIQUEMENT à partir du contexte fourni, et si tu n’as pas de contexte tu devras répondre "Je ne sais pas" à chaque question.
Si la réponse n’est pas dans le contexte, dis clairement : "Je ne sais pas".
JeSaisPas — 15:55
Tu es un assistant.

Tu dois répondre en utilisant le contexte fourni.

Si le contexte contient des informations utiles, utilise-les pour répondre de manière complète et claire.

Si le contexte ne contient aucune information pertinente pour répondre à la question, réponds uniquement : "Je ne sais pas".

Ne dis jamais que tu n’as pas de contexte si l’information est disponible dans celui-ci.
JeSaisPas — 16:06
require("dotenv").config();

const readline = require("readline");
const { pipeline } = require("@xenova/transformers");
const { Pinecone } = require("@pinecone-database/pinecone");

message.txt
3 Ko
thomasr8_ — 16:26
require("dotenv").config();

const readline = require("readline");
const { pipeline } = require("@xenova/transformers");
const { Pinecone } = require("@pinecone-database/pinecone");

rag-pipeline.js
4 Ko
JeSaisPas — 17:09
Chatbot RAG
Installation
Cloner le projet :

git clone https://github.com/NolanLefebvre/ChatbotRag.git


Aller dans le dossier :

cd ChatbotRag


Créer le fichier .env en te basant sur exemple.env

Installer les dépendances :

npm install


Lancement
Lancer le projet avec :

npm run start


---
# Chatbot RAG

## Installation

1. Cloner le projet :

README.md
1 Ko
﻿
JeSaisPas
karmasphinx
 
 
 
Non
# Chatbot RAG

## Installation

1. Cloner le projet :

```
git clone https://github.com/NolanLefebvre/ChatbotRag.git
```

2. Aller dans le dossier :

```
cd ChatbotRag
```

3. Créer le fichier `.env` en te basant sur `exemple.env`

4. Installer les dépendances :

```
npm install
```

## Lancement

Lancer le projet avec :

```
npm run start
```

### Stopper le chatbot

Écrire "exit" dans le terminal

### Captures d'écran

- Capture d'écran montrant les vecteurs indexés dans Pinecone :

![Pinecone](./images/pinecone.png)

- Capture d'écran : le chatbot répondant correctement à une question sur le corpus :

![Chatbobt répondant sur le corpus](./images/chatbot-1.png)

- Capture d'écran : le chatbot répondant 'Je ne sais pas' :

![Chatbobt répondant sur le corpus](./images/chatbot-2.png)