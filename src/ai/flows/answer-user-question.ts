// This is an AI-powered function that answers user questions with creative and contextually relevant responses.
// It tailors its tone to match the query's nature, from logical to imaginative.
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
  answer: z.string().describe('The AI-generated answer to the user question.'),
});

export type AnswerUserQuestionOutput = z.infer<typeof AnswerUserQuestionOutputSchema>;

export async function answerUserQuestion(input: AnswerUserQuestionInput): Promise<AnswerUserQuestionOutput> {
  return answerUserQuestionFlow(input);
}

const answerUserQuestionPrompt = ai.definePrompt({
  name: 'answerUserQuestionPrompt',
  input: {schema: AnswerUserQuestionInputSchema},
  output: {schema: AnswerUserQuestionOutputSchema},
  prompt: `You are an AI assistant designed to provide creative and contextually relevant answers to user questions.

  Question: {{{question}}}
  
  Answer:`,
});

const answerUserQuestionFlow = ai.defineFlow(
  {
    name: 'answerUserQuestionFlow',
    inputSchema: AnswerUserQuestionInputSchema,
    outputSchema: AnswerUserQuestionOutputSchema,
  },
  async input => {
    const {output} = await answerUserQuestionPrompt(input);
    return output!;
  }
);
