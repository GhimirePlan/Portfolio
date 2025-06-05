/**
 * Enhanced NLP utilities for the chatbot
 * This provides advanced natural language processing capabilities
 * with minimal external dependencies for fast response times
 */

// Stopwords to filter out from queries
const stopwords = [
  'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were',
  'be', 'been', 'being', 'to', 'of', 'for', 'with', 'about', 'against',
  'between', 'into', 'through', 'during', 'before', 'after', 'above',
  'below', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under',
  'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
  'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some',
  'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
  'can', 'will', 'just', 'should', 'now'
];

// Language detection patterns for basic multilingual support
const languagePatterns = {
  english: /^[a-zA-Z\s\d\p{P}]+$/u,
  spanish: /[áéíóúüñ¿¡]/i,
  french: /[àâçéèêëîïôùûüÿœæ]/i,
  german: /[äöüßÄÖÜ]/i,
  hindi: /[\u0900-\u097F]/,
  chinese: /[\u4E00-\u9FFF]/,
  japanese: /[\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF]/,
  korean: /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/,
  nepali: /[\u0900-\u097F\uF000-\uF0FF]/
};

// Context management for conversation history
let conversationHistory = [];
const MAX_HISTORY_LENGTH = 10;

// Learning system - store successful responses for future reference
let learnedResponses = {};

/**
 * Advanced tokenization with support for different languages and n-grams
 * @param {string} text - The text to tokenize
 * @returns {Object} Object containing tokens, bigrams, and language detection
 */
export function advancedTokenize(text) {
  // Basic tokenization
  const tokens = text.toLowerCase()
    .replace(/[^\w\s\u0080-\uFFFF]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 0);
  
  // Generate bigrams for better context understanding
  const bigrams = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    bigrams.push(`${tokens[i]} ${tokens[i + 1]}`);
  }
  
  // Detect language
  let detectedLanguage = 'english'; // default
  for (const [language, pattern] of Object.entries(languagePatterns)) {
    if (pattern.test(text)) {
      detectedLanguage = language;
      break;
    }
  }
  
  return {
    tokens,
    bigrams,
    language: detectedLanguage
  };
}

/**
 * Basic tokenization for backward compatibility
 * @param {string} text - The text to tokenize
 * @returns {string[]} Array of tokens
 */
export function tokenize(text) {
  return advancedTokenize(text).tokens;
}

/**
 * Remove stopwords from an array of tokens
 * @param {string[]} tokens - Array of tokens
 * @returns {string[]} Filtered tokens without stopwords
 */
export function removeStopwords(tokens) {
  return tokens.filter(token => !stopwords.includes(token));
}

/**
 * Calculate similarity between two texts using multiple metrics
 * @param {string} text1 - First text
 * @param {string} text2 - Second text
 * @param {string} method - Similarity method to use (jaccard, cosine, levenshtein)
 * @returns {number} Similarity score between 0 and 1
 */
export function calculateSimilarity(text1, text2, method = 'combined') {
  // For backward compatibility
  if (method === 'jaccard' || method === 'default') {
    return jaccardSimilarity(text1, text2);
  }
  
  if (method === 'combined') {
    // Combine multiple similarity metrics for better results
    const jaccard = jaccardSimilarity(text1, text2);
    const cosine = cosineSimilarity(text1, text2);
    const levenshtein = levenshteinSimilarity(text1, text2);
    
    // Weighted average of similarity scores
    return (jaccard * 0.4) + (cosine * 0.4) + (levenshtein * 0.2);
  }
  
  // Individual metrics
  switch (method) {
    case 'cosine':
      return cosineSimilarity(text1, text2);
    case 'levenshtein':
      return levenshteinSimilarity(text1, text2);
    default:
      return jaccardSimilarity(text1, text2);
  }
}

/**
 * Calculate Jaccard similarity between two texts
 * @param {string} text1 - First text
 * @param {string} text2 - Second text
 * @returns {number} Similarity score between 0 and 1
 */
export function jaccardSimilarity(text1, text2) {
  const tokens1 = new Set(removeStopwords(tokenize(text1)));
  const tokens2 = new Set(removeStopwords(tokenize(text2)));
  
  // Calculate intersection
  const intersection = new Set([...tokens1].filter(x => tokens2.has(x)));
  
  // Calculate union
  const union = new Set([...tokens1, ...tokens2]);
  
  // Jaccard similarity: size of intersection / size of union
  return union.size === 0 ? 0 : intersection.size / union.size;
}

