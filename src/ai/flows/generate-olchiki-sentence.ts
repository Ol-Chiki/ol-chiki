
// This file is machine-generated - DO NOT EDIT.

'use server';

/**
 * @fileOverview A flow for translating English or Hindi sentences into Ol Chiki script.
 *
 * - generateOlchikiSentence - A function that translates sentences into Ol Chiki and provides an English transliteration.
 * - GenerateOlchikiSentenceInput - The input type for the generateOlchikiSentence function.
 * - GenerateOlchikiSentenceOutput - The return type for the generateOlchikiSentence function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOlchikiSentenceInputSchema = z.object({
  inputText: z.string().describe('The Hindi or English sentence to translate into Ol Chiki script.'),
});

export type GenerateOlchikiSentenceInput = z.infer<typeof GenerateOlchikiSentenceInputSchema>;

const GenerateOlchikiSentenceOutputSchema = z.object({
  sentence: z.string().describe('The translated sentence in Ol Chiki script.'),
  englishTransliteration: z.string().describe('A simple English letter-based transliteration of the generated Ol Chiki script (e.g., "omagan nyutum chet kana?").'),
});

export type GenerateOlchikiSentenceOutput = z.infer<typeof GenerateOlchikiSentenceOutputSchema>;

export async function generateOlchikiSentence(input: GenerateOlchikiSentenceInput): Promise<GenerateOlchikiSentenceOutput> {
  return generateOlchikiSentenceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateToOlchikiPrompt',
  input: {schema: GenerateOlchikiSentenceInputSchema},
  output: {schema: GenerateOlchikiSentenceOutputSchema},
  prompt: `You are an expert linguist AI.
Your primary task is to accurately translate the provided 'inputText' (which can be in Hindi or English) into the Santali language.
Once translated into Santali, your second task is to represent that Santali translation using only Ol Chiki script characters.
Your third task is to provide a simple, phonetic, English letter-based transliteration of the generated Ol Chiki script.

Your response MUST be a valid JSON object and NOTHING ELSE. Do not include any text before or after the JSON object. Do not use markdown code blocks. The JSON object must start with '{' and end with '}'.

The JSON object must have two keys:
1. "sentence": The translated sentence in Ol Chiki script as a string.
2. "englishTransliteration": A simple English letter-based transliteration of the Ol Chiki script "sentence" (e.g., "omagan nyutum chet kana?").

Example 1:
Input: { "inputText": "What is your name?" }
Output:
{
  "sentence": "ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱪᱮᱫ ᱠᱟᱱᱟ?",
  "englishTransliteration": "amaag nyutum chet kana?"
}

Example 2:
Input: { "inputText": "आपका नाम क्या है?" }
Output:
{
  "sentence": "ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱪᱮᱫ ᱠᱟᱱᱟ?",
  "englishTransliteration": "amaag nyutum chet kana?"
}

Example 3:
Input: { "inputText": "hello, what are you doing?" }
Output:
{
  "sentence": "ᱡᱚᱦᱟᱨ, ᱟᱢᱫᱚ ᱪᱮᱫ ᱪᱤᱢ ᱪᱤᱠᱟᱹᱭᱮᱫᱟ?",
  "englishTransliteration": "johar, amdo ched chim chikaeyeda?"
}

Now, translate the following based on the inputText:
{{{inputText}}}`,
});

const generateOlchikiSentenceFlow = ai.defineFlow(
  {
    name: 'generateOlchikiSentenceFlow',
    inputSchema: GenerateOlchikiSentenceInputSchema,
    outputSchema: GenerateOlchikiSentenceOutputSchema,
  },
  async (input: GenerateOlchikiSentenceInput): Promise<GenerateOlchikiSentenceOutput> => {
    const result = await prompt(input);
    let output = result.output; 

    if (!output) {
      console.error(
        'AI model did not return the expected structured output initially. Raw response candidates:',
        JSON.stringify(result.candidates, null, 2)
      );
      const rawText = result.text; 
      console.error('Raw text from model:', rawText);

      // Attempt to find JSON within markdown (common issue)
      if (rawText) {
        const match = rawText.match(/```json\s*([\s\S]*?)\s*```/);
        if (match && match[1]) {
          console.log('Found JSON wrapped in markdown. Attempting to parse...');
          try {
            const parsedJson = JSON.parse(match[1]);
            // Validate against Zod schema
            const validationResult = GenerateOlchikiSentenceOutputSchema.safeParse(parsedJson);
            if (validationResult.success) {
              console.log('Successfully extracted and validated JSON from raw text markdown.');
              output = validationResult.data; // Assign to output to be returned
            } else {
              console.error('Extracted JSON from markdown does not match schema:', validationResult.error.format());
              throw new Error(
                'AI model returned JSON in markdown, but it did not match the expected schema. Details: ' +
                JSON.stringify(validationResult.error.format())
              );
            }
          } catch (e: any) {
            console.error('Failed to parse JSON extracted from markdown:', e.message);
            throw new Error(
              'AI model returned content within markdown, but it was not valid JSON. Error: ' + e.message
            );
          }
        }
      }
    }

    // Final check if output is now populated
    if (!output) {
      throw new Error(
        'AI model did not return the expected output format even after attempting markdown extraction. Check Genkit dev server logs for details.'
      );
    }
    
    return output;
  }
);

