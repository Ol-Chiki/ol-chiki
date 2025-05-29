
'use client';

import { useState, useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { categorizedOlChikiWords, type OlChikiWord } from '@/lib/ol-chiki-data';

const dictionarySearchSchema = z.object({
  searchTerm: z.string().min(1, { message: "Please enter a word to search."}),
});
type DictionarySearchData = z.infer<typeof dictionarySearchSchema>;

export function useDictionarySearch() {
  const [dictionaryResult, setDictionaryResult] = useState<OlChikiWord | null | { status: 'not_found', term: string }> (null);
  const [isDictionarySearching, setIsDictionarySearching] = useState(false);

  const dictionaryForm = useForm<DictionarySearchData>({
    resolver: zodResolver(dictionarySearchSchema),
    defaultValues: {
      searchTerm: '',
    },
  });

  const allVocabularyWords = useMemo(() => {
    return Object.values(categorizedOlChikiWords).flat();
  }, []);

  const onDictionarySearchSubmit: SubmitHandler<DictionarySearchData> = async (data) => {
    setIsDictionarySearching(true);
    setDictionaryResult(null);
    const term = data.searchTerm.trim().toLowerCase();

    if (!term) {
      setDictionaryResult(null);
      setIsDictionarySearching(false);
      return;
    }

    // Allow searching by Ol Chiki, transliteration, or English
    const foundWord = allVocabularyWords.find(word =>
      word.olChiki.toLowerCase() === term ||
      word.transliteration.toLowerCase() === term ||
      word.english.toLowerCase().includes(term) // Using includes for English to allow partial matches
    );

    if (foundWord) {
      setDictionaryResult(foundWord);
    } else {
      setDictionaryResult({ status: 'not_found', term: data.searchTerm.trim() });
    }
    setIsDictionarySearching(false);
  };
  
  return {
    dictionaryForm,
    onDictionarySearchSubmit,
    dictionaryResult,
    isDictionarySearching,
  };
}
