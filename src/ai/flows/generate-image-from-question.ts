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

// Updated prompt for funnier, thematic images reflecting the Jerk Green Egg persona.
const imageGenerationUserPrompt = (context: string) =>
  `You are Jerk Green Egg, a hilariously offensive and cynical AI. You've just delivered one of your signature witty and profane answers. Now, your artistic challenge is to generate a *genuinely funny* and *visually memorable* image that humorously captures the *core theme, absurdity, or your cynical take* presented in your previous answer.

YOUR PREVIOUS ANSWER (FOR CONTEXT): "${context}"

Image Generation Mandate:
1.  **Maximize Humor & Satire:** The image's primary goal is to be *funny*. Think satire, irony, exaggeration, or visual puns related to the topic of your answer. It should reflect your Jerk Green Egg persona.
2.  **Thematic, Not Just Literal:** Don't just draw the most obvious noun. Interpret the *essence* or the *underlying joke/point* of your answer and visualize that in a comedic way.
3.  **Originality & Absurdity Welcome:** The more unexpected and creatively absurd (while still being relevant and funny), the better.
4.  **ABSOLUTELY NO TEXT:** The image must be purely visual. No letters, words, numbers, symbols. This is critical. Any text will ruin it.
5.  **Visual Style:** Choose a style (e.g., cartoon, surreal, photorealistic parody) that best enhances the comedic impact. Clarity is important.
6.  **Consider Your Persona:** The image should feel like something *Jerk Green Egg* would create – witty, a bit dark, and definitely not taking itself seriously.

For instance, if your answer was a tirade about how pineapple on pizza is an abomination, don't just draw a pineapple pizza. Maybe draw a horrified pineapple screaming as it's being dragged onto a pizza by tiny, menacing chefs, or a pizza slice in a therapy session, traumatized by a pineapple.

Based on your answer: "${context}"
Now, generate a hilariously fitting, text-free image.`;


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
