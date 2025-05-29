
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label as ShadcnLabel } from '@/components/ui/label'; // Renamed to avoid conflict
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel as RHFFormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { generateOlchikiSentence, type GenerateOlchikiSentenceInput, type GenerateOlchikiSentenceOutput } from '@/ai/flows/generate-olchiki-sentence';
import { Loader2, Wand2, Search, Shuffle, ChevronLeft, ChevronRight } from 'lucide-react';
import { categorizedOlChikiWords, type OlChikiWord, santaliFirstNamesSample, type SantaliNamePart } from '@/lib/ol-chiki-data';

const directKeyToOlChikiMap: { [key: string]: string } = {
  'a': 'ᱚ', 'A': 'ᱟ',
  't': 'ᱛ', 'T': 'ᱴ',
  'g': 'ᱜ',
  'm': 'ᱢ', 'M': 'ᱝ',
  'l': 'ᱞ',
  'k': 'ᱠ',
  'j': 'ᱡ',
  'w': 'ᱣ', 'W': 'ᱶ',
  'i': 'ᱤ',
  's': 'ᱥ',
  'h': 'ᱦ', 'H': 'ᱷ',
  'n': 'ᱱ',
  'N': 'ᱧ',
  'r': 'ᱨ', 'R': 'ᱲ',
  'u': 'ᱩ',
  'c': 'ᱪ',
  'd': 'ᱫ', 'D': 'ᱰ',
  'y': 'ᱭ',
  'e': 'ᱮ',
  'p': 'ᱯ',
  'b': 'ᱵ',
  'o': 'ᱳ',
  '.': '᱾',
  ',': 'ᱹ',
  '?': '?',
  '!': '!',
  ' ': ' ',
};

const aiTranslatorFormSchema = z.object({
  englishSentence: z.string().min(3, { message: 'Sentence must be at least 3 characters.' }).max(300, { message: 'Sentence must be 300 characters or less.' }),
});
type AiTranslateFormData = z.infer<typeof aiTranslatorFormSchema>;

const dictionarySearchSchema = z.object({
  searchTerm: z.string().min(1, { message: "Please enter a word to search."}),
});
type DictionarySearchData = z.infer<typeof dictionarySearchSchema>;

const nameByLetterSchema = z.object({
  initialLetter: z.string().length(1, { message: "Please enter a single letter."}).regex(/^[a-zA-Z]$/, { message: "Please enter a valid letter."}),
});
type NameByLetterData = z.infer<typeof nameByLetterSchema>;

const nameByKeywordSchema = z.object({
  keyword: z.string().min(2, { message: "Keyword must be at least 2 characters."}),
});
type NameByKeywordData = z.infer<typeof nameByKeywordSchema>;

const NAMES_PER_PAGE = 5;

