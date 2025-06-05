import { NextResponse } from 'next/server';
import { personalData } from '../../../utils/data/personal-data';
import { educations } from '../../../utils/data/educations';
import { experiences } from '../../../utils/data/experience';
import { skillsData } from '../../../utils/data/skills';
import { projectsData } from '../../../utils/data/projects-data';
import {
  calculateSimilarity,
  extractKeywords,
  findIntent,
  recognizeEntities,
  addToConversationHistory,
  getConversationHistory,
  getLearnedResponse,
  learnResponse,
  detectLanguage,
  fetchEntitiesFromAPI
} from '../../../utils/chatbot-nlp';

// Knowledge base created from personal data
const knowledgeBase = {
  personal: personalData,
  education: educations,
  experience: experiences,
  skills: skillsData,
  projects: projectsData,
};

// Intent examples for better matching
const intentExamples = {
  greeting: [
    'hello', 'hi', 'hey there', 'greetings', 'good morning', 'good afternoon', 'good evening',
    'howdy', 'what\'s up', 'hello there'
  ],
  about: [
    'who are you', 'tell me about yourself', 'who is plan', 'about plan', 'your background',
    'tell me about plan', 'what do you do', 'who is plan ghimire', 'about plan ghimire'
  ],
  contact: [
    'how can i contact', 'contact information', 'email address', 'phone number', 'how to reach',
    'contact details', 'how do i get in touch', 'social media', 'contact plan'
  ],
  education: [
    'education', 'where did you study', 'academic background', 'university', 'college',
    'degree', 'what did you study', 'educational qualifications', 'academic history'
  ],
  experience: [
    'work experience', 'job history', 'professional experience', 'career', 'where have you worked',
    'previous jobs', 'work history', 'professional background', 'employment history'
  ],
  skills: [
    'skills', 'what can you do', 'technologies', 'programming languages', 'technical skills',
    'what are you good at', 'competencies', 'abilities', 'expertise', 'tech stack'
  ],
  projects: [
    'projects', 'portfolio', 'what have you built', 'showcase', 'work samples',
    'project portfolio', 'applications', 'websites', 'software projects'
  ],
  social: [
    'social media', 'github', 'linkedin', 'twitter', 'facebook', 'social links',
    'social profiles', 'online presence', 'follow on social media'
  ],
  resume: [
    'resume', 'cv', 'curriculum vitae', 'download resume', 'can i see your resume',
    'resume link', 'where is your resume', 'share your cv'
  ],
  help: [
    'help', 'what can you do', 'how do you work', 'commands', 'options',
    'features', 'capabilities', 'how to use', 'instructions'
  ],
  thanks: [
    'thank you', 'thanks', 'appreciate it', 'thank you so much', 'thanks a lot',
    'grateful', 'thank you for your help'
  ],
};

// Multilingual responses - basic translations for common intents
const multilingualResponses = {
  english: {
    greeting: `Hello! I'm a virtual assistant for Plan Ghimire. How can I help you today?`,
    about: `${personalData.name} is ${personalData.Designations}. ${personalData.description}`,
    thanks: `You're welcome! Feel free to ask if you need anything else.`,
    help: `I can provide information about Plan's background, education, skills, projects, and contact details. Just ask me what you'd like to know!`
  },
  spanish: {
    greeting: `¡Hola! Soy un asistente virtual para Plan Ghimire. ¿Cómo puedo ayudarte hoy?`,
    about: `${personalData.name} es ${personalData.Designations}. ${personalData.description}`,
    thanks: `¡De nada! No dudes en preguntar si necesitas algo más.`,
    help: `Puedo proporcionar información sobre los antecedentes, educación, habilidades, proyectos y datos de contacto de Plan. ¡Solo pregúntame lo que te gustaría saber!`
  },
  french: {
    greeting: `Bonjour! Je suis un assistant virtuel pour Plan Ghimire. Comment puis-je vous aider aujourd'hui?`,
    about: `${personalData.name} est ${personalData.Designations}. ${personalData.description}`,
    thanks: `Je vous en prie! N'hésitez pas à demander si vous avez besoin d'autre chose.`,
    help: `Je peux fournir des informations sur le parcours, l'éducation, les compétences, les projets et les coordonnées de Plan. Demandez-moi simplement ce que vous aimeriez savoir!`
  },
  nepali: {
    greeting: `नमस्ते! म प्लान घिमिरेको भर्चुअल सहायक हुँ। म आज तपाईंलाई कसरी मद्दत गर्न सक्छु?`,
    about: `${personalData.name} ${personalData.Designations} हुनुहुन्छ। ${personalData.description}`,
    thanks: `तपाईंलाई स्वागत छ! अरु केहि चाहिएमा सोध्न नहिचकिचाउनुहोस्।`,
    help: `म प्लानको पृष्ठभूमि, शिक्षा, सीप, परियोजनाहरू, र सम्पर्क विवरणहरूको बारेमा जानकारी प्रदान गर्न सक्छु। तपाईंलाई के जान्न मन लाग्छ, सोध्नुहोस्!`
  }
};