/**
 * Calculate cosine similarity between two texts
 * @param {string} text1 - First text
 * @param {string} text2 - Second text
 * @returns {number} Similarity score between 0 and 1
 */
export function cosineSimilarity(text1, text2) {
  const tokens1 = removeStopwords(tokenize(text1));
  const tokens2 = removeStopwords(tokenize(text2));
  
  // Create a set of all unique tokens
  const uniqueTokens = [...new Set([...tokens1, ...tokens2])];
  
  // Create vectors
  const vector1 = uniqueTokens.map(token => tokens1.filter(t => t === token).length);
  const vector2 = uniqueTokens.map(token => tokens2.filter(t => t === token).length);
  
  // Calculate dot product
  let dotProduct = 0;
  for (let i = 0; i < uniqueTokens.length; i++) {
    dotProduct += vector1[i] * vector2[i];
  }
  
  // Calculate magnitudes
  const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));
  
  // Avoid division by zero
  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  
  // Cosine similarity
  return dotProduct / (magnitude1 * magnitude2);
}

/**
 * Calculate Levenshtein similarity between two texts
 * @param {string} text1 - First text
 * @param {string} text2 - Second text
 * @returns {number} Similarity score between 0 and 1
 */
export function levenshteinSimilarity(text1, text2) {
  // For very long texts, use token-based approach instead of character-based
  if (text1.length > 100 || text2.length > 100) {
    const tokens1 = tokenize(text1);
    const tokens2 = tokenize(text2);
    return 1 - (levenshteinDistance(tokens1.join(' '), tokens2.join(' ')) / 
               Math.max(tokens1.join(' ').length, tokens2.join(' ').length));
  }
  
  // For shorter texts, use character-based Levenshtein
  return 1 - (levenshteinDistance(text1, text2) / Math.max(text1.length, text2.length));
}

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} s1 - First string
 * @param {string} s2 - Second string
 * @returns {number} Levenshtein distance
 */
function levenshteinDistance(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  
  // Create matrix
  const d = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  // Initialize first row and column
  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;
  
  // Fill the matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,      // deletion
        d[i][j - 1] + 1,      // insertion
        d[i - 1][j - 1] + cost // substitution
      );
    }
  }
  
  return d[m][n];
}

/**
 * Extract keywords from text with improved weighting
 * @param {string} text - The text to extract keywords from
 * @returns {string[]} Array of keywords
 */
export function extractKeywords(text) {
  const { tokens, bigrams } = advancedTokenize(text);
  const filteredTokens = removeStopwords(tokens);
  
  // Include important bigrams that might contain meaningful phrases
  const filteredBigrams = bigrams.filter(bigram => {
    const bigramTokens = bigram.split(' ');
    return !bigramTokens.every(token => stopwords.includes(token));
  });
  
  // Combine unigrams and bigrams for better keyword extraction
  return [...filteredTokens, ...filteredBigrams];
}

/**
 * Find the best matching intent for a query with improved matching
 * @param {string} query - User query
 * @param {Object} intents - Map of intent names to example phrases
 * @param {number} threshold - Similarity threshold (0-1)
 * @returns {string|null} The best matching intent or null if no match
 */
export function findIntent(query, intents, threshold = 0.3) {
  let bestMatch = null;
  let highestSimilarity = 0;
  
  // Consider conversation history for context-aware intent matching
  let contextualQuery = query;
  if (conversationHistory.length > 0) {
    // Add the last user message for context if available
    const lastUserMessage = conversationHistory
      .filter(msg => msg.role === 'user')
      .pop();
      
    if (lastUserMessage && lastUserMessage.text !== query) {
      contextualQuery = `${lastUserMessage.text} ${query}`;
    }
  }
  
  for (const [intent, examples] of Object.entries(intents)) {
    for (const example of examples) {
      // Use combined similarity for better matching
      const similarity = calculateSimilarity(contextualQuery, example, 'combined');
      
      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        bestMatch = intent;
      }
    }
  }
  
  return highestSimilarity >= threshold ? bestMatch : null;
}

