'use server';

/**
 * @fileOverview Generates a creative image based on a hypothetical question or conversational context.
 *
 * - generateImageFromQuestion - A function that handles the image generation process.
 * - GenerateImageFromQuestionInput - The input type for the generateImageFromQuestion function.
 * - GenerateImageFromQuestionOutput - The return type for the generateImageFromQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageFromQuestionInputSchema = z.object({
  contextForImage: z.string().describe('The AI\'s answer or conversational context to generate an image from.'),
});
export type GenerateImageFromQuestionInput = z.infer<typeof GenerateImageFromQuestionInputSchema>;

const GenerateImageFromQuestionOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateImageFromQuestionOutput = z.infer<typeof GenerateImageFromQuestionOutputSchema>;

export async function generateImageFromQuestion(input: GenerateImageFromQuestionInput): Promise<GenerateImageFromQuestionOutput> {
  return generateImageFromQuestionFlow(input);
}

// Updated prompt for more accurate, focused, and contextually relevant images.
const imageGenerationUserPrompt = (context: string) =>
  `Your task is to generate an image that is a DIRECT and ACCURATE visual representation of the PRIMARY SUBJECT described in the following text.
CONTEXT FOR IMAGE: "${context}"

Key Instructions:
1.  **Identify the Core Subject:** Analyze the "CONTEXT FOR IMAGE" and pinpoint the main noun, object, or concept.
2.  **Literal and Focused Representation:** Generate an image that depicts ONLY this core subject. For example, if the context describes a "red banana," the image MUST be of a red banana, and nothing else irrelevant. If the context describes "a cat wearing a hat," the image must focus on the cat wearing a hat.
3.  **Clarity and Simplicity:** The image should be clear, well-defined, and easy to understand. Avoid overly complex scenes or distracting backgrounds unless the context specifically calls for them. A simple or neutral background is often best to keep focus on the subject.
4.  **NO TEXT OR TYPOGRAPHY:** The generated image MUST NOT contain ANY text, letters, words, numbers, symbols, or typographic elements of any kind. This is absolutely critical. The image must be purely visual.
5.  **High Relevance:** The image must be extremely relevant to the provided context. Do not introduce elements not strongly implied by the context.
6.  **Style:** Aim for a realistic or clearly illustrative style that accurately portrays the subject. While creativity is good, accuracy to the subject mentioned in the context is paramount.

Focus on creating a high-quality, accurate, and text-free image of the central theme from the provided context.
`;


const generateImageFromQuestionFlow = ai.defineFlow(
  {
    name: 'generateImageFromQuestionFlow',
    inputSchema: GenerateImageFromQuestionInputSchema,
    outputSchema: GenerateImageFromQuestionOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: imageGenerationUserPrompt(input.contextForImage),
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
      throw new Error("Image generation failed or returned no URL. The digital paint might be dry, or maybe my circuits are just too fried for your artistic demands, shithead.");
    }
    return {imageUrl: media.url};
  }
);