export default function SentencePractice() {
  const [directInputText, setDirectInputText] = useState<string>('');
  const [directTransliteratedScript, setDirectTransliteratedScript] = useState<string>('');

  const doDirectKeyTransliterate = useCallback((currentInput: string): string => {
    let result = '';
    for (let i = 0; i < currentInput.length; i++) {
      const char = currentInput[i];
      result += directKeyToOlChikiMap[char] || char;
    }
    return result;
  }, []);

  useEffect(() => {
    const result = doDirectKeyTransliterate(directInputText);
    setDirectTransliteratedScript(result);
  }, [directInputText, doDirectKeyTransliterate]);

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

    const foundWord = allVocabularyWords.find(word =>
      word.olChiki.toLowerCase() === term ||
      word.transliteration.toLowerCase() === term ||
      word.english.toLowerCase().includes(term)
    );

    if (foundWord) {
      setDictionaryResult(foundWord);
    } else {
      setDictionaryResult({ status: 'not_found', term: data.searchTerm.trim() });
    }
    setIsDictionarySearching(false);
  };

  // Name Generator States
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

  const handleSearchByLetter: SubmitHandler<NameByLetterData> = (data) => {
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
  };

  const handleSearchByKeyword: SubmitHandler<NameByKeywordData> = (data) => {
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
  };

  const paginatedNameResults = useMemo(() => {
    const startIndex = (nameCurrentPage - 1) * NAMES_PER_PAGE;
    return nameResults.slice(startIndex, startIndex + NAMES_PER_PAGE);
  }, [nameResults, nameCurrentPage]);


  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-8">
      {/* Tool 1: Ol Chiki Direct Typing Tool */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-primary tracking-tight">Ol Chiki Direct Typing Tool</h2>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>English Keyboard to Ol Chiki Script (Real-time)</CardTitle>
            <CardDescription>
              Type English characters to see their corresponding Ol Chiki script instantly.
              Mapped punctuation: '.' to ᱾, ',' to ᱹ, '?' to ?.
              Other symbols like '!' and emojis will appear as typed. This is not a full language translator.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <ShadcnLabel htmlFor="direct-input">Enter English Text</ShadcnLabel>
              <Input
                id="direct-input"
                placeholder="e.g., Ol Chiki Lipi ?"
                value={directInputText}
                onChange={(e) => setDirectInputText(e.target.value)}
                className="text-lg"
              />
            </div>
            {directInputText && (
              <div className="mt-4">
                <ShadcnLabel className="text-accent font-semibold">Ol Chiki Script Output (Direct Mapping):</ShadcnLabel>
                <div className="text-2xl font-mono p-4 bg-secondary/30 rounded-md text-center mt-2 min-h-[3em] break-words">
                  {directTransliteratedScript || <span className="text-muted-foreground">Type above to see Ol Chiki...</span>}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      {/* Tool 2: AI-Powered English/Hindi to Santali (Ol Chiki) Translator */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-primary tracking-tight">Santad AI - English/Hindi to Ol Chiki Translator</h2>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Translate English or Hindi Sentence to Santali (Ol Chiki)</CardTitle>
            <CardDescription>
              Enter an English or Hindi sentence below. The AI will attempt to translate it into Santali,
              provide the result in Ol Chiki script, and an English transliteration. AI translations can sometimes be imperfect.
            </CardDescription>
          </CardHeader>
          <Form {...aiTranslateForm}>
            <form onSubmit={aiTranslateForm.handleSubmit(onAiTranslateSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={aiTranslateForm.control}
                  name="englishSentence"
                  render={({ field }) => (
                    <FormItem>
                      <RHFFormLabel>Enter English or Hindi Sentence</RHFFormLabel>
                      <FormControl>
                        <Input placeholder="e.g., What is your name? / आपका नाम क्या है?" {...field} className="text-lg"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isAiTranslating}>
                  {isAiTranslating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  Translate with AI
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {isAiTranslating && (
          <div className="mt-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Translating with AI...</p>
          </div>
        )}

        {aiTranslationError && !isAiTranslating && (
          <Card className="mt-6 shadow-md border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">AI Translation Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive-foreground bg-destructive p-3 rounded-md">{aiTranslationError}</p>
            </CardContent>
          </Card>
        )}

        {aiOutputScript && !isAiTranslating && !aiTranslationError && (
          <Card className="mt-6 shadow-md">
            <CardHeader>
              <CardTitle className="text-accent">AI Translation Result:</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <ShadcnLabel className="text-sm text-muted-foreground">Ol Chiki Script:</ShadcnLabel>
                <p className="text-2xl font-mono p-4 bg-secondary/30 rounded-md text-center break-words min-h-[3em]">{aiOutputScript.sentence}</p>
              </div>
              <div>
                <ShadcnLabel className="text-sm text-muted-foreground">English Transliteration:</ShadcnLabel>
                <p className="text-lg p-3 bg-secondary/20 rounded-md text-center break-words min-h-[2.5em]">{aiOutputScript.englishTransliteration}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Separator className="my-8" />

      {/* Tool 3: Santali-English Dictionary */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-primary tracking-tight">Santali-English Dictionary</h2>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Look Up Words (In-App Vocabulary)</CardTitle>
            <CardDescription>
              Enter a Santali word (in Ol Chiki or Roman script) or an English word to find its translation
              from the app's internal vocabulary list. This dictionary searches the vocabulary taught within the app.
            </CardDescription>
          </CardHeader>
          <Form {...dictionaryForm}>
            <form onSubmit={dictionaryForm.handleSubmit(onDictionarySearchSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={dictionaryForm.control}
                  name="searchTerm"
                  render={({ field }) => (
                    <FormItem>
                      <RHFFormLabel>Enter Word (Ol Chiki, Roman, or English)</RHFFormLabel>
                      <FormControl>
                        <Input placeholder="e.g., ᱫᱟᱠᱟ, daka, or rice" {...field} className="text-lg"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isDictionarySearching}>
                  {isDictionarySearching ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="mr-2 h-4 w-4" />
                  )}
                  Search Dictionary
                </Button>
              </CardFooter>
            </form>
          </Form>

          {dictionaryResult && !isDictionarySearching && (
             <div className="mt-6 px-6 pb-6">
                <Card className="shadow-inner bg-secondary/20">
                  <CardHeader>
                    <CardTitle className="text-accent">Dictionary Result:</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {dictionaryResult.status === 'not_found' ? (
                      <p className="text-center text-muted-foreground p-4 border border-dashed rounded-md">
                        Word "<span className="font-semibold">{dictionaryResult.term}</span>" not found in the app's dictionary.
                      </p>
                    ) : (
                      <>
                        <div>
                          <ShadcnLabel className="text-xs text-muted-foreground">Ol Chiki Script:</ShadcnLabel>
                          <p className="text-2xl font-mono p-2 bg-background/50 rounded-md">{(dictionaryResult as OlChikiWord).olChiki}</p>
                        </div>
                        <div>
                          <ShadcnLabel className="text-xs text-muted-foreground">Roman Transliteration:</ShadcnLabel>
                          <p className="text-lg p-2 bg-background/50 rounded-md">{(dictionaryResult as OlChikiWord).transliteration}</p>
                        </div>
                        <div>
                          <ShadcnLabel className="text-xs text-muted-foreground">English Meaning:</ShadcnLabel>
                          <p className="text-lg p-2 bg-background/50 rounded-md">{(dictionaryResult as OlChikiWord).english}</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
             </div>
          )}
        </Card>
      </div>

      <Separator className="my-8" />

      {/* Tool 4: Santali Name Generator */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-primary tracking-tight">Santali Name Generator</h2>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Find Santali First Names</CardTitle>
            <CardDescription>
              Search for Santali first names by their initial letter (Roman) or by keywords in their meaning.
              The current name database is a small sample.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="byLetter" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="byLetter">Search by Initial Letter</TabsTrigger>
                <TabsTrigger value="byKeyword">Search by Keyword in Meaning</TabsTrigger>
              </TabsList>
              <TabsContent value="byLetter" className="pt-4">
                <Form {...letterForm}>
                  <form onSubmit={letterForm.handleSubmit(handleSearchByLetter)} className="space-y-3">
                    <FormField
                      control={letterForm.control}
                      name="initialLetter"
                      render={({ field }) => (
                        <FormItem>
                          <RHFFormLabel>Enter First Letter (e.g., A, B, S)</RHFFormLabel>
                          <FormControl>
                            <Input placeholder="Enter a single letter" {...field} maxLength={1} className="text-lg"/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isNameSearching}>
                      {isNameSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                      Find Names by Letter
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="byKeyword" className="pt-4">
                <Form {...keywordForm}>
                  <form onSubmit={keywordForm.handleSubmit(handleSearchByKeyword)} className="space-y-3">
                     <FormField
                      control={keywordForm.control}
                      name="keyword"
                      render={({ field }) => (
                        <FormItem>
                          <RHFFormLabel>Enter Keyword (e.g., Moon, Flower, Warrior)</RHFFormLabel>
                          <FormControl>
                            <Input placeholder="Enter a keyword from meaning" {...field} className="text-lg"/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isNameSearching}>
                      {isNameSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                      Find Names by Keyword
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>

            {isNameSearching && (
              <div className="mt-6 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">Searching for names...</p>
              </div>
            )}

            {!isNameSearching && nameResults.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-accent mb-3">Matching Names:</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {paginatedNameResults.map((name, index) => (
                    <Card key={index} className="p-3 bg-secondary/20 shadow-sm">
                      <p className="text-xl font-mono text-primary">{name.olChiki}</p>
                      <p className="text-md text-accent">
                        {name.transliteration}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        <span className="font-semibold text-muted-foreground/80">Meaning:</span> {name.meaning}
                      </p>
                    </Card>
                  ))}
                </div>
                {totalNamePages > 1 && (
                  <div className="mt-4 flex justify-between items-center">
                    <Button
                      onClick={() => setNameCurrentPage(p => Math.max(1, p - 1))}
                      disabled={nameCurrentPage === 1}
                      variant="outline"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {nameCurrentPage} of {totalNamePages}
                    </span>
                    <Button
                      onClick={() => setNameCurrentPage(p => Math.min(totalNamePages, p + 1))}
                      disabled={nameCurrentPage === totalNamePages}
                      variant="outline"
                    >
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
            {!isNameSearching && nameResults.length === 0 && searchTypeUsed !== 'none' && (
                 <p className="text-center text-muted-foreground mt-6 p-4 border border-dashed rounded-md">
                    No names found matching your criteria. Try a different letter or keyword.
                  </p>
            )}
             {!isNameSearching && searchTypeUsed === 'none' && nameResults.length === 0 && (
                <p className="text-center text-muted-foreground mt-6">
                    Enter a letter or keyword above to search for names.
                </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
