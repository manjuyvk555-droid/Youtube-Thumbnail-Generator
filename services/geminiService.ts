
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { GeneratedImage } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateThumbnail = async (title: string, headshotBase64: string, mimeType: string): Promise<GeneratedImage> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  
  const model = 'gemini-2.5-flash-image-preview';

  const prompt = `Create a vibrant and eye-catching YouTube thumbnail with a 16:9 aspect ratio.
  - Seamlessly integrate this headshot of the creator into a dynamic, professional design.
  - The video title is: "${title}". Use bold, contrasting, and easily readable text for this title. Make it the main focus.
  - The design should have vibrant colors and elements that look exciting and clickable. Use a modern and clean aesthetic.
  - Add subtle shadows or highlights to the text and headshot to make them pop.
  - The final image should be clean, high-quality, and optimized for attracting viewers.
  - Do NOT include any text other than the provided title. Output ONLY the final image.`;


  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: headshotBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
    
    if (imagePart && imagePart.inlineData) {
        return {
            data: imagePart.inlineData.data,
            mimeType: imagePart.inlineData.mimeType
        };
    } else {
        const textPart = response.candidates?.[0]?.content?.parts?.find(part => part.text);
        const rejectionReason = response.candidates?.[0]?.finishReason;
        const safetyRatings = response.candidates?.[0]?.safetyRatings;
        
        console.error("API Response Details:", {
          text: textPart?.text,
          finishReason: rejectionReason,
          safetyRatings
        });

        if (rejectionReason === 'SAFETY') {
          throw new Error("Thumbnail generation failed due to safety settings. Please try a different title or image.");
        }
        
        throw new Error('No image was generated. The AI may have returned text instead. ' + (textPart?.text || ''));
    }
  } catch (error) {
    console.error("Error generating thumbnail:", error);
    throw new Error(`Failed to generate thumbnail. ${error instanceof Error ? error.message : ''}`);
  }
};
