
import { GoogleGenAI, Modality } from "@google/genai";
import { Measurements, Fabric, Design } from '../types';

if (!process.env.API_KEY) {
  // This is a placeholder for development. In a real environment, the key would be set.
  // We'll proceed assuming it's available, but this prevents a hard crash if it's not.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const generateAgeDescription = (age: number, sex: string): string => {
  if (age < 13) return `an Indian ${sex === 'female' ? 'girl' : 'boy'} aged around ${age}`;
  if (age >= 13 && age <= 19) return `an Indian teenage ${sex === 'female' ? 'girl' : 'boy'} aged around ${age}`;
  return `an Indian ${sex === 'female' ? 'woman' : 'man'} aged around ${age}`;
};

export const generateDressDesign = async (
  measurements: Measurements,
  fabrics: Fabric[],
  design: Design
): Promise<string> => {
  const fabricNames = fabrics.map(f => f.name).join(', ');
  const ageDescription = generateAgeDescription(measurements.age, measurements.sex);

  const prompt = `
    Generate a photorealistic, full-body image of ${ageDescription}.
    The model must be wearing a dress in the style of a "${design.name}".
    The dress must be made from a creative combination of the following fabrics: ${fabricNames}. Each generated image should showcase a different and unique variation of fabric usage.
    The setting is a professional fashion studio with a clean, neutral background.
    The model's pose must be natural and confident, showcasing the full dress clearly.
    The final image should be of ultra-high quality, suitable for a fashion catalog.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in Gemini response.");
  } catch (error) {
    console.error("Error generating dress design:", error);
    throw error;
  }
};

export const editDressDesign = async (
  base64ImageData: string,
  prompt: string
): Promise<string> => {
  const [header, data] = base64ImageData.split(',');
  const mimeType = header.match(/:(.*?);/)?.[1];
  if (!data || !mimeType) {
    throw new Error("Invalid base64 image data format.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data, mimeType } },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in Gemini edit response.");
  } catch (error) {
    console.error("Error editing dress design:", error);
    throw error;
  }
};
