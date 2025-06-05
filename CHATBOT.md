# AI Chatbot Documentation

## Overview

This portfolio includes an AI-powered chatbot that can answer questions about the portfolio owner's skills, experience, education, and projects. The chatbot uses natural language processing techniques to understand user queries and provide relevant responses.

## Features

- Natural language understanding
- Intent recognition
- Entity extraction
- Multi-language support (basic)
- Conversation history tracking


## Handling Unknown Queries

The chatbot has been optimized to handle unknown queries gracefully, even without an external NLP API:

1. **Varied Responses**: The chatbot provides a variety of responses for unknown queries to avoid repetition and maintain engagement.

2. **Multilingual Support**: Unknown query responses are available in multiple languages (English, Spanish, French).

3. **Enhanced Local Entity Recognition**: When no external API is available, the chatbot uses an improved local entity recognition system that can identify:
   - Person names (including titles like Mr., Mrs., Dr.)
   - Organizations (companies, universities, etc.)
   - Locations
   - Dates
   - Skills (matching against Plan's skill set)
   - Projects (matching against Plan's project portfolio)

4. **Contextual Suggestions**: Each unknown response includes suggestions for what the user might want to know instead, guiding the conversation toward available information.

5. **Detailed Entity Responses**: When entities are recognized in a query, the chatbot provides detailed information about those entities if they relate to Plan's background, skills, or projects.

### Example Unknown Query Responses

```
User: "What is quantum computing?"
Bot: "I'm still learning! While I don't have an answer for that, I can share details about Plan's expertise in JavaScript, React, and Node.js. Would that help?"

User: "Do you know about machine learning?"
Bot: "Yes, machine learning is one of Plan's technical skills. He has expertise in JavaScript, React, Node.js, Python, and machine learning, and more."
```

## Entity Recognition

The chatbot now uses the `node-nlp` library for entity recognition, which provides a free and fast solution without requiring an API key. This enhancement allows the chatbot to identify various entity types in user queries:

- **Person**: Recognizes names of people, particularly the portfolio owner
- **Organization**: Identifies company names from work experience
- **Location**: Detects place names and addresses
- **Date**: Recognizes date references to match with experience or education timelines
- **Skill**: Identifies technical skills from the skills database
- **Project**: Recognizes project names from the portfolio
- **Education**: Identifies educational institutions from academic history

The entity recognition system works by:

1. Initializing a Named Entity Recognition (NER) manager from the `node-nlp` library
2. Training it with data from the portfolio (skills, projects, experience, etc.)
3. Processing user queries to extract relevant entities
4. Generating contextual responses based on the recognized entities

### Benefits

- **No API Key Required**: Works completely offline without external API dependencies
- **Fast Processing**: Performs entity recognition locally for quick response times
- **Customizable**: Easily extendable to recognize additional entity types
- **Multilingual Support**: Can be configured to recognize entities in multiple languages

### Implementation

The implementation consists of two main components:

1. **node-nlp-service.js**: A dedicated service that initializes the NER manager and provides entity recognition functionality
2. **Integration with chatbot-nlp.js**: The service is used as a primary or fallback method for entity recognition

When a user query is processed, the system attempts to recognize entities and generate appropriate responses based on the identified entity types.