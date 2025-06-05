/**
 * Node NLP Service
 * Provides entity recognition and NLP capabilities using node-nlp library
 */

import { NerManager } from 'node-nlp';
import { personalData } from './data/personal-data';
import { educations } from './data/educations';
import { experiences } from './data/experience';
import { skillsData } from './data/skills';
import { projectsData } from './data/projects-data';

// Initialize NER Manager
const nerManager = new NerManager({ threshold: 0.8 });

// Add entities and their options
function initializeNerManager() {
  // Add person entities
  nerManager.addNamedEntityText('person', 'plan', ['en'], ['Plan', 'Plan Ghimire', 'Ghimire']);
  
  // Add organization entities from experience data
  experiences.forEach(exp => {
    nerManager.addNamedEntityText('organization', exp.company.toLowerCase(), ['en'], [exp.company]);
  });
  
  // Add location entities
  if (personalData.address) {
    const locations = personalData.address.split(',').map(loc => loc.trim());
    locations.forEach(location => {
      nerManager.addNamedEntityText('location', location.toLowerCase(), ['en'], [location]);
    });
  }
  
  // Add skill entities
  skillsData.forEach(skill => {
    nerManager.addNamedEntityText('skill', skill.toLowerCase(), ['en'], [skill]);
  });
  
  // Add project entities
  projectsData.forEach(project => {
    nerManager.addNamedEntityText('project', project.title.toLowerCase(), ['en'], [project.title]);
  });
  
  // Add education entities
  educations.forEach(edu => {
    nerManager.addNamedEntityText('education', edu.institution.toLowerCase(), ['en'], [edu.institution]);
  });
}

// Initialize the NER manager
initializeNerManager();

/**
 * Recognize entities in text using node-nlp
 * @param {string} text - Text to analyze
 * @returns {Promise<Object>} Recognized entities by type
 */
async function recognizeEntitiesWithNodeNlp(text) {
  try {
    // Process the text with NER Manager
    const result = await nerManager.findEntities(text, 'en');
    
    // Format the results into our standard entity format
    const entities = {
      person: [],
      organization: [],
      location: [],
      date: [],
      skill: [],
      project: [],
      education: [],
      other: []
    };
    
    // Process the results
    result.forEach(entity => {
      const { entity: entityType, sourceText } = entity;
      
      if (entities[entityType] && !entities[entityType].includes(sourceText)) {
        entities[entityType].push(sourceText);
      } else if (!entities[entityType]) {
        entities.other.push(sourceText);
      }
    });
    
    return entities;
  } catch (error) {
    console.error('Error recognizing entities with node-nlp:', error);
    return {
      person: [],
      organization: [],
      location: [],
      date: [],
      skill: [],
      project: [],
      education: [],
      other: []
    };
  }
}

export {
  recognizeEntitiesWithNodeNlp
};