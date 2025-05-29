
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { generateOlchikiSentence, type GenerateOlchikiSentenceInput, type GenerateOlchikiSentenceOutput } from '@/ai/flows/generate-olchiki-sentence';

const aiTranslatorFormSchema = z.object({
  englishSentence: z.string().min(3, { message: 'Sentence must be at least 3 characters.' }).max(300, { message: 'Sentence must be 300 characters or less.' }),
});
type AiTranslateFormData = z.infer<typeof aiTranslatorFormSchema>;

export function useAiTranslator() {
  const { toast } = useToast();
  const [aiOutputScript, setAiOutputScript] = useState<GenerateOlchikiSentenceOutput | null>(null);
  const [isAiTranslating, setIsAiTranslating] = useState(false);
  const [aiTranslationError, setAiTranslationError] = useState<string | null>(null);

  const aiTranslateForm = useForm<AiTranslateFormData>({
    resolver: zodResolver(aiTranslatorFormSchema),
    defaultValues: {
      englishSentence: '',
    },
  });

  const onAiTranslateSubmit: SubmitHandler<AiTranslateFormData> = async (data) => {
    setIsAiTranslating(true);
    setAiOutputScript(null);
    setAiTranslationError(null);
    try {
      const input: GenerateOlchikiSentenceInput = { inputText: data.englishSentence };
      const result = await generateOlchikiSentence(input);
      if (result && result.sentence) {
        setAiOutputScript(result);
        toast({
          title: "AI Translation Successful!",
          description: "English/Hindi sentence translated to Ol Chiki script with transliteration.",
        });
      } else {
        throw new Error("AI model did not return the expected structured output. Check Genkit logs.");
      }
    } catch (error: any) {
      console.error('Error translating with AI:', error);
      const errorMessage = error.message || 'Failed to translate sentence with AI. Check Genkit logs for details.';
      setAiTranslationError(errorMessage);
      toast({
        title: "AI Translation Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAiTranslating(false);
    }
  };

  return {
    aiTranslateForm,
    onAiTranslateSubmit,
    aiOutputScript,
    isAiTranslating,
    aiTranslationError,
  };
}
