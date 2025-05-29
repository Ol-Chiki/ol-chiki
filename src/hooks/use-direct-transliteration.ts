
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

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
  'n': 'ᱱ', 'N': 'ᱧ',
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

export function useDirectTransliteration() {
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

  const handleDirectInputChange = useCallback((value: string) => {
    setDirectInputText(value);
  }, []);

  return {
    directInputText,
    directTransliteratedScript,
    handleDirectInputChange,
  };
}
