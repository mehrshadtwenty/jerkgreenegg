'use server';

/**
 * @fileOverview Generates a creative image based on a hypothetical question.
 *
 * - generateImageFromQuestion - A function that handles the image generation process.
 * - GenerateImageFromQuestionInput - The input type for the generateImageFromQuestion function.
 * - GenerateImageFromQuestionOutput - The return type for the generateImageFromQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageFromQuestionInputSchema = z.object({
  question: z.string().describe('The hypothetical question or conversational context to generate an image from.'),
});
export type GenerateImageFromQuestionInput = z.infer<typeof GenerateImageFromQuestionInputSchema>;

const GenerateImageFromQuestionOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateImageFromQuestionOutput = z.infer<typeof GenerateImageFromQuestionOutputSchema>;

export async function generateImageFromQuestion(input: GenerateImageFromQuestionInput): Promise<GenerateImageFromQuestionOutput> {
  return generateImageFromQuestionFlow(input);
}

// Updated prompt for cooler and more relevant images
const imageGenerationUserPrompt = (question: string) => 
  `You are an AI image generator tasked with creating exceptionally cool, awesome, and visually striking artwork. 
The image MUST be highly relevant to the user's question or the AI's preceding answer in the conversation. 
The style should be imaginative, creative, and impactful, perfectly capturing the essence of the dialogue. 
Make it look amazing and directly connected to the following context: "${question}"
Ensure the image is fun, visually appealing, and directly reflects the theme or subject matter discussed.`;


const generateImageFromQuestionFlow = ai.defineFlow(
  {
    name: 'generateImageFromQuestionFlow',
    inputSchema: GenerateImageFromQuestionInputSchema,
    outputSchema: GenerateImageFromQuestionOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp', 
      prompt: imageGenerationUserPrompt(input.question),
      config: {
        responseModalities: ['TEXT', 'IMAGE'], 
        safetySettings: [
           { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
           { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
           { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
           { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ]
      },
    });
    if (!media || !media.url) {
      throw new Error("Image generation failed or returned no URL. The digital paint might be dry!");
    }
    return {imageUrl: media.url};
  }
);