// Response templates based on intent
const intentResponses = {
  greeting: `Hello! I'm a virtual assistant for Plan Ghimire. How can I help you today?`,
  about: `${personalData.name} is ${personalData.Designations}. ${personalData.description}`,
  contact: `You can contact Plan at Email: ${personalData.email}, Phone: ${personalData.phone}, or visit at ${personalData.address}.`,
  education: `Plan's educational background includes: ${educations.map(edu => `${edu.title} at ${edu.institution} (${edu.duration})`).join(', ')}.`,
  experience: `Plan's professional experience includes: ${experiences.map(exp => `${exp.role} at ${exp.company} (${exp.duration})`).join(', ')}.`,
  skills: `Plan's technical skills include: ${skillsData.join(', ')}.`,
  projects: `Plan has worked on various projects including ${projectsData.filter(p => p.name).map(p => p.name).join(', ') || 'several projects that are currently being updated'}.`,
  social: `You can find Plan on: GitHub: ${personalData.github}, LinkedIn: ${personalData.linkedIn}, Twitter: ${personalData.twitter}, Facebook: ${personalData.facebook}.`,
  resume: `You can view Plan's resume at ${personalData.resume}.`,
  help: `I can provide information about Plan's background, education, skills, projects, and contact details. Just ask me what you'd like to know!`,
  thanks: `You're welcome! Feel free to ask if you need anything else.`,
};

// Entity patterns for specific information extraction
const entityPatterns = {
  project: /tell me about (.*?) project/i,
  skill: /do you know (.*?)\?/i,
  company: /experience at (.*?)\?/i,
  education: /study at (.*?)\?/i,
};

// Response templates for entity-based responses
const entityResponses = {
  project: `Plan has worked on the {entity} project. Let me find more details about it.`,
  skill: `Yes, Plan is proficient in {entity} and has used it in several projects.`,
  company: `Plan worked at {entity} as part of their professional experience.`,
  education: `Plan studied at {entity} as part of their educational background.`,
};

// Function to generate a response based on keywords in the query
function generateKeywordResponse(query) {
  const keywords = extractKeywords(query);
  const responses = [];
  
  // Check for keywords related to specific data points
  for (const keyword of keywords) {
    if (['email', 'mail', 'contact'].includes(keyword)) {
      responses.push(`Plan's email is ${personalData.email}.`);
    }
    if (['phone', 'call', 'telephone', 'mobile'].includes(keyword)) {
      responses.push(`Plan's phone number is ${personalData.phone}.`);
    }
    if (['location', 'address', 'live', 'based'].includes(keyword)) {
      responses.push(`Plan is located in ${personalData.address}.`);
    }
    if (['github', 'repo', 'repository', 'code'].includes(keyword)) {
      responses.push(`Check out Plan's GitHub at ${personalData.github}.`);
    }
    if (['linkedin', 'professional', 'network'].includes(keyword)) {
      responses.push(`Connect with Plan on LinkedIn at ${personalData.linkedIn}.`);
    }
  }
  
  return responses.length > 0 ? responses.join(' ') : null;
}

