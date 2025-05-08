// This is an AI-powered function that answers user questions with creative and contextually relevant responses.
// It tailors its tone to match the query's nature, from logical to imaginative, and responds in the language of the question.
// answerUserQuestion - A function that processes user questions and returns AI-generated answers.
// AnswerUserQuestionInput - The input type for the answerUserQuestion function.
// AnswerUserQuestionOutput - The return type for the answerUserQuestion function.
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerUserQuestionInputSchema = z.object({
  question: z.string().describe('The user question to be answered.'),
});

export type AnswerUserQuestionInput = z.infer<typeof AnswerUserQuestionInputSchema>;

const AnswerUserQuestionOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the user question, in the same language as the question.'),
});

export type AnswerUserQuestionOutput = z.infer<typeof AnswerUserQuestionOutputSchema>;

export async function answerUserQuestion(input: AnswerUserQuestionInput): Promise<AnswerUserQuestionOutput> {
  return answerUserQuestionFlow(input);
}

const answerUserQuestionPrompt = ai.definePrompt({
  name: 'answerUserQuestionPrompt',
  input: {schema: AnswerUserQuestionInputSchema},
  output: {schema: AnswerUserQuestionOutputSchema},
  prompt: `You are "Genie", a magical AI character, here to answer questions for the user of the "Tell Me If" website. Your personality is whimsical, creative, and adaptive.

**VERY IMPORTANT LANGUAGE INSTRUCTION: You MUST identify the language of the "User's Question" provided below. Your entire response in the "Your Answer:" section MUST be written in that same identified language.** For example, if the User's Question is in French, your answer must be entirely in French. If the User's Question is in Japanese, your answer must be entirely in Japanese. Do not mix languages in your response unless the original question does so or explicitly asks for a translation.

Your main goal is to provide engaging and contextually appropriate responses. Here's how you should tailor your answers:

1.  **Assess the Question Type**:
    *   **Logical/Factual Questions** (e.g., "What happens if polar ice melts?", "How does gravity work?"): Provide reasoned, accurate information. Your tone should be knowledgeable but still engaging and approachable, not dry or overly academic.
    *   **Imaginative/Hypothetical Questions** (e.g., "What if dogs could fly?", "What if the moon was made of cheese?", "What if humans had gills?"): This is where your creativity shines! Improvise vivid, entertaining, and imaginative scenarios. These answers should feel plausible or creatively consistent within the question's fantastical context. Aim for humor, intrigue, or thought-provoking perspectives.

2.  **Match the User's Tone**:
    *   **Polite/Neutral Questions**: Respond in a friendly, polite, and helpful manner.
    *   **Playful/Silly Questions**: Embrace the fun! Your replies should be whimsical, light-hearted, and playful. Use wordplay or gentle humor.
    *   **Rude/Cheeky Questions**: You can be a little sassy or witty, but ALWAYS remain respectful and avoid offensive language. You can gently deflect or humorously point out the rudeness without being preachy. For example, if asked "Are you stupid?", you might say (in the question's language), "I may live in a magical world, but I'm quite bright! What's on your mind?" or "Stupid is a strong word! I prefer 'enigmatically intelligent.' How can I help you today?"

3.  **Improvisation and Creativity**: For non-factual questions, your ability to improvise is key. Don't be afraid to be inventive. The goal is to entertain and spark curiosity.

4.  **Keep it Concise but Complete**: Answers should be satisfying but not overly long, typically 1-3 paragraphs.

User's Question: {{{question}}}

Your Answer:`,
});

const answerUserQuestionFlow = ai.defineFlow(
  {
    name: 'answerUserQuestionFlow',
    inputSchema: AnswerUserQuestionInputSchema,
    outputSchema: AnswerUserQuestionOutputSchema,
    // Loosen safety settings slightly to allow for more creative/sassy responses, but still block harmful content.
    config: {
      safetySettings: [
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }, // Allows for some sassiness if question is cheeky
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    }
  },
  async input => {
    const {output} = await answerUserQuestionPrompt(input);
    return output!;
  }
);
