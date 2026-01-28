import { GoogleGenAI, Type } from '@google/genai';
import { GeneratedContent } from '@type-schema/common';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateWordDetails = async (word: string): Promise<GeneratedContent | null> => {
  if (!apiKey) {
    console.error('API Key is missing');
    throw new Error('Gemini API Key is missing. Please check your environment.');
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide detailed information for the English vocabulary word: "${word}". 
      Return the English definition, an example sentence in English, the Vietnamese translation of the word, and the IPA phonetic transcription.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            definition: { type: Type.STRING, description: 'Short, clear definition in English' },
            example: { type: Type.STRING, description: 'A sentence using the word in context' },
            translation: { type: Type.STRING, description: 'Vietnamese meaning of the word' },
            phonetic: { type: Type.STRING, description: 'IPA phonetic transcription' },
          },
          required: ['definition', 'example', 'translation', 'phonetic'],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedContent;
    }
    return null;
  } catch (error) {
    console.error('Error generating word details:', error);
    throw error;
  }
};