// Function to find the best response based on user query
async function findBestResponse(query, sessionId) {
  // Detect language
  const language = detectLanguage(query);
  
  // Try to get a learned response first (if we've seen similar queries before)
  const learnedResponse = getLearnedResponse(query);
  if (learnedResponse) {
    return { response: learnedResponse, language };
  }
  
  // Try to match an intent
  const intent = findIntent(query, intentExamples, 0.3);
  if (intent) {
    // Check if we have a translation for this intent in the detected language
    if (language !== 'english' && multilingualResponses[language] && multilingualResponses[language][intent]) {
      return { response: multilingualResponses[language][intent], language };
    }
    return { response: intentResponses[intent], language };
  }
  
  // Try entity recognition
  try {
    // First try with the external API if available
    const entities = await fetchEntitiesFromAPI(query);
    
    // Check if we found any useful entities
    if (entities && Object.values(entities).some(arr => arr.length > 0)) {
      // Generate a response based on recognized entities
      const entityResponse = generateEntityBasedResponse(query, entities);
      if (entityResponse) {
        return { response: entityResponse, language };
      }
    }
  } catch (error) {
    console.error('Error with entity recognition:', error);
    // Continue with other methods if entity recognition fails
  }
  
  // Handle specific keywords with unique responses
  const lowerCaseQuery = query.toLowerCase();
  if (lowerCaseQuery.includes('love')) {
    return { response: `Love is a beautiful thing! I'm glad you're feeling it.`, language };
  }
  if (lowerCaseQuery.includes('hate')) {
    return { response: `Hate is a strong emotion. Perhaps we can find something more positive to talk about?`, language };
  }
  if (lowerCaseQuery.includes('fuck')) {
    return { response: `Whoa there! Let's keep it clean and friendly. How can I assist you without the colorful language?`, language };
  }

  // Try keyword-based response
  const keywordResponse = generateKeywordResponse(query);
  if (keywordResponse) {
    return { response: keywordResponse, language };
  }
  
  // Check for specific topics in the query
  const topics = {
    'frontend': 'Plan has experience with frontend technologies like React, Next.js, and various CSS frameworks.',
    'backend': 'Plan works with backend technologies including Node.js and MongoDB.',
    'database': 'Plan has experience with databases like MongoDB, MySQL, and PostgreSQL.',
    'design': 'Plan has skills in design tools like Figma and Adobe XD.',
    'mobile': 'Plan has worked on responsive web applications that work well on mobile devices.',
    'game': 'Plan has some experience with game development using technologies like Three.js.',
    'ai': 'Plan has explored AI and machine learning concepts and is interested in this field.',
  };
  
  for (const [topic, response] of Object.entries(topics)) {
    if (query.toLowerCase().includes(topic)) {
      return { response, language };
    }
  }
  
  // Default response if no match is found
  const defaultResponses = {
    english: [
      `I don't have specific information about that. Plan Ghimire is ${personalData.Designations} with expertise in ${skillsData.slice(0, 3).join(', ')}. Would you like to know about Plan's education, experience, skills, or projects?`,
      `I'm not sure I understand that query. I can tell you about Plan Ghimire, who specializes in ${skillsData.slice(0, 3).join(', ')}. What would you like to know?`,
      `I don't have that information, but I'd be happy to tell you about Plan's background, projects, or skills instead.`,
      `That's beyond my current knowledge. I can help with information about Plan Ghimire's professional experience, education, or projects. What interests you?`,
      `I'm still learning! While I don't have an answer for that, I can share details about Plan's expertise in ${skillsData.slice(3, 6).join(', ')}. Would that help?`,
      `That's an interesting one! I'm still learning, so I don't have a perfect answer for that yet. Can you tell me more?`,
      `Hmm, my circuits are buzzing, but I'm not quite sure how to respond to that. Maybe try asking in a different way?`,
      `I'm not programmed for that specific query, but I'm always eager to learn! What else can I help you with?`,
      `My apologies, I seem to be at a loss for words! Perhaps we can talk about something else?`,
      `You've stumped me! But in a good way. What other fascinating questions do you have for me?`
    ],
    spanish: [
      `No tengo información específica sobre eso. Plan Ghimire es ${personalData.Designations} con experiencia en ${skillsData.slice(0, 3).join(', ')}. ¿Te gustaría saber sobre la educación, experiencia, habilidades o proyectos de Plan?`,
      `No estoy seguro de entender esa consulta. Puedo hablarte sobre Plan Ghimire, que se especializa en ${skillsData.slice(0, 3).join(', ')}. ¿Qué te gustaría saber?`,
      `Eso es interesante! Todavía estoy aprendiendo, así que no tengo una respuesta perfecta para eso todavía. ¿Puedes contarme más?`,
      `Hmm, mis circuitos están zumbando, pero no estoy muy seguro de cómo responder a eso. ¿Quizás intentes preguntar de otra manera?`,
      `No estoy programado para esa consulta específica, ¡pero siempre estoy ansioso por aprender! ¿En qué más puedo ayudarte?`,
      `Mis disculpas, ¡parece que me he quedado sin palabras! ¿Quizás podamos hablar de otra cosa?`,
      `¡Me has dejado perplejo! Pero en el buen sentido. ¿Qué otras preguntas fascinantes tienes para mí?`
    ],
    french: [
      `Je n'ai pas d'informations spécifiques à ce sujet. Plan Ghimire est ${personalData.Designations} avec une expertise en ${skillsData.slice(0, 3).join(', ')}. Souhaitez-vous en savoir plus sur l'éducation, l'expérience, les compétences ou les projets de Plan?`,
      `Je ne suis pas sûr de comprendre cette requête. Je peux vous parler de Plan Ghimire, qui est spécialisé en ${skillsData.slice(0, 3).join(', ')}. Qu'aimeriez-vous savoir?`,
      `C'est intéressant! J'apprends encore, donc je n'ai pas encore de réponse parfaite à cela. Peux-tu m'en dire plus?`,
      `Hmm, mes circuits bourdonnent, mais je ne suis pas tout à fait sûr de la façon de répondre à cela. Peut-être essayer de demander d'une manière différente?`,
      `Je ne suis pas programmé pour cette requête spécifique, mais je suis toujours désireux d'apprendre! Avec quoi d'autre puis-je vous aider?`,
      `Mes excuses, je semble être à court de mots! Peut-être pouvons-nous parler d'autre chose?`,
      `Tu m'as époustouflé! Mais dans le bon sens. Quelles autres questions fascinantes as-tu pour moi?`
    ],
    nepali: [
      `मलाई त्यस बारेमा खासै जानकारी छैन। प्लान घिमिरे ${personalData.Designations} हुनुहुन्छ र उहाँसँग ${skillsData.slice(0, 3).join(', ')} मा विशेषज्ञता छ। के तपाईं प्लानको शिक्षा, अनुभव, सीप, वा परियोजनाहरूको बारेमा जान्न चाहनुहुन्छ?`,
      `मलाई त्यो प्रश्न बुझ्न गाह्रो भयो। म तपाईंलाई प्लान घिमिरेको बारेमा बताउन सक्छु, जो ${skillsData.slice(0, 3).join(', ')} मा विशेषज्ञ हुनुहुन्छ। तपाईं के जान्न चाहनुहुन्छ?`,
      `मसँग त्यो जानकारी छैन, तर म तपाईंलाई प्लानको पृष्ठभूमि, परियोजनाहरू, वा सीपहरूको बारेमा बताउन पाउँदा खुसी हुनेछु।`,
      `त्यो मेरो हालको ज्ञान भन्दा बाहिर छ। म तपाईंलाई प्लान घिमिरेको व्यावसायिक अनुभव, शिक्षा, वा परियोजनाहरूको बारेमा मद्दत गर्न सक्छु। तपाईंलाई केमा रुचि छ?`,
      `म अझै सिक्दै छु! मसँग त्यसको जवाफ नभए पनि, म प्लानको ${skillsData.slice(3, 6).join(', ')} मा रहेको विशेषज्ञताको बारेमा जानकारी दिन सक्छु। के त्यसले मद्दत गर्छ?`,
      `यो रोचक छ! म अझै सिक्दै छु, त्यसैले मसँग यसको लागि उत्तम जवाफ छैन। के तपाईं मलाई थप बताउन सक्नुहुन्छ?`,
      `हमम्, मेरो सर्किटहरू बजिरहेका छन्, तर मलाई त्यसको जवाफ कसरी दिने भन्ने निश्चित छैन। के तपाईं फरक तरिकाले सोध्न सक्नुहुन्छ?`,
      `म त्यो विशेष प्रश्नको लागि प्रोग्राम गरिएको छैन, तर म सधैं सिक्न उत्सुक छु! म तपाईंलाई अरू केमा मद्दत गर्न सक्छु?`,
      `मेरो माफी, म शब्दविहीन भएको जस्तो लाग्छ! सायद हामी अरू केही कुरा गर्न सक्छौं?`,
      `तपाईंले मलाई अलमलमा पार्नुभयो! तर राम्रो तरिकाले। तपाईंसँग मसँग अरू कुन रोचक प्रश्नहरू छन्?`
    ]
  };
  
  // Select a random response from the appropriate language array
  const responseArray = defaultResponses[language] || defaultResponses.english;
  const randomIndex = Math.floor(Math.random() * responseArray.length);
  const defaultResponse = responseArray[randomIndex];
  
  return { response: defaultResponse, language };
}