/**
 * Generate a response based on entities extracted from the query
 * @param {string} query - User query
 * @param {Object} entityPatterns - Map of entity types to regex patterns
 * @param {Object} responseTemplates - Map of entity types to response templates
 * @returns {string|null} Generated response or null if no entities found
 */
export function generateEntityResponse(query, entityPatterns, responseTemplates) {
  for (const [entityType, pattern] of Object.entries(entityPatterns)) {
    const match = query.match(pattern);
    if (match) {
      const template = responseTemplates[entityType];
      return template.replace('{entity}', match[1]);
    }
  }
  
  return null;
}

/**
 * Recognize entities in text without using external API
 * @param {string} text - Text to analyze
 * @returns {Object} Recognized entities by type
 */
export function recognizeEntities(text) {
  const entities = {
    person: [],
    organization: [],
    location: [],
    date: [],
    skill: [],
    project: [],
    other: []
  };
  
  // Simple pattern matching for basic entity recognition
  // Person detection (improved with common name patterns)
  const personPattern = /\b(?:Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b|\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g;
  let match;
  while ((match = personPattern.exec(text)) !== null) {
    const name = match[1] || match[2];
    if (name && !entities.person.includes(name) && name.length > 1) {
      entities.person.push(name);
    }
  }
  
  // Organization detection (improved with common organization patterns)
  const orgPattern = /\b([A-Z][a-z]*(?:\s+[A-Z][a-z]*)*\s+(?:Inc\.|Corp\.|LLC|Ltd\.|Company|Organization|University|College|School))\b|\b([A-Z][A-Z]+)\b/g;
  while ((match = orgPattern.exec(text)) !== null) {
    const org = match[1] || match[2];
    if (org && !entities.organization.includes(org)) {
      entities.organization.push(org);
    }
  }
  
  // Location detection
  const locationPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Street|Avenue|Road|Boulevard|City|Town|State|Country|Park))\b|\b([A-Z][a-z]+(?:,\s+[A-Z][a-z]+)*)\b/g;
  while ((match = locationPattern.exec(text)) !== null) {
    const location = match[1] || match[2];
    if (location && !entities.location.includes(location)) {
      entities.location.push(location);
    }
  }
  
  // Date detection
  const datePattern = /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?(?:,\s+\d{4})?\b|\b\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}\b/g;
  while ((match = datePattern.exec(text)) !== null) {
    if (match[0] && !entities.date.includes(match[0])) {
      entities.date.push(match[0]);
    }
  }
  
  // Skill detection (using a predefined list from skills data)
  const skillsData = require('./data/skills').skillsData;
  for (const skill of skillsData) {
    if (text.toLowerCase().includes(skill.toLowerCase()) && !entities.skill.includes(skill)) {
      entities.skill.push(skill);
    }
  }
  
  // Project detection (using a predefined list from projects data)
  const projectsData = require('./data/projects-data').projectsData;
  for (const project of projectsData) {
    if (text.toLowerCase().includes(project.title.toLowerCase()) && !entities.project.includes(project.title)) {
      entities.project.push(project.title);


   

 }
  }
  
  return entities;
}

/**
 * Detect language of input text
 * @param {string} text - Text to analyze
 * @returns {string} Detected language code
 */
export function detectLanguage(text) {
  for (const [language, pattern] of Object.entries(languagePatterns)) {
    if (pattern.test(text)) {
      return language;
    }
  }
  return 'english'; // Default fallback
}

/**
 * Add a message to conversation history
 * @param {string} text - Message text
 * @param {string} role - Message role ('user' or 'bot')
 */
export function addToConversationHistory(text, role) {
  conversationHistory.push({
    text,
    role,
    timestamp: new Date()
  });
  
  // Limit history size
  if (conversationHistory.length > MAX_HISTORY_LENGTH) {
    conversationHistory.shift();
  }
}

/**
 * Get conversation history
 * @returns {Array} Conversation history
 */
export function getConversationHistory() {
  return [...conversationHistory];
}

/**
 * Clear conversation history
 */
export function clearConversationHistory() {
  conversationHistory = [];
}

/**
 * Add a successful response to the learning system
 * @param {string} query - User query
 * @param {string} response - Successful response
 */
export function learnResponse(query, response) {
  const keywords = extractKeywords(query);
  
  // Store response indexed by keywords for future reference
  keywords.forEach(keyword => {
    if (!learnedResponses[keyword]) {
      learnedResponses[keyword] = [];
    }
    
    // Avoid duplicates
    if (!learnedResponses[keyword].includes(response)) {
      learnedResponses[keyword].push(response);
    }
  });
}

/**
 * Get learned responses for a query
 * @param {string} query - User query
 * @returns {string|null} Learned response or null if none found
 */
export function getLearnedResponse(query) {
  const keywords = extractKeywords(query);
  const candidateResponses = [];
  
  // Collect all potential responses based on keywords
  keywords.forEach(keyword => {
    if (learnedResponses[keyword]) {
      candidateResponses.push(...learnedResponses[keyword]);
    }
  });
  
  if (candidateResponses.length === 0) return null;
  
  // Return the most frequent response
  const responseCounts = {};
  candidateResponses.forEach(response => {
    responseCounts[response] = (responseCounts[response] || 0) + 1;
  });
  
  let bestResponse = null;
  let highestCount = 0;
  
  for (const [response, count] of Object.entries(responseCounts)) {
    if (count > highestCount) {
      highestCount = count;
      bestResponse = response;
    }
  }
  
  return bestResponse;
}

/**
 * Fetch entity information from a free external API
 * This is a placeholder function - implement with your preferred free API
 * @param {string} text - Text to analyze
 * @returns {Promise<Object>} Recognized entities from external API
 */
export async function fetchEntitiesFromAPI(text) {
  try {
    // Get API key from environment variable
    const apiKey = process.env.MEANINGCLOUD_API_KEY;
    
    // Check if API key is configured
    if (!apiKey) {
      console.warn('MeaningCloud API key not configured. Using node-nlp for entity recognition.');
      // Use node-nlp for entity recognition instead
      const { recognizeEntitiesWithNodeNlp } = await import('./node-nlp-service');
      return await recognizeEntitiesWithNodeNlp(text);
    }
    
    const response = await fetch('https://api.meaningcloud.com/topics-2.0', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'key': apiKey,
        'txt': text,
        'lang': 'en',  // Default to English
        'tt': 'a'      // Analyze all entity types
      })
    });
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const data = await response.json();
    
    // Process API response into a standardized format
    // This will vary based on the API you choose
    const entities = {
      person: [],
      organization: [],
      location: [],
      date: [],
      other: []
    };
    
    // Extract entities from the API response
    if (data.entity_list) {
      data.entity_list.forEach(entity => {
        const type = mapEntityType(entity.type);
        if (entities[type]) {
          entities[type].push(entity.form);
        } else {
          entities.other.push(entity.form);
        }
      });
    }
    
    return entities;
  } catch (error) {
    console.error('Error fetching entities from API:', error);
    // Fallback to node-nlp entity recognition
    const { recognizeEntitiesWithNodeNlp } = await import('./node-nlp-service');
    return await recognizeEntitiesWithNodeNlp(text);
  }
}

/**
 * Map MeaningCloud entity types to our standardized types
 * @param {string} apiType - Entity type from API
 * @returns {string} Standardized entity type
 */
function mapEntityType(apiType) {
  const typeMap = {
    'P': 'person',
    'O': 'organization',
    'L': 'location',
    'D': 'date'
  };
  
  return typeMap[apiType] || 'other';
}

/**
 * Initialize Web Speech API for voice input/output
 * @returns {Object} Speech recognition and synthesis objects
 */
export function initSpeechSupport() {
  // Check if browser supports Web Speech API
  const browserSupport = {
    speechRecognition: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
    speechSynthesis: 'speechSynthesis' in window
  };
  
  // Initialize speech recognition if supported
  let recognition = null;
  if (browserSupport.speechRecognition) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
  }
  
  // Initialize speech synthesis if supported
  const synthesis = browserSupport.speechSynthesis ? window.speechSynthesis : null;
  
  return {
    browserSupport,
    recognition,
    synthesis,
    speak: (text, voiceIndex = 0, rate = 1, pitch = 1) => {
      if (!synthesis) return false;
      
      // Stop any current speech
      synthesis.cancel();
      
      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Get available voices
      const voices = synthesis.getVoices();
      if (voices.length > 0) {
        utterance.voice = voices[voiceIndex % voices.length];
      }
      
      utterance.rate = rate;
      utterance.pitch = pitch;
      
      // Speak the text
      synthesis.speak(utterance);
      return true;
    }
  };
}