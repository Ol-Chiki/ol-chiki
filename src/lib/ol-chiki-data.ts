
import type { OlChikiCharacter, OlChikiWord, OlChikiNumber, SantaliNamePart } from '@/types/ol-chiki';

export const olChikiCharacters: OlChikiCharacter[] = [
  { id: 'c1', olChiki: 'ᱚ', transliteration: 'LA', pronunciation: '/ɔ/' },
  { id: 'c2', olChiki: 'ᱛ', transliteration: 'AT', pronunciation: '/t/' },
  { id: 'c3', olChiki: 'ᱜ', transliteration: 'AG', pronunciation: '/g/' },
  { id: 'c4', olChiki: 'ᱝ', transliteration: 'ANG', pronunciation: '/ŋ/' },
  { id: 'c5', olChiki: 'ᱞ', transliteration: 'AL', pronunciation: '/l/' },
  { id: 'c6', olChiki: 'ᱟ', transliteration: 'LAA', pronunciation: '/a/' },
  { id: 'c7', olChiki: 'ᱠ', transliteration: 'AAK', pronunciation: '/k/' },
  { id: 'c8', olChiki: 'ᱡ', transliteration: 'AAJ', pronunciation: '/dʒ/' },
  { id: 'c9', olChiki: 'ᱢ', transliteration: 'AAM', pronunciation: '/m/' },
  { id: 'c10', olChiki: 'ᱣ', transliteration: 'AAW', pronunciation: '/w/' },
  { id: 'c11', olChiki: 'ᱤ', transliteration: 'LI', pronunciation: '/i/' },
  { id: 'c12', olChiki: 'ᱥ', transliteration: 'IS', pronunciation: '/s/' },
  { id: 'c13', olChiki: 'ᱦ', transliteration: 'IH', pronunciation: '/h/, /ʔ/' },
  { id: 'c14', olChiki: 'ᱧ', transliteration: 'INY', pronunciation: '/ɲ/' },
  { id: 'c15', olChiki: 'ᱨ', transliteration: 'IR', pronunciation: '/r/' },
  { id: 'c16', olChiki: 'ᱩ', transliteration: 'LU', pronunciation: '/u/' },
  { id: 'c17', olChiki: 'ᱪ', transliteration: 'UCH', pronunciation: '/tʃ/' },
  { id: 'c18', olChiki: 'ᱫ', transliteration: 'UD', pronunciation: '/d/' },
  { id: 'c19', olChiki: 'ᱬ', transliteration: 'UNN', pronunciation: '/ɳ/' }, // MU TURDAH
  { id: 'c20', olChiki: 'ᱭ', transliteration: 'UY', pronunciation: '/j/' },
  { id: 'c21', olChiki: 'ᱮ', transliteration: 'LE', pronunciation: '/e/' },
  { id: 'c22', olChiki: 'ᱯ', transliteration: 'EP', pronunciation: '/p/' },
  { id: 'c23', olChiki: 'ᱰ', transliteration: 'EDD', pronunciation: '/ɖ/' }, // AMBAR
  { id: 'c24', olChiki: 'ᱱ', transliteration: 'EN', pronunciation: '/n/' },
  { id: 'c25', olChiki: 'ᱲ', transliteration: 'ERR', pronunciation: '/ɽ/' }, // AHAD
  { id: 'c26', olChiki: 'ᱳ', transliteration: 'LO', pronunciation: '/o/' },
  { id: 'c27', olChiki: 'ᱴ', transliteration: 'OTT', pronunciation: '/ʈ/' },
  { id: 'c28', olChiki: 'ᱵ', transliteration: 'OB', pronunciation: '/b/' },
  { id: 'c29', olChiki: 'ᱶ', transliteration: 'OV', pronunciation: '/w̃/' }, // Abnao
  { id: 'c30', olChiki: 'ᱷ', transliteration: 'OH', pronunciation: '/ʰ/' }  // OWAH
];

// Helper function to convert Roman keys from the dictionary to Ol Chiki script
function convertRomanKeyToOlChiki(romanKey: string): string {
  let olChikiString = "";
  let i = 0;

  // This map is specifically tailored for the Romanization style found in the user's dictionary input
  const romanMapForDictionary: { [key: string]: string } = {
    // Prioritize longer/more specific sequences
    "GIDX_RA.": "ᱜᱤᱫᱽᱨᱟᱹ", // Example of a very specific full match if needed
    "A:": "ᱟᱸ", "E:": "ᱮᱸ", "I:": "ᱤᱸ", "O:": "ᱳᱸ", "U:": "ᱩᱸ", "o:": "ᱚᱸ",
    "I~": "ᱤᱧ", "U~": "ᱩᱧ", "E~": "ᱮᱧ", "o~": "ᱚᱧ", // Added o~ as QU~ used often
    "QU~": "ᱧᱩ", // As in Jom_QU~
    "NG": "ᱝ", "NJ": "ᱧ", "NDX": "ᱬ",
    "DD": "ᱰ", "TT": "ᱴ", "RR": "ᱲ",
    "KH": "ᱠᱷ", "GH": "ᱜᱷ", "JH": "ᱡᱷ", "DH": "ᱫᱷ", "TH": "ᱛᱷ",
    "PH": "ᱯᱷ", "BH": "ᱵᱷ", "CH": "ᱪ",

    // Single Characters (Uppercase - from dictionary style)
    "A": "ᱟ", "B": "ᱵ", "C": "ᱪ", "D": "ᱫ", "E": "ᱮ", "F":"ᱝ", // F often used for ANG sound like in TonoF
    "G": "ᱜ", "H": "ᱦ", "I": "ᱤ", "J": "ᱡ", "K": "ᱠ", "L": "ᱞ", "M": "ᱢ", "N": "ᱱ", "O": "ᱳ",
    "P": "ᱯ", "Q": "ᱧ", // Q used for INY sound, e.g. SA:GIQ
    "R": "ᱨ", "S": "ᱥ", "T": "ᱛ", // In dictionary, T is often dental ᱛ, TT is ᱴ
    "U": "ᱩ", "V": "ᱶ", "W": "ᱣ", "Y": "ᱭ", "Z": "ᱲ", // Z used for ERR sound, e.g. onoZ

    // Single Characters (Lowercase - from dictionary style)
    "a": "ᱟ", // 'a' seems to be 'aa' sound more often than 'o' sound in dictionary
    "b": "ᱵ", "c": "ᱪ", "d": "ᱫ", "e": "ᱮ", "g": "ᱜ", "h": "ᱦ",
    "i": "ᱤ", "j": "ᱡ", "k": "ᱠ", "l": "ᱞ", "m": "ᱢ", "n": "ᱱ", "o": "ᱚ", // 'o' is consistently 'ᱚ'
    "p": "ᱯ", "q": "ᱧ", // lowercase q also for INY
    "r": "ᱨ", "s": "ᱥ", "t": "ᱛ", "u": "ᱩ", "v": "ᱶ",
    "w": "ᱣ", "y": "ᱭ", "z": "ᱲ", // lowercase z also for ERR

    // Special symbols within Roman keys from dictionary
    ".": "ᱹ", // AHAD diacritic
    "X": "ᱽ", // PHARKA (as in GIDX_RA. for GIDRA)
    "_": " ", // Space
    // Digits (though unlikely in the middle of words from the dictionary)
    "0":"᱐", "1":"᱑", "2":"᱒", "3":"᱓", "4":"᱔", "5":"᱕", "6":"᱖", "7":"᱗", "8":"᱘", "9":"᱙"
  };

  const mapKeysSorted = Object.keys(romanMapForDictionary).sort((a, b) => b.length - a.length); // Longest first

  while (i < romanKey.length) {
    let matchedThisIteration = false;
    for (const key of mapKeysSorted) {
      if (romanKey.substring(i).startsWith(key)) {
        olChikiString += romanMapForDictionary[key];
        i += key.length;
        matchedThisIteration = true;
        break;
      }
    }
    if (!matchedThisIteration) {
      olChikiString += romanKey[i]; // Append original character if no match
      i++;
    }
  }
  return olChikiString;
}