// Generate a response based on recognized entities
function generateEntityBasedResponse(query, entities) {
  // Check for person entities
  if (entities.person && entities.person.length > 0) {
    const person = entities.person[0];
    if (person.toLowerCase().includes('plan') || person.toLowerCase().includes('ghimire')) {
      return `Yes, Plan Ghimire is ${personalData.Designations} with expertise in ${skillsData.slice(0, 3).join(', ')}.`;
    }
    return `I don't have information about ${person}. I can only provide information about Plan Ghimire.`;
  }
  
  // Check for organization entities
  if (entities.organization && entities.organization.length > 0) {
    const org = entities.organization[0];
    const matchingExperience = experiences.find(exp => 
      exp.company.toLowerCase().includes(org.toLowerCase()));
    
    if (matchingExperience) {
      return `Plan worked at ${matchingExperience.company} as ${matchingExperience.role} during ${matchingExperience.duration}. ${matchingExperience.description.slice(0, 100)}...`;
    }
    return `I don't have information about Plan's connection to ${org}. Would you like to know about his work experience elsewhere?`;
  }
  
  // Check for location entities
  if (entities.location && entities.location.length > 0) {
    const location = entities.location[0];
    if (personalData.address && personalData.address.includes(location)) {
      return `Yes, Plan is located in ${personalData.address}.`;
    }
    return `I don't have information about Plan's connection to ${location}. Would you like to know where he's currently based?`;
  }
  
  // Check for skill entities
  if (entities.skill && entities.skill.length > 0) {
    const skill = entities.skill[0];
    if (skillsData.some(s => s.toLowerCase() === skill.toLowerCase())) {
      return `Yes, Plan is proficient in ${skill}. He has used it in several projects.`;
    }
    return `I don't see ${skill} listed in Plan's skills. His top skills include ${skillsData.slice(0, 5).join(', ')}.`;
  }
  
  // Check for project entities
  if (entities.project && entities.project.length > 0) {
    const project = entities.project[0];
    const matchingProject = projectsData.find(p => 
      p.title.toLowerCase().includes(project.toLowerCase()));
    
    if (matchingProject) {
      return `Plan worked on ${matchingProject.title}, which is ${matchingProject.description}. It was built using ${matchingProject.technologies.join(', ')}.`;
    }
    return `I don't have information about a project called ${project}. Would you like to know about some of Plan's other projects?`;
  }
  
  // Check for education entities
  if (entities.education && entities.education.length > 0) {
    const education = entities.education[0];
    const matchingEducation = educations.find(edu => 
      edu.institution.toLowerCase().includes(education.toLowerCase()));
    
    if (matchingEducation) {
      return `Plan studied at ${matchingEducation.institution} for his ${matchingEducation.degree} during ${matchingEducation.duration}.`;
    }
    return `I don't have information about Plan's connection to ${education}. Would you like to know about his educational background?`;
  }
  
  // Check for date entities
  if (entities.date && entities.date.length > 0) {
    const date = entities.date[0];
    // Try to match with experience dates
    const matchingExperience = experiences.find(exp => 
      exp.duration.includes(date));
    
    if (matchingExperience) {
      return `During ${date}, Plan was working at ${matchingExperience.company} as ${matchingExperience.role}.`;
    }
    
    // Try to match with education dates
    const matchingEducation = educations.find(edu => 
      edu.duration.includes(date));
    
    if (matchingEducation) {
      return `During ${date}, Plan was studying at ${matchingEducation.institution} for his ${matchingEducation.degree}.`;
    }
    
    return `I don't have specific information about what Plan was doing in ${date}.`;
  }
  
  return null; // No entity-based response generated
}

export async function POST(request) {
  try {
    const { query, sessionId = 'default', feedback } = await request.json();
    
    if (!query) {
      return NextResponse.json({
        success: false,
        message: 'Query is required',
      }, { status: 400 });
    }
    
    // If feedback is provided, use it to improve the learning system
    if (feedback && feedback.previousQuery && feedback.previousResponse && feedback.isHelpful) {
      learnResponse(feedback.previousQuery, feedback.previousResponse);
    }
    
    // Add the user query to conversation history
    addToConversationHistory(query, 'user');
    
    // Generate response
    const { response, language } = await findBestResponse(query, sessionId);
    
    // Add the bot response to conversation history
    addToConversationHistory(response, 'bot');
    
    return NextResponse.json({
      success: true,
      message: 'Response generated successfully',
      data: {
        response,
        language,
        sessionId
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process your request',
    }, { status: 500 });
  }
};