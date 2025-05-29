
'use client';

import { useState, useMemo, useCallback } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { santaliFirstNamesSample, type SantaliNamePart } from '@/lib/ol-chiki-data';

const nameByLetterSchema = z.object({
  initialLetter: z.string().length(1, { message: "Please enter a single letter."}).regex(/^[a-zA-Z]$/, { message: "Please enter a valid letter."}),
});
type NameByLetterData = z.infer<typeof nameByLetterSchema>;

const nameByKeywordSchema = z.object({
  keyword: z.string().min(2, { message: "Keyword must be at least 2 characters."}),
});
type NameByKeywordData = z.infer<typeof nameByKeywordSchema>;

const NAMES_PER_PAGE = 5;

export function useNameGenerator() {
  const [nameResults, setNameResults] = useState<SantaliNamePart[]>([]);
  const [nameCurrentPage, setNameCurrentPage] = useState(1);
  const [totalNamePages, setTotalNamePages] = useState(0);
  const [isNameSearching, setIsNameSearching] = useState(false);
  const [searchTypeUsed, setSearchTypeUsed] = useState<'none' | 'letter' | 'keyword'>('none');

  const letterForm = useForm<NameByLetterData>({
    resolver: zodResolver(nameByLetterSchema),
    defaultValues: { initialLetter: '' },
  });

  const keywordForm = useForm<NameByKeywordData>({
    resolver: zodResolver(nameByKeywordSchema),
    defaultValues: { keyword: '' },
  });

  const handleSearchByLetter: SubmitHandler<NameByLetterData> = useCallback((data) => {
    setIsNameSearching(true);
    setSearchTypeUsed('letter');
    const letter = data.initialLetter.toLowerCase();
    const filteredNames = santaliFirstNamesSample.filter(namePart =>
      namePart.transliteration.toLowerCase().startsWith(letter)
    );
    setNameResults(filteredNames);
    setNameCurrentPage(1);
    setTotalNamePages(Math.ceil(filteredNames.length / NAMES_PER_PAGE));
    setIsNameSearching(false);
  }, []);

  const handleSearchByKeyword: SubmitHandler<NameByKeywordData> = useCallback((data) => {
    setIsNameSearching(true);
    setSearchTypeUsed('keyword');
    const keyword = data.keyword.toLowerCase();
    const filteredNames = santaliFirstNamesSample.filter(namePart =>
      namePart.meaning.toLowerCase().includes(keyword)
    );
    setNameResults(filteredNames);
    setNameCurrentPage(1);
    setTotalNamePages(Math.ceil(filteredNames.length / NAMES_PER_PAGE));
    setIsNameSearching(false);
  }, []);

  const paginatedNameResults = useMemo(() => {
    const startIndex = (nameCurrentPage - 1) * NAMES_PER_PAGE;
    return nameResults.slice(startIndex, startIndex + NAMES_PER_PAGE);
  }, [nameResults, nameCurrentPage]);

  const handleNamePageChange = useCallback((newPage: number) => {
    setNameCurrentPage(newPage);
  }, []);

  return {
    letterForm,
    keywordForm,
    handleSearchByLetter,
    handleSearchByKeyword,
    nameResults,
    paginatedNameResults,
    nameCurrentPage,
    totalNamePages,
    isNameSearching,
    searchTypeUsed,
    handleNamePageChange,
  };
}