const olChikiUnitGlyphs = ["᱐", "᱑", "᱒", "᱓", "᱔", "᱕", "᱖", "᱗", "᱘", "᱙"];

const santaliUnitWords = ["Sun", "Mit’", "Bar", "Pe", "Pun", "Mɔ̃ṇe", "Turuy", "Eyai", "Irăl", "Are"];
const englishUnitWords = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
const englishTeenWords = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const englishTensWords = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function getEnglishWord(n: number): string {
  if (n < 0 || n > 100) return "";
  if (n < 10) return englishUnitWords[n];
  if (n < 20) return englishTeenWords[n - 10];
  if (n === 100) return "One Hundred";

  const tensDigit = Math.floor(n / 10);
  const unitDigit = n % 10;

  if (unitDigit === 0) {
    return englishTensWords[tensDigit];
  }
  return `${englishTensWords[tensDigit]}-${englishUnitWords[unitDigit].toLowerCase()}`;
}

function getSantaliWord(n: number): string {
    if (n < 0 || n > 100) return "";
    if (n === 0) return santaliUnitWords[0];
    if (n > 0 && n < 10) return santaliUnitWords[n];
    if (n === 10) return "Gel";
    if (n > 10 && n < 20) return `Gel ${santaliUnitWords[n % 10]}`;
    if (n === 20) return "Isi";
    if (n > 20 && n < 30) return `Isi ${santaliUnitWords[n % 10]}`;
    
    const tensDigit = Math.floor(n / 10);
    const unitDigit = n % 10;

    if (unitDigit === 0) { // For 30, 40, ... 90
        return `${santaliUnitWords[tensDigit]} Gel`;
    }
    // For 31-39, 41-49, etc.
    return `${santaliUnitWords[tensDigit]} Gel ${santaliUnitWords[unitDigit]}`;
}


function getOlChikiNumeral(n: number): string {
  if (n < 0 || n > 100) return "";
  if (n === 100) return olChikiUnitGlyphs[1] + olChikiUnitGlyphs[0] + olChikiUnitGlyphs[0];

  const s = String(n);
  let olChikiStr = "";
  for (const char of s) {
    olChikiStr += olChikiUnitGlyphs[parseInt(char, 10)];
  }
  return olChikiStr;
}

const generatedNumbers: OlChikiNumber[] = [];
for (let i = 0; i <= 100; i++) {
  generatedNumbers.push({
    id: `n${i}`,
    olChiki: getOlChikiNumeral(i),
    digitString: String(i),
    englishWord: getEnglishWord(i),
    value: i,
    santaliWord: getSantaliWord(i),
  });
}
export const olChikiNumbers: OlChikiNumber[] = generatedNumbers;

export const santaliFirstNamesSample: SantaliNamePart[] = [
  { olChiki: "ᱥᱚᱢᱟ", transliteration: "Soma", meaning: "Born on Monday; Moon" },
  { olChiki: "ᱢᱟᱝᱜᱟᱞ", transliteration: "Mangal", meaning: "Born on Tuesday; Mars" },
  { olChiki: "ᱵᱩᱫᱷᱩ", transliteration: "Budhu", meaning: "Born on Wednesday; Mercury" },
  { olChiki: "ᱵᱤᱦᱟᱨᱤ", transliteration: "Bihari", meaning: "One who roams; Joyful" },
  { olChiki: "ᱨᱟᱹᱱᱤ", transliteration: "Rani", meaning: "Queen" },
  { olChiki: "ᱯᱷᱩᱞᱢᱚᱱᱤ", transliteration: "Phulmoni", meaning: "Flower jewel" },
  { olChiki: "ᱥᱟᱞᱜᱮ", transliteration: "Salge", meaning: "Sal tree flower; Prosperous" },
  { olChiki: "ᱡᱩᱨᱤ", transliteration: "Juri", meaning: "Partner; Companion" },
  { olChiki: "ᱫᱩᱞᱟᱹᱲ", transliteration: "Dulal", meaning: "Beloved; Love" },
  { olChiki: "ᱵᱟᱦᱟ", transliteration: "Baha", meaning: "Flower" },
];

