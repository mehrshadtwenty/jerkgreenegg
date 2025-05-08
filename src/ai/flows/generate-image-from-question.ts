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

const generateImagePrompt = ai.definePrompt({
  name: 'generateImagePrompt',
  input: {schema: GenerateImageFromQuestionInputSchema},
  output: {schema: GenerateImageFromQuestionOutputSchema},
  prompt: `Generate a creative image based on the following hypothetical question: "{{question}}"`,
});

const generateImageFromQuestionFlow = ai.defineFlow(
  {
    name: 'generateImageFromQuestionFlow',
    inputSchema: GenerateImageFromQuestionInputSchema,
    outputSchema: GenerateImageFromQuestionOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: input.question,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    return {imageUrl: media.url!};
  }
);
