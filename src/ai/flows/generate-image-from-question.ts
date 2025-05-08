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
  question: z.string().describe('The hypothetical question to generate an image from.'),
});
export type GenerateImageFromQuestionInput = z.infer<typeof GenerateImageFromQuestionInputSchema>;

const GenerateImageFromQuestionOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateImageFromQuestionOutput = z.infer<typeof GenerateImageFromQuestionOutputSchema>;

export async function generateImageFromQuestion(input: GenerateImageFromQuestionInput): Promise<GenerateImageFromQuestionOutput> {
  return generateImageFromQuestionFlow(input);
}

// This prompt is now used directly by ai.generate, not as a definePrompt object for this flow.
const imageGenerationUserPrompt = (question: string) => 
  `Generate a visually stunning, creative, and imaginative image that vividly represents the hypothetical scenario posed in the following question. The image should be fantastical, dreamlike, and align with a whimsical, magical theme. Emphasize vibrant colors and an expressive, artistic style.

Question: "${question}"`;


const generateImageFromQuestionFlow = ai.defineFlow(
  {
    name: 'generateImageFromQuestionFlow',
    inputSchema: GenerateImageFromQuestionInputSchema,
    outputSchema: GenerateImageFromQuestionOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp', // Ensure this model supports image generation
      prompt: imageGenerationUserPrompt(input.question),
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // Must include IMAGE
         // Adjust safety for creative image generation if needed, though defaults are usually fine
        safetySettings: [
           { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
           // Other categories can be less restrictive for creative images if desired
        ]
      },
    });
    if (!media || !media.url) {
      throw new Error("Image generation failed or returned no URL.");
    }
    return {imageUrl: media.url};
  }
);