export const categorizedOlChikiWords: Record<string, OlChikiWord[]> = {
  "Animals": [
    { id: 'a1', olChiki: 'ᱥᱮᱛᱟ', transliteration: 'seta', english: 'Dog' },
    { id: 'a2', olChiki: 'ᱜᱟᱹᱭ', transliteration: 'găi', english: 'Cow' },
    { id: 'a3', olChiki: 'ᱪᱮᱬᱮ', transliteration: 'cɛ̃ṛɛ', english: 'Bird' },
    { id: 'a4', olChiki: 'ᱦᱟᱹᱠᱩ', transliteration: 'haku', english: 'Fish' },
    { id: 'a5', olChiki: 'ᱯᱩᱥᱤ', transliteration: 'pusi', english: 'Cat' }, // Corrected from bitkil
    { id: 'a6', olChiki: 'ᱢᱮᱨᱚᱢ', transliteration: 'merom', english: 'Goat' },
    { id: 'a7', olChiki: 'ᱠᱩᱞᱟᱹᱭ', transliteration: 'kulăi', english: 'Rabbit' },
    { id: 'a8', olChiki: 'ᱪᱤᱛᱟᱹ', transliteration: 'chitar', english: 'Panther' },
    { id: 'a9', olChiki: 'ᱠᱟᱴᱟᱣᱟ ᱛᱟᱹᱨᱩᱵ', transliteration: 'katwa tarub', english: 'Lion' },
    { id: 'a10', olChiki: 'ᱛᱟᱹᱨᱩᱵ', transliteration: 'tarub', english: 'Tiger' },
    { id: 'a11', olChiki: 'ᱵᱤᱨ ᱥᱩᱠᱨᱤ', transliteration: 'bir sukri', english: 'Boar' },
    { id: 'a12', olChiki: 'ᱵᱟᱱᱟ', transliteration: 'bana', english: 'Bear' },
    { id: 'a13', olChiki: 'ᱦᱟᱹᱬᱩ', transliteration: 'hăṇu', english: 'Monkey' },
    { id: 'a14', olChiki: 'ᱵᱤᱨᱦᱚᱲ', transliteration: 'birhor', english: 'Gorilla' },
    { id: 'a15', olChiki: 'ᱦᱟᱹᱛᱤ', transliteration: 'hăti', english: 'Elephant' },
    { id: 'a16', olChiki: 'ᱡᱤᱞ', transliteration: 'jil', english: 'Deer' },
    { id: 'a18', olChiki: 'ᱛᱩᱭᱩ', transliteration: 'tuyu', english: 'Fox' },
    { id: 'a19', olChiki: 'ᱦᱟᱰᱜᱟᱨ', transliteration: 'hadgar', english: 'Hyena' },
    { id: 'a20', olChiki: 'ᱡᱤᱞ ᱦᱤᱡ ᱜᱤᱫᱽᱨᱟᱹ', transliteration: 'jil hij gidră', english: 'Fawn' },
    { id: 'a21', olChiki: 'ᱛᱩᱲ', transliteration: 'tuṛ', english: 'Squirrel' },
    { id: 'a22', olChiki: 'ᱫᱟᱜ ᱦᱟᱹᱛᱤ', transliteration: 'dag hăti', english: 'Rhinoceros' },
    { id: 'a23', olChiki: 'ᱥᱟᱫᱚᱢ', transliteration: 'sadom', english: 'Horse' },
    // a24 was duplicate of pusi
    { id: 'a25', olChiki: 'ᱜᱟᱫᱷᱟ', transliteration: 'gadha', english: 'Ass' },
    { id: 'a26', olChiki: 'ᱵᱷᱤᱰᱤ', transliteration: 'bhidi', english: 'Sheep' },
    { id: 'a27', olChiki: 'ᱩᱸᱴ', transliteration: 'uṇṭ', english: 'Camel' },
    { id: 'a29', olChiki: 'ᱮᱸᱜᱟ ᱥᱮᱛᱟ', transliteration: 'enga seta', english: 'Bitch' },
    { id: 'a30', olChiki: 'ᱜᱟᱹᱭ', transliteration: 'găi_cow', english: 'Cow' },
    { id: 'a31', olChiki: 'ᱮᱸᱜᱟ ᱥᱟᱫᱚᱢ', transliteration: 'enga sadom', english: 'Mare' },
    { id: 'a32', olChiki: 'ᱥᱟᱫᱚᱢ ᱜᱤᱫᱽᱨᱟᱹ', transliteration: 'sadom gidră', english: 'Colt' },
    { id: 'a33', olChiki: 'ᱪᱩᱴᱩ', transliteration: 'cutu', english: 'Mouse' },
    { id: 'a34', olChiki: 'ᱢᱮᱨᱚᱢ', transliteration: 'merom_hegoat', english: 'He goat' },
    { id: 'a35', olChiki: 'ᱮᱸᱜᱟ ᱢᱮᱨᱚᱢ', transliteration: 'enga merom', english: 'She goat' },
    { id: 'a36', olChiki: 'ᱢᱮᱨᱚᱢ ᱜᱤᱫᱽᱨᱟᱹ', transliteration: 'merom gidră', english: 'Kid' },
    { id: 'a37', olChiki: 'ᱫᱟᱢᱠᱚᱢ', transliteration: 'damkom', english: 'Calf' },
    { id: 'a38', olChiki: 'ᱯᱩᱥᱤ ᱜᱤᱫᱽᱨᱟᱹ', transliteration: 'pusi gidră', english: 'Kitten' },
    { id: 'a39', olChiki: 'ᱰᱟᱝᱨᱟ', transliteration: 'ḍangra', english: 'Ox' },
    { id: 'a40', olChiki: 'ᱵᱷᱤᱰᱤ ᱜᱤᱫᱽᱨᱟᱹ', transliteration: 'bhidi gidră', english: 'Lamb' },
    { id: 'a41', olChiki: 'ᱠᱟᱲᱟ', transliteration: 'kaṛa', english: 'Buffalo' },
    { id: 'a42', olChiki: 'ᱥᱮᱸᱫᱽᱨᱟ ᱥᱮᱛᱟ', transliteration: 'sendra seta', english: 'Hound' },
    { id: 'a43', olChiki: 'ᱥᱚᱲᱚ', transliteration: 'soṛo', english: 'Bull' },
    { id: 'a44', olChiki: 'ᱥᱩᱠᱨᱤ', transliteration: 'sukri', english: 'Pig' },
  ],
  "Vegetables": [
    { id: 'v1', olChiki: 'ᱟᱹᱞᱩ', transliteration: 'ălu', english: 'Potato' },
    { id: 'v2', olChiki: 'ᱵᱟᱦᱟ ᱠᱩᱵᱤ', transliteration: 'baha kubi', english: 'Cauliflower' },
    { id: 'v3', olChiki: 'ᱯᱚᱴᱚᱢ ᱠᱩᱵᱤ', transliteration: 'potom kubi', english: 'Cabbage' },
    { id: 'v4', olChiki: 'ᱜᱟᱡᱚᱨ', transliteration: 'gajor', english: 'Carrot' },
    { id: 'v5', olChiki: 'ᱛᱟᱦᱮᱨ', transliteration: 'taher', english: 'Cucumber' },
    { id: 'v6', olChiki: 'ᱰᱮᱸᱜᱟᱲ', transliteration: 'ḍengad', english: 'Brinjal' },
    { id: 'v7', olChiki: 'ᱯᱮᱭᱟᱡ', transliteration: 'peyaj', english: 'Onion' },
    { id: 'v8', olChiki: 'ᱢᱚᱴᱚᱨ ᱪᱷᱚᱞᱟ', transliteration: 'motor chola', english: 'Pea' },
    { id: 'v9', olChiki: 'ᱠᱟᱨᱞᱟ', transliteration: 'karla', english: 'Bitter gourd' },
    { id: 'v10', olChiki: 'ᱢᱩᱞᱟᱹ', transliteration: 'mula', english: 'Raddish' },
    { id: 'v11', olChiki: 'ᱵᱤᱞᱟᱹᱛᱤ', transliteration: 'bilăti', english: 'Tomato' },
    { id: 'v12', olChiki: 'ᱦᱚᱛᱚᱫ', transliteration: 'hotod', english: 'Bottle gourd' },
    { id: 'v13', olChiki: 'ᱚᱫᱟ', transliteration: 'oda', english: 'Ginger' },
    { id: 'v14', olChiki: 'ᱯᱟᱞᱚᱱ ᱟᱲᱟᱜ', transliteration: 'palon adag', english: 'Spinach' },
    { id: 'v15', olChiki: 'ᱟᱨᱟᱜ ᱢᱩᱞᱟᱹ', transliteration: 'arag mulă', english: 'Turnip' },
    { id: 'v16', olChiki: 'ᱢᱟᱹᱨᱤᱪ', transliteration: 'mărich', english: 'Chilli' },
    { id: 'v17', olChiki: 'ᱵᱷᱮᱰᱣᱟ', transliteration: 'bhedwa', english: 'Lady finger' },
    { id: 'v18', olChiki: 'ᱯᱩᱫᱱᱟᱹ', transliteration: 'pudnă', english: 'Mint' },
    { id: 'v19', olChiki: 'ᱡᱟᱲᱟ', transliteration: 'jada', english: 'Papaya' },
    { id: 'v20', olChiki: 'ᱢᱚᱥᱞᱟ ᱥᱟᱠᱟᱢ', transliteration: 'mosla sakam', english: 'Coriander' },
    { id: 'v21', olChiki: 'ᱜᱷᱟᱱᱴᱟᱲ', transliteration: 'ghantad', english: 'Jack fruit' },
  ],
  "Birds": [
    { id: 'b1', olChiki: 'ᱢᱟᱨᱟᱜ', transliteration: 'marag', english: 'Peacock' },
    { id: 'b2', olChiki: 'ᱢᱤᱨᱩ', transliteration: 'miru', english: 'Parrot' },
    { id: 'b3', olChiki: 'ᱠᱟᱹᱦᱩ', transliteration: 'kăhu', english: 'Crow' },
    { id: 'b4', olChiki: 'ᱯᱟᱨᱣᱟ', transliteration: 'parwa', english: 'Pigeon' },
    { id: 'b5', olChiki: 'ᱠᱤᱥᱱᱤ', transliteration: 'kisni', english: 'Myna' },
    { id: 'b6', olChiki: 'ᱞᱮᱴᱠᱟ ᱪᱮᱸᱬᱮ', transliteration: 'letka chene', english: 'Sparrow' },
    { id: 'b7', olChiki: 'ᱠᱩᱲᱤᱫ', transliteration: 'kudid', english: 'Eagle' },
    { id: 'b8', olChiki: 'ᱠᱚᱡᱚᱨ', transliteration: 'kojor', english: 'Owl' },
    { id: 'b9', olChiki: 'ᱥᱤᱢ ᱥᱟᱹᱰᱤ', transliteration: 'sim săḍi', english: 'Cock' },
    { id: 'b10', olChiki: 'ᱥᱤᱢ ᱮᱸᱜᱟ', transliteration: 'sim enga', english: 'Hen' },
    { id: 'b11', olChiki: 'ᱜᱮᱲᱮ', transliteration: 'geṛe', english: 'duck' },
    { id: 'b12', olChiki: 'ᱢᱟᱨᱟᱝ ᱜᱮᱰᱮ', transliteration: 'marang gede', english: 'Swan' },
    { id: 'b13', olChiki: 'ᱜᱤᱫᱤ', transliteration: 'gidi', english: 'Vulture' },
  ],
  "Eatables": [
    { id: 'e1', olChiki: 'ᱦᱩᱲᱩ', transliteration: 'hudu', english: 'Grain' },
    { id: 'e2', olChiki: 'ᱟᱪᱟᱨ', transliteration: 'achar', english: 'Pickle' },
    { id: 'e3', olChiki: 'ᱥᱩᱡᱤ', transliteration: 'suji', english: 'Semolina' },
    { id: 'e4', olChiki: 'ᱚᱴᱟ', transliteration: 'ota', english: 'Flour' },
    { id: 'e5', olChiki: 'ᱤᱞᱟᱹᱭᱪᱤ', transliteration: 'ilăichi', english: 'Comfit' },
    { id: 'e6', olChiki: 'ᱛᱚᱣᱟ ᱨᱮᱭᱟᱜ ᱪᱟᱭ', transliteration: 'towa reag chay', english: 'Coffee' },
    { id: 'e7', olChiki: 'ᱛᱚᱣᱟ', transliteration: 'towa', english: 'Milk' },
    { id: 'e8', olChiki: 'ᱮᱥᱠᱨᱮᱢ', transliteration: 'eskrem', english: 'Ice-cream' },
    { id: 'e9', olChiki: 'ᱜᱩᱦᱩᱢ', transliteration: 'guhum', english: 'Wheat' },
    { id: 'e10', olChiki: 'ᱤᱛᱤᱞ ᱥᱩᱱᱩᱢ', transliteration: 'itil sunum', english: 'Ghee' },
    { id: 'e11', olChiki: 'ᱪᱚᱴᱱᱤ', transliteration: 'cotni', english: 'Sauce' },
    { id: 'e12', olChiki: 'ᱪᱟᱱᱟ', transliteration: 'chona', english: 'Gram' }, // Taking first part
    { id: 'e13', olChiki: 'ᱪᱟᱣᱞᱮ', transliteration: 'chawle', english: 'Rice' },
    { id: 'e14', olChiki: 'ᱪᱟᱭ', transliteration: 'chai', english: 'Tea' },
    { id: 'e15', olChiki: 'ᱪᱤᱱᱤ', transliteration: 'chini', english: 'Sugar' },
    { id: 'e16', olChiki: 'ᱯᱟᱹᱱᱤᱨ', transliteration: 'pănir', english: 'Cheese' },
    { id: 'e17', olChiki: 'ᱩᱛᱩ', transliteration: 'utu', english: 'Vegetables' },
    { id: 'e18', olChiki: 'ᱥᱩᱱᱩᱢ', transliteration: 'sunum', english: 'Oil' },
    { id: 'e19', olChiki: 'ᱫᱟᱹᱞ', transliteration: 'dăl', english: 'Pulse' },
    { id: 'e20', olChiki: 'ᱵᱤᱞᱟᱹᱛᱤ ᱪᱟᱴᱱᱤ', transliteration: 'bilati cotni', english: 'Tomato sauce' },
    { id: 'e21', olChiki: 'ᱵᱚᱨᱚᱯᱷ', transliteration: 'boroph', english: 'Ice' },
    { id: 'e22', olChiki: 'ᱵᱤᱥᱠᱩᱴ', transliteration: 'biskut', english: 'Biscuit' },
    { id: 'e23', olChiki: 'ᱡᱚᱱᱚᱲᱟ', transliteration: 'jonoda', english: 'Maize' }, // Corrected spelling from Maiz
    { id: 'e24', olChiki: 'ᱡᱤᱞ', transliteration: 'jil_meat_eatable', english: 'Meat' },
    { id: 'e25', olChiki: 'ᱢᱮᱨᱚᱢ ᱡᱤᱞ', transliteration: 'merom jil', english: 'Mutton' },
    { id: 'e26', olChiki: 'ᱥᱩᱠᱨᱤ ᱡᱤᱞ', transliteration: 'sukri jil', english: 'Pork' },
    { id: 'e27', olChiki: 'ᱢᱤᱥᱨᱤ ᱪᱤᱱᱤ', transliteration: 'mesri chini', english: 'Sugar candy' },
    { id: 'e28', olChiki: 'ᱢᱟᱭᱫᱟ', transliteration: 'maida', english: 'Maida' },
    { id: 'e29', olChiki: 'ᱛᱩᱲᱤ', transliteration: 'tudi', english: 'Mustard' },
    { id: 'e30', olChiki: 'ᱧᱤᱸᱫᱟ ᱫᱟᱠᱟ', transliteration: 'ninda daka', english: 'Bread' },
    { id: 'e31', olChiki: 'ᱥᱚᱨᱵᱚᱛ', transliteration: 'sorbot', english: 'Syrup' },
    { id: 'e32', olChiki: 'ᱯᱟᱹᱨᱣᱟ', transliteration: 'părwa', english: 'Wine' },
    { id: 'e33', olChiki: 'ᱧᱮᱸᱞᱮᱨᱟᱥᱟ', transliteration: 'nelerasa', english: 'Honey' },
    { id: 'e34', olChiki: 'ᱛᱩᱲᱤ ᱥᱩᱱᱩᱢ', transliteration: 'tudi sunum', english: 'Mustard oil' },
  ],
  "Body Parts": [
    { id: 'bp1', olChiki: 'ᱩᱵᱽ', transliteration: 'ub', english: 'Hair' },
    { id: 'bp2', olChiki: 'ᱵᱚᱷᱚᱜ', transliteration: 'bohog', english: 'Head' },
    { id: 'bp3', olChiki: 'ᱠᱷᱟᱯᱨᱤ', transliteration: 'khapri', english: 'Skull' },
    { id: 'bp4', olChiki: 'ᱵᱤᱥᱤᱡᱟᱲ', transliteration: 'bisijad', english: 'Spinal cord' },
    { id: 'bp5', olChiki: 'ᱛᱚᱛᱠᱟ', transliteration: 'totka', english: 'Back of head' },
    { id: 'bp6', olChiki: 'ᱦᱟᱛᱟᱲ', transliteration: 'hatad', english: 'Brain' }, // Taking first option
    { id: 'bp7', olChiki: 'ᱢᱚᱞᱚᱝ', transliteration: 'molong', english: 'Forehead' },
    { id: 'bp8', olChiki: 'ᱢᱚᱲᱟ', transliteration: 'moda', english: 'Face' },
    { id: 'bp9', olChiki: 'ᱢᱮᱫ', transliteration: 'med', english: 'Eye' },
    { id: 'bp10', olChiki: 'ᱢᱮᱫ ᱠᱩᱴᱤ', transliteration: 'med kuti', english: 'Eyelid' },
    { id: 'bp11', olChiki: 'ᱢᱩ', transliteration: 'mu', english: 'Nose' },
    { id: 'bp12', olChiki: 'ᱛᱷᱚᱛᱱᱟ', transliteration: 'thotna', english: 'Cheek' },
    { id: 'bp13', olChiki: 'ᱞᱩᱛᱩᱨ', transliteration: 'lutur', english: 'Ear' },
    { id: 'bp14', olChiki: 'ᱢᱚᱪᱟ', transliteration: 'mocha', english: 'Mouth' },
    { id: 'bp15', olChiki: 'ᱞᱩᱴᱤ', transliteration: 'luti', english: 'Lip' },
    { id: 'bp16', olChiki: 'ᱛᱟᱹᱨᱩ', transliteration: 'tăru', english: 'Palate' },
    { id: 'bp17', olChiki: 'ᱰᱟᱴᱟ', transliteration: 'data', english: 'Tooth' },
    { id: 'bp18', olChiki: 'ᱟᱞᱟᱝ', transliteration: 'alang', english: 'Tongue' },
    { id: 'bp19', olChiki: 'ᱦᱚᱴᱚᱜᱽ', transliteration: 'hotog', english: 'Neck' },
    { id: 'bp20', olChiki: 'ᱛᱟᱨᱮᱱ', transliteration: 'taren', english: 'Shoulder' },
    { id: 'bp21', olChiki: 'ᱥᱚᱯᱟ', transliteration: 'sopa', english: 'arm' },
    { id: 'bp22', olChiki: 'ᱦᱟᱨᱛᱟ', transliteration: 'harta', english: 'Skin' },
    { id: 'bp23', olChiki: 'ᱛᱤ', transliteration: 'ti', english: 'Hand' },
    { id: 'bp24', olChiki: 'ᱢᱚᱠᱟ', transliteration: 'moka', english: 'Elbow' },
    { id: 'bp25', olChiki: 'ᱛᱤᱷ ᱛᱟᱞᱠᱷᱟ', transliteration: 'ti talka', english: 'Palm' },
    { id: 'bp26', olChiki: 'ᱠᱟᱹᱴᱩᱵ', transliteration: 'kăṭub', english: 'Finger' },
    { id: 'bp27', olChiki: 'ᱨᱟᱢᱟ', transliteration: 'rama', english: 'Nail' },
    { id: 'bp28', olChiki: 'ᱮᱸᱜᱟ ᱠᱟᱹᱴᱩᱵ', transliteration: 'enga kăṭub', english: 'Thumb' },
    { id: 'bp29', olChiki: 'ᱩᱫᱩᱜ ᱠᱟᱹᱴᱩᱵ', transliteration: 'udug kăṭub', english: 'Pointer Finger' },
    { id: 'bp30', olChiki: 'ᱥᱤᱫ ᱠᱟᱹᱴᱩᱵ', transliteration: 'sid kăṭub', english: 'Middle finger' },
    { id: 'bp31', olChiki: 'ᱵᱟᱯᱞᱟ ᱠᱟᱹᱴᱩᱵᱽ', transliteration: 'bapla kăṭub', english: 'Ring finger' },
    { id: 'bp32', olChiki: 'ᱦᱩᱰᱤᱧ ᱠᱟᱹᱴᱩᱵ', transliteration: 'huḍinj kăṭub', english: 'Little finger' },
    { id: 'bp33', olChiki: 'ᱠᱚᱲᱟᱢ', transliteration: 'koṛam', english: 'Chest' },
    { id: 'bp34', olChiki: 'ᱵᱚᱨᱚ', transliteration: 'boro', english: 'Lungs' },
    { id: 'bp35', olChiki: 'ᱤᱱ', transliteration: 'in', english: 'Heart' },
    { id: 'bp36', olChiki: 'ᱵᱩᱠᱟᱹ', transliteration: 'bukă', english: 'Navel' },
    { id: 'bp37', olChiki: 'ᱫᱮᱭᱟ', transliteration: 'deya', english: 'Back' },
    { id: 'bp38', olChiki: 'ᱰᱩᱵᱷᱤ', transliteration: 'ḍubhi', english: 'Rump' },
    { id: 'bp39', olChiki: 'ᱞᱟᱡᱽ', transliteration: 'laj', english: 'Stomach' },
    { id: 'bp40', olChiki: 'ᱰᱟᱸᱰᱟ', transliteration: 'ḍanḍa', english: 'Waist' },
    { id: 'bp41', olChiki: 'ᱢᱩᱛᱩ', transliteration: 'mutu', english: 'genital' },
    { id: 'bp42', olChiki: 'ᱰᱮᱠᱮ', transliteration: 'ḍeke', english: 'Buttock' },
    { id: 'bp43', olChiki: 'ᱡᱟᱝ', transliteration: 'jang', english: 'Bone' },
    { id: 'bp44', olChiki: 'ᱡᱤᱞ', transliteration: 'jil_meat_bodypart', english: 'Meat' },
    { id: 'bp45', olChiki: 'ᱢᱟᱭᱟᱢ', transliteration: 'mayam', english: 'Blood' },
    { id: 'bp46', olChiki: 'ᱵᱩᱞᱩ', transliteration: 'bulu', english: 'Thigh' }, // Taking first option
    { id: 'bp47', olChiki: 'ᱴᱷᱤᱴᱲᱟᱜ', transliteration: 'ṭhiṭṛag', english: 'Knee' }, // Taking first option
    { id: 'bp48', olChiki: 'ᱡᱟᱝᱜᱟ', transliteration: 'janga', english: 'Foot' },
    { id: 'bp49', olChiki: 'ᱤᱲᱤ', transliteration: 'iṛi', english: 'Heel' },
    { id: 'bp50', olChiki: 'ᱡᱟᱝᱜᱟ ᱛᱷᱚᱯᱮ', transliteration: 'Janga thope', english: 'Feet' },
  ],
  "Plants & Nature": [
    { id: 'p1', olChiki: 'ᱫᱟᱨᱮ', transliteration: 'dare', english: 'Tree' },
    { id: 'p2', olChiki: 'ᱵᱟᱦᱟ', transliteration: 'baha', english: 'Flower' },
    { id: 'p3', olChiki: 'ᱥᱟᱠᱟᱢ', transliteration: 'sakam', english: 'Leaf' },
    { id: 'p4', olChiki: 'ᱵᱩᱨᱩ', transliteration: 'buru', english: 'Mountain' },
    { id: 'p5', olChiki: 'ᱜᱟᱰᱟ', transliteration: 'gaḍa', english: 'River' },
    { id: 'p6', olChiki: 'ᱥᱤᱧ', transliteration: 'siñ', english: 'Sun' },
    { id: 'p7', olChiki: 'ᱪᱟᱸᱫᱚ', transliteration: 'cando', english: 'Moon' },
  ],
  "Things & Objects": [
    { id: 't1', olChiki: 'ᱚᱲᱟᱜ', transliteration: 'oṛag', english: 'House' },
    { id: 't2', olChiki: 'ᱠᱤᱛᱟᱹᱵ', transliteration: 'kitāb', english: 'Book' },
    { id: 't3', olChiki: 'ᱪᱩᱢᱟᱹᱬ', transliteration: 'cumaṇ', english: 'Pot' },
    { id: 't4', olChiki: 'ᱥᱟᱭᱠᱮᱞ', transliteration: 'saikel', english: 'Bicycle' },
    { id: 't5', olChiki: 'ᱫᱟᱜ', transliteration: 'dag’', english: 'Water' },
    { id: 't6', olChiki: 'ᱠᱟᱹᱴᱩᱵ', transliteration: 'kăṭub_knife', english: 'Knife' },
    { id: 't7', olChiki: 'ᱪᱟᱨᱯᱟᱭ', transliteration: 'carpai', english: 'Bed' },
  ],
  "Food Items": [
    { id: 'f1', olChiki: 'ᱫᱟᱠᱟ', transliteration: 'daka', english: 'Cooked Rice' },
    { id: 'f2', olChiki: 'ᱩᱛᱩ', transliteration: 'utu_curry', english: 'Curry/Vegetable Dish' },
    { id: 'f3', olChiki: 'ᱡᱚ', transliteration: 'jo', english: 'Fruit' },
    { id: 'f4', olChiki: 'ᱯᱤᱴᱷᱟᱹ', transliteration: 'piṭhạ̈', english: 'Rice Cake/Pancake' },
    { id: 'f5', olChiki: 'ᱦᱟᱺᱰᱤ', transliteration: 'haṇḍi', english: 'Rice Beer' },
    { id: 'f6', olChiki: 'ᱵᱩᱞᱩᱝ', transliteration: 'buluṅ', english: 'Salt' },
    { id: 'f7', olChiki: 'ᱢᱟᱹᱨᱤᱪ', transliteration: 'mărich_chilli', english: 'Chilli' },
  ],
  "Relations": [
    { id: 'rel1', olChiki: 'ᱵᱟᱵᱟ', transliteration: 'baba', english: 'Father' },
    { id: 'rel2', olChiki: 'ᱟᱭᱚ', transliteration: 'ayo', english: 'Mother' },
    { id: 'rel3', olChiki: 'ᱠᱟᱠᱟ', transliteration: 'kaka', english: 'Uncle' },
    { id: 'rel4', olChiki: 'ᱠᱟᱹᱠᱤ', transliteration: 'kaki', english: 'Aunt' },
    { id: 'rel5', olChiki: 'ᱜᱚᱲᱚᱢ ᱦᱟᱲᱟᱢ', transliteration: 'godom hadam', english: 'Grand Father' },
    { id: 'rel6', olChiki: 'ᱜᱚᱲᱚᱢ ᱵᱩᱲᱷᱤ', transliteration: 'godom budhi', english: 'Grand Mother' },
    { id: 'rel7', olChiki: 'ᱡᱟᱶᱟᱭ ᱜᱚᱢᱠᱮ', transliteration: 'jaway gomke', english: 'Son in law' },
    { id: 'rel8', olChiki: 'ᱜᱟᱛᱮ', transliteration: 'gaate', english: 'Friend' },
    { id: 'rel9', olChiki: 'ᱜᱚᱲᱚᱢ ᱦᱚᱲᱟᱢ', transliteration: 'godom horam', english: 'Maternal Grandfather' },
    { id: 'rel10', olChiki: 'ᱜᱚᱲᱚᱢ ᱵᱩᱲᱷᱤ', transliteration: 'godom budhi_maternal', english: 'Maternal Grandmother' },
    { id: 'rel11', olChiki: 'ᱡᱟᱶᱟᱭ', transliteration: 'jaway', english: 'Husband' }, // Changed from jaway gomke
    { id: 'rel12', olChiki: 'ᱵᱤᱴᱤ', transliteration: 'biti', english: 'Daughter' },
    { id: 'rel13', olChiki: 'ᱵᱮᱴᱟ', transliteration: 'beta', english: 'Son' },
    { id: 'rel14', olChiki: 'ᱫᱩᱞᱟᱹᱲ', transliteration: 'dulăṛ', english: 'Love' },
    { id: 'rel15', olChiki: 'ᱵᱚᱠᱚᱧ ᱠᱩᱲᱤ', transliteration: 'bokoing kudi', english: 'Sister' },
    { id: 'rel16', olChiki: 'ᱵᱚᱭᱦᱟ', transliteration: 'boyha', english: 'Brother' },
    { id: 'rel17', olChiki: 'ᱯᱮᱲᱟ', transliteration: 'peda', english: 'Guest' },
    { id: 'rel18', olChiki: 'ᱢᱟᱪᱮᱛ', transliteration: 'machet', english: 'Teacher' },
    { id: 'rel19', olChiki: 'ᱜᱩᱨᱩ', transliteration: 'guru', english: 'Preceptor' },
    { id: 'rel20', olChiki: 'ᱤᱨᱤᱞ ᱠᱩᱲᱤ ᱥᱟᱞᱤ', transliteration: 'iril kudi sali', english: "Sister in law (wife's younger sister)" },
    { id: 'rel21', olChiki: 'ᱤᱨᱤᱞ ᱠᱩᱲᱤ ᱱᱚᱱᱚᱫ', transliteration: 'iril kudi nonod', english: "Sister in law (husband's sister)" },
    { id: 'rel22', olChiki: 'ᱤᱨᱤᱞ ᱠᱩᱲᱤ ᱫᱮᱣᱨᱟᱱᱤ', transliteration: 'iril kudi dewrani', english: "Sister in law (younger brother's wife)" },
    { id: 'rel23', olChiki: 'ᱢᱟᱢᱟ', transliteration: 'mama', english: 'Maternal Uncle' },
    { id: 'rel24', olChiki: 'ᱢᱟᱢᱤ', transliteration: 'mami', english: 'Maternal Aunt' },
    { id: 'rel25', olChiki: 'ᱠᱟᱹᱠᱤ', transliteration: 'kaki_mothers_sister', english: "Mother's sister" },
    { id: 'rel26', olChiki: 'ᱟᱪᱮᱛ', transliteration: 'achet', english: 'Pupil' },
    { id: 'rel27', olChiki: 'ᱱᱤᱡᱟᱹᱨ', transliteration: 'nijăr', english: 'Own' },
    { id: 'rel28', olChiki: 'ᱦᱚᱧᱦᱟᱨ ᱵᱟᱵᱟ', transliteration: 'honjhar baba', english: 'Father in law' },
    { id: 'rel29', olChiki: 'ᱦᱚᱧᱦᱟᱨ ᱟᱭᱚ', transliteration: 'honjhar ayo', english: 'Mother in law' },
    { id: 'rel30', olChiki: 'ᱱᱤᱡᱟᱹᱨ ᱯᱮᱲᱟ', transliteration: 'nijăr peṛa', english: 'Relative' },
    { id: 'rel31', olChiki: 'ᱠᱟᱴ ᱵᱟᱵᱟ', transliteration: 'kat baba', english: 'Step Father' },
    { id: 'rel32', olChiki: 'ᱪᱷᱩᱴᱠᱤ ᱟᱭᱚ', transliteration: 'chutki ayo', english: 'Step Mother' },
    { id: 'rel33', olChiki: 'ᱪᱷᱩᱴᱠᱤ ᱵᱚᱠᱚᱧ', transliteration: 'chutki bokoenj', english: 'Step Brother' },
    { id: 'rel34', olChiki: 'ᱪᱷᱩᱴᱠᱤ ᱵᱚᱠᱚᱧ ᱠᱩᱲᱤ', transliteration: 'chutki bokoenj kudi', english: 'Step Sister' },
    { id: 'rel35', olChiki: 'ᱪᱷᱩᱴᱠᱤ ᱵᱚᱠᱚᱧ ᱮᱨᱟ', transliteration: 'chutki bokoenj era', english: 'Step Daughter' },
    { id: 'rel36', olChiki: 'ᱪᱷᱩᱴᱠᱤ ᱦᱚᱯᱚᱱ', transliteration: 'chutki hopon', english: 'Step Son' },
    { id: 'rel37', olChiki: 'ᱦᱤᱞᱤ', transliteration: 'hili', english: 'Maternal Sister' },
  ],
  "Days of the Week": [
    { id: 'd1', olChiki: 'ᱥᱤᱸᱜᱤ', transliteration: 'singi', english: 'Sunday' },
    { id: 'd2', olChiki: 'ᱚᱛᱮ', transliteration: 'ote', english: 'Monday' },
    { id: 'd3', olChiki: 'ᱵᱟᱞᱮ', transliteration: 'bale', english: 'Tuesday' },
    { id: 'd4', olChiki: 'ᱥᱟᱹᱜᱩᱱ', transliteration: 'săgun', english: 'Wednesday' },
    { id: 'd5', olChiki: 'ᱥᱟᱹᱨᱫᱤ', transliteration: 'sărdi', english: 'Thursday' },
    { id: 'd6', olChiki: 'ᱡᱟᱹᱨᱩᱵ', transliteration: 'jărub', english: 'Friday' },
    { id: 'd7', olChiki: 'ᱧᱩᱸᱦᱩᱢ', transliteration: 'inguhum', english: 'Saturday' },
  ],
  "Months": [
    { id: 'm1', olChiki: 'ᱢᱟᱜᱽ', transliteration: 'mag', english: 'January' },
    { id: 'm2', olChiki: 'ᱯᱷᱟᱹᱜᱩᱱ', transliteration: 'phăgun', english: 'February' },
    { id: 'm3', olChiki: 'ᱪᱟᱹᱛ', transliteration: 'chăt', english: 'March' },
    { id: 'm4', olChiki: 'ᱵᱟᱹᱭᱥᱟᱹᱠ', transliteration: 'băisăk', english: 'April' },
    { id: 'm5', olChiki: 'ᱡᱷᱮᱴ', transliteration: 'jhet', english: 'May' },
    { id: 'm6', olChiki: 'ᱟᱥᱟᱲ', transliteration: 'aasadh', english: 'June' },
    { id: 'm7', olChiki: 'ᱥᱟᱱ', transliteration: 'san', english: 'July' },
    { id: 'm8', olChiki: 'ᱵᱷᱟᱫᱚᱨᱵ', transliteration: 'bhadrob', english: 'August' },
    { id: 'm9', olChiki: 'ᱫᱟᱥᱟᱸᱭ', transliteration: 'dasaye', english: 'September' },
    { id: 'm10', olChiki: 'ᱥᱚᱦᱨᱟᱭ', transliteration: 'sohray', english: 'October' },
    { id: 'm11', olChiki: 'ᱟᱜᱷᱟᱲ', transliteration: 'aghad', english: 'November' },
    { id: 'm12', olChiki: 'ᱯᱩᱥ', transliteration: 'pus', english: 'December' }
  ],
  "Time": [
    { id: 'time1', olChiki: 'ᱫᱤᱱ', transliteration: 'din', english: 'Day' },
    { id: 'time2', olChiki: 'ᱦᱟᱴ', transliteration: 'hat', english: 'Week' },
    { id: 'time3', olChiki: 'ᱪᱟᱸᱫᱚ', transliteration: 'chando_month', english: 'Month' },
    { id: 'time4', olChiki: 'ᱥᱮᱨᱢᱟ', transliteration: 'serma', english: 'Year' },
    { id: 'time5', olChiki: 'ᱴᱟᱲᱟᱝ', transliteration: 'tadang', english: 'Hour' },
    { id: 'time6', olChiki: 'ᱴᱤᱯᱤᱡ', transliteration: 'tipij', english: 'Minute' },
    { id: 'time7', olChiki: 'ᱴᱤᱡ', transliteration: 'tij', english: 'Second' },
  ],
  "Other Common Words": [
    { id: 'o1', olChiki: 'ᱤᱥᱠᱩᱞ', transliteration: 'iskul', english: 'School' },
    { id: 'o2', olChiki: 'ᱵᱟᱡᱟᱨ', transliteration: 'bajar', english: 'Market' },
    { id: 'o3', olChiki: 'ᱦᱚᱲ', transliteration: 'hɔṛ', english: 'Person/Man' },
    { id: 'o4', olChiki: 'ᱟᱹᱛᱩ', transliteration: 'ătu', english: 'Village' },
    { id: 'o5', olChiki: 'ᱧᱩᱛᱟᱹ', transliteration: 'ñută', english: 'Night' },
    { id: 'o6', olChiki: 'ᱥᱮᱛᱟᱜ', transliteration: 'setag', english: 'Morning' },
    { id: 'o7', olChiki: 'ᱟᱭᱩᱵ', transliteration: 'ayub', english: 'Evening' },
    { id: 'o8', olChiki: 'ᱮᱱᱮᱭ', transliteration: 'eney', english: 'dance' },
  ],
  "Expanded General Vocabulary": [
    // Previous egv entries will be here
  ],
};

const newDictionaryDataString = `
a
add – vt. SELED;
addition – n. SELED;
address – n. BUtA.; tHIKA.nA;
adjective – n. GUnUn;
adverb – n. TonoZ;
all – adj. SAnAm; JoTo; JAKAT;
angle – n. KOnA; KoNM;
animal – n. JAnWoR;
association – n. SEmLED;
b
bad – adj. BA.ZIJ; BAF_tHIK;
beginning – ge. ETohoB; EhoB;
big – adj. SE:MA; mARAF;
bird – n. CE:ME.;
black – adj. hE:DE.;
blacken – vt. hE:DE.;
blue – adj. LIL;
boil – vt., vi. hE:dE.J; hEdEJ;
bone – n. JAF;
book – n. PoToB; PUTHI;
boy – n. KoZA GIDX_RA.; BA.BU GIDX_RA.;
brain – n. hATAF; BHEJA;
break – vt., vi. RA.PUD;
bring – vt. A.GU;
broken – adj. RA.PUD;
c
cat – n. PUSI;
chief minister – n. SIRA. monTRI;
child – n. GIDX_RA.; hoPon;
collection – n. JARWA; JAWRA;
column – n. TINGU THAR;
colour – n., vt. RoF;
complete – adj. PURA.; vt. SA.T; CABA;
compose – vt. GABAn;
composition – n. GABAn;
conjunction – n. TonoF;
consonant – n. KECED AZAF;
continuous – adj. CoLoT;
count – vt. LEKHA; vi. BHoRSA;
country – n., adj. DISom;
cry – n., vi. RAG;
d
dance – n., vi. EnEJ;
decide – vt. tHA.WKA.;
decision – n. tHA.WKA.;
depend – vi. BHoRSA;
digit – n. EL;
direction – n. PAStA; PAhtA; SED; DISA.;
divide – vt. hA.tIQ; BHAGX; JUZU;
dividend – n. hAtAMCA;
divider – n. hAtAMhA;
division – n. hAtAM; hA.tIQ; BHAGX;
do – vt. KoRAW; KA.mI;
dog – n. SETA;
drink – n. QU~ JInIS; vt. QU~;
drop – n. tHoP; BUNDX; vt., vi. QUR;
dry – adj., vt., vi. RohoZ;
e
eat – vt., vi. Jom;
eatable – n. Jom; Jom_QU~; adj. JomAG JANhAN Jom DAZEGoG_A;
eight – n., adj. IRA.L;
eighth – adj. IRA.LAG; IRA.LIJ;
end – n., vt., vi. mUCA.D;
environment – n. SACARhE;
example – n. QECEL;
f
fact – n. SA.RI KATHA;
fan – n. PAFKHA;
far – adj. SA:GIQ;
fast – adv. LoGon;
fat – n. ITIL; CoRBI; adj. motA;
fifth – adj. moMEYAG; moMEYIJ;
fight – n., vi. TAPAm;
figure – n. RUP; CHoBI;
finish – vt. SA.T; CABA;
fire – n. SE:GE.L; vi. tHU;
first – adj. mAMAF; mAMAFAG; PUYLUWAG; mAMAFIJ; PUYLUYIJ; mIDAG; mIDIJ;
fish – n. hA.KU;
five – n. moME; adj. moME; moME GotEJ;
fly – n. Ro~; vi. UdA.W;
food – n. Jom, Jom_QU~; JomAG; Jom_QUWAG;
form – n. RUP; vt, vi. . BE.nAW;
four – n. PUn; adj. PUn; PUnYA.;
fourth – adj. PUnA.G; PUnIJ;
fox – n. TUYU;
frog – n. RotE;
fry – n., vt. BHA.JI;
function – n. KA.mI;
future – adj. DARAY; AGAm;
g
garden – n. BAGAn;
gather – vt., vi. JARWA; JAWRA;
gender – n. JAnAF; masculine gender – n. KoZA JAnAF; feminine gender – n. KUZI JAnAF; neuter gender – n. hAD JAnAF; common gender – n. JA.T JAnAF;
geography – n. oTno;
girl – n. KUZI GIDX_RA.; mA.Y GIDX_RA.;
give – vt. Em;
go – vi. SEn; CALAW;
good – adj. BES;
grammar – n. RonoZ;
h
heap – n. PUNJI;
hill – n. BURU; dUNGX_RI;
history – n. nAGAm;
i
imprison – vt. JIhoL;
include – vt. ANGoC;
interjection – n. hAnAW;
intransitive – adj. onoG;
j
jail – n. JIhoL;
join – n., vt., vi. KHoNJA;
joint – n. KHoNJA;
k
keep – vt. Doho;
kind (type) – n. ToRon;
kind – adj. DoYALU;
know – vt. BAdAY; BAZAY;
l
language – n. RoZ; BHASA;
laugh – vi. LANDA;
law – n. nIYom; KA.nUn;
length – n. JHA.L;
lengthen – vt. JHA.L;
life – n. JIWI~; JIBon;
live – vi. TANhEn;
line – n. GAR;
literature – n. SAVhED;
long – adj. JHA.L;
lubricate – vt. SUnUm;
m
man (human being) – n. hoZ;
man (as a male) – n. KoZA;
marriage – n. BAPLA;
mathematician – n. ELKHARIYA.;
mathematics – n. ELKHA;
meat – n. JIL;
medicine – n. RAn;
meet – vi. QAPAm;
meeting – n. mIDUn;
milk – n. TOWA; ToWA; vt. DUhA.W;
motion – n. CoLoT;
mountain – n. BURU;
mud – n. LoSoD;
n
name – n., vt. QUTUm;
news – n. KHoBoR;
nine – n., adj. ARE;
ninth – adj. AREYAG; AREYIJ;
noun – n. QUnUm;
now – adv. nIToG; nIToF; nIT;
number (in grammar) – n. GotAn; singular number – n. mID GotAn; dual number – n. BAR GotAn; plural number – n. SANGE GotAn;
number (in mathematics) – n. LEKHA;
o
object – n. JoToS;
oceanography – n. DoRYATno;
oil – n., vt. SUnUm;
old – adj. mARE; mAREnAG;
one – n. mID; adj. mID; mIDtIJ;
p
page – n. SAhtA;
parts of speech – n. PA.RIS;
past – n., adj. EnAF; SEDAY; PA.hIL;
perfect – adj. SA.TA.n;
person (in grammar) – n. GoRon; first person – n. mAMAF GoRon; second person – n. SAmAF GoRon; third person – n. SA:GIQ GoRon;
person – n. hoZ;
picture – n. CHoBI;
place – n. JAYGA; vt. tHANV;
point – n. tUdA.G; BInDU; vi. UDUG;
position – n. tHANV;
postposition – n. GA:nA.t;
preface – n. onoZ;
present – adj. nITAF; nAhAG;
president – n. PARSET;
press – vt. oTA;
previous – adj. PA.hIL; mAMAF;
prime minister – n. mARAF monTRI;
prison – n. JIhoL;
procession – n. mICHIL;
pronoun – n. UQUm;
q
queen – n. RA.nI;
quotient – n. hAZA; JUZU;
r
rat – n. GUdU; CUtU; SARGA; CUNDX;
recognition – n. UPURUm;
red – adj. ARAG;
relation – n. SA.GA.Y;
remainder – n. hAtAMSA; SAREJ;
root – n. REhED; BUtA; PHEZAT; JAF;
row – n. GITIJ THAR;
rule – n. nIYom;
s
save – vt. BAQCAW;
schedule – n. DHAP;
school – n. ASnA;
science – n. SANMES;
search – vt., vi. PAnTE;
second – adj. BARAG; DoSARAG; BARIJ; DoSARIJ; DoSAR; mID SE.KE.nd SomoY;
secretary – n. SUTRET; assistant secretary – n. JoGo SUTRET;
see – vt., vi. QEL;
seed – n. JAF; ITA.;
send – vt. BHEJA;
sentence – n. A.YA.T;
set – n. JARWA; JAWRA;
seven – n., adj. EYAY;
seventh – adj. EYAYAG; EYAYIJ;
share – n. JUZU; hA.tIQ; BHAGX; hAZA; vt. hA.tIQ; BHAGX;
shoe – n. PAnAhI; JUTA.;
sin – n., vi. PAP;
sinner – n. PA.PI;
sit – vi. DUZUB;
six – n., adj. TURUY;
sixth – adj. TURUYAG; TURUYIJ;
sleep – n., vi. JA.PID;
slim – adj., vi. PATLA; moRA;
small – adj. hUdIQ;
smell – vt. JI~; n., vi. So~;
smile – n., vi. LANDA;
smoke – n. DHUNVA; vi. PUNGI QU~;
snake – n. BIQ;
society – n. SAVTA;
soil – n., vi. hASA;
soul – n. JIWI~;
sound – n., vi. SAdE; SAZE;
space – n. PHADA; JAYGA;
speak – vt., vi. RoZ; mEn;
student – n. CETETIYA.; CEDoGIJ;
subject – n. mUTA.n;
subtract – vt. BHEGED;
subtraction – n. BHEGED;
t
take – vt. IDI;
tall – adj. USUL;
talk – vi. RoZ; BHASon Em;
tea – n. CA;
teach – vt. PAZhAW;
teacher – n. mACET;
tell – vt. RoZ; mEn;
ten – n., adj. GEL;
tenth – adj. GELAG; GELIJ;
tense – n. nAF;
thing – n. JInIS;
third – adj. PEYAG; TESARAG; PEYIJ; TESARIJ; TESAR;
three – n. PE; adj. PE; PEYA;
throw – vt. CAPAD;
tiger – n. TA.RUB;
time – n. tAZAF; SomoY; oKTo;
transitive – adj. EnED;
two – n. BAR; adj. BAR; BARYA;
u
understand – vt., vi. BUJHA.W;
v
verb – n. KAnWA;
village – n. A.TU;
vowel – n. RAhA AZAF;
volcano – n. SE:GE.L BURU;
w
war – n. LA.ZhA.Y; JUDXDHo~;
water – n. DAG;
white – adj. PUNM;
wire – n. TAR;
woman – n. KUZI~; old woman – n. BUZhI; BUdHI;
word – n. A.ZA.;
write – vt., vi. oL;
writer – n. onoLIYA.;
`;

function parseDictionaryEntries(dictString: string): OlChikiWord[] {
  const entries: OlChikiWord[] = [];
  const lines = dictString.trim().split('\n');
  let entryIdCounter = categorizedOlChikiWords["Expanded General Vocabulary"] ? categorizedOlChikiWords["Expanded General Vocabulary"].length + 1 : 1;
  const uniqueEntryChecker = new Set<string>();

  // Populate uniqueEntryChecker with existing entries to avoid duplicates across merges
  if (categorizedOlChikiWords["Expanded General Vocabulary"]) {
    categorizedOlChikiWords["Expanded General Vocabulary"].forEach(item => {
      const key = `${item.english.toLowerCase().trim()}-${item.transliteration.toLowerCase().trim()}`;
      uniqueEntryChecker.add(key);
    });
  }


  for (const line of lines) {
    if (line.trim().length === 0) continue;

    if (line.trim().length === 1 && /^[a-zA-Z]$/.test(line.trim())) {
      continue; // Skip single-letter section headers
    }

    const parts = line.split(' – ');
    if (parts.length < 2) {
      // console.warn("Skipping line due to insufficient parts:", line);
      continue;
    }

    let englishPart = parts[0].trim();
    // Handle cases like "kind (type)" -> "kind"
    englishPart = englishPart.replace(/\s*\(.*?\)\s*/, '').trim();


    let detailsPart = parts.slice(1).join(' – ').trim();
    const posRegex = /^(n\.|adj\.|vt\.|vi\.|adv\.)\s*/;
    let romanTransliterationPart = detailsPart.replace(posRegex, '').trim();

    // Extract only the first Roman transliteration if multiple are given
    romanTransliterationPart = romanTransliterationPart.split(/[,;]/)[0].trim();
    // Remove further parenthetical explanations from Roman part
    romanTransliterationPart = romanTransliterationPart.replace(/\s*\(.*?\)\s*/g, '').trim();


    if (!englishPart || !romanTransliterationPart) {
      // console.warn("Skipping line due to missing English or Roman part after processing:", line);
      continue;
    }

    const olChikiScript = convertRomanKeyToOlChiki(romanTransliterationPart);

    const uniqueKey = `${englishPart.toLowerCase()}-${romanTransliterationPart.toLowerCase()}`;
    if (uniqueEntryChecker.has(uniqueKey)) {
      // console.warn(`Skipping duplicate entry for uniqueKey: ${uniqueKey} from line: ${line}`);
      continue;
    }
    uniqueEntryChecker.add(uniqueKey);

    entries.push({
      id: `genDict_${entryIdCounter++}`,
      english: englishPart,
      transliteration: romanTransliterationPart,
      olChiki: olChikiScript,
      category: "Expanded General Vocabulary",
    });
  }
  return entries;
}

const parsedNewWords = parseDictionaryEntries(newDictionaryDataString);

// Ensure "Expanded General Vocabulary" category exists
if (!categorizedOlChikiWords["Expanded General Vocabulary"]) {
  categorizedOlChikiWords["Expanded General Vocabulary"] = [];
}

// Merge new words, ensuring uniqueness again (belt and suspenders)
const combinedVocabulary = [...categorizedOlChikiWords["Expanded General Vocabulary"], ...parsedNewWords];
const finalUniqueEntriesMap = new Map<string, OlChikiWord>();
combinedVocabulary.forEach(item => {
    const key = `${item.english.toLowerCase().trim()}-${item.transliteration.toLowerCase().trim()}`;
    if (!finalUniqueEntriesMap.has(key)) {
        finalUniqueEntriesMap.set(key, item);
    }
});
categorizedOlChikiWords["Expanded General Vocabulary"] = Array.from(finalUniqueEntriesMap.values());


export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Re-export allOlChikiWords after updates
export const allOlChikiWords: OlChikiWord[] = Object.values(categorizedOlChikiWords).flat();

// console.log(`Total entries in 'Expanded General Vocabulary' after merging: ${categorizedOlChikiWords["Expanded General Vocabulary"].length}`);
// console.log(`Total unique entries in allOlChikiWords: ${allOlChikiWords.length}`);
    
