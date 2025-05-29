
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label as ShadcnLabel } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel as RHFFormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Loader2, Wand2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import type { OlChikiWord } from '@/lib/ol-chiki-data';

import { useDirectTransliteration } from '@/hooks/use-direct-transliteration';
import { useAiTranslator } from '@/hooks/use-ai-translator';
import { useDictionarySearch } from '@/hooks/use-dictionary-search';
import { useNameGenerator } from '@/hooks/use-name-generator';

const SentencePractice = React.memo(function SentencePractice() {
  const { directInputText, directTransliteratedScript, handleDirectInputChange } = useDirectTransliteration();
  const { aiTranslateForm, onAiTranslateSubmit, aiOutputScript, isAiTranslating, aiTranslationError } = useAiTranslator();
  const { dictionaryForm, onDictionarySearchSubmit, dictionaryResult, isDictionarySearching } = useDictionarySearch();
  const { 
    letterForm, keywordForm, handleSearchByLetter, handleSearchByKeyword, 
    nameResults, paginatedNameResults, nameCurrentPage, totalNamePages, 
    isNameSearching, searchTypeUsed, handleNamePageChange 
  } = useNameGenerator();

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
              Other symbols like '!' and emojis will appear as typed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <ShadcnLabel htmlFor="direct-input">Enter English Text</ShadcnLabel>
              <Input
                id="direct-input"
                placeholder="e.g., Ol Chiki Lipi ?"
                value={directInputText}
                onChange={(e) => handleDirectInputChange(e.target.value)}
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
                          <ShadcnLabel className="text-xs text-muted-foreground">Transliteration:</ShadcnLabel>
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
                      onClick={() => handleNamePageChange(nameCurrentPage - 1)}
                      disabled={nameCurrentPage === 1}
                      variant="outline"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {nameCurrentPage} of {totalNamePages}
                    </span>
                    <Button
                      onClick={() => handleNamePageChange(nameCurrentPage + 1)}
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
});
SentencePractice.displayName = 'SentencePractice';
export default SentencePractice;
