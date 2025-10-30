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

const generateImageForPrompt = async (prompt: string): Promise<string> => {
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
        console.error("Error generating image for prompt:", error);
        throw error;
    }
};

export const generateDesignViews = async (
  measurements: Measurements,
  fabrics: Fabric[],
  design: Design
): Promise<string[]> => {
  const fabricNames = fabrics.map(f => f.name).join(', ');
  const ageDescription = generateAgeDescription(measurements.age, measurements.sex);

  const prompts = [
    // 1. Front View
    `Generate a photorealistic, full-body image of ${ageDescription} from the **front**. The model must be wearing a dress in the style of a "${design.name}". The dress must be made from a creative combination of the following fabrics: ${fabricNames}. The setting is a professional fashion studio with a clean, neutral background. The model's pose must be natural and confident, showcasing the full dress clearly. The final image should be of ultra-high quality, suitable for a fashion catalog.`,
    
    // 2. Back View
    `Generate a photorealistic, full-body image of ${ageDescription} from the **back**, clearly showing the rear design of the dress. The model must be wearing a dress in the style of a "${design.name}" made from ${fabricNames}. The setting is a professional fashion studio with a clean, neutral background. The model's pose should effectively display the back details. The final image should be of ultra-high quality.`,
    
    // 3. Detail View
    `Generate a **close-up, detailed shot** of the fabric and craftsmanship of a dress. The dress is in the style of a "${design.name}" made from ${fabricNames}. Focus on the texture of the fabric and any intricate details like seams, neckline, or sleeve design. Do not show a full model, only the dress details. The image should be of macro-quality, highlighting the material's quality.`,
    
    // 4. Lifestyle View
    `Generate a photorealistic image of ${ageDescription} wearing a dress in the style of a "${design.name}" made from ${fabricNames}. The setting is an elegant evening event or a beautiful garden party, with soft, natural lighting. The model should have a natural, candid pose. The image should feel like a high-end fashion magazine lifestyle photo.`
  ];
  
  const imagePromises = prompts.map(prompt => generateImageForPrompt(prompt));
  return Promise.all(imagePromises);
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