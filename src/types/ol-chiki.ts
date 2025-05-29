
export interface OlChikiCharacter {
  id: string;
  olChiki: string;
  transliteration: string;
  pronunciation?: string; // IPA or simple guide
}

export interface OlChikiWord {
  id: string;
  olChiki: string;
  transliteration: string;
  english: string;
}

export interface OlChikiNumber {
  id: string;
  olChiki: string; // Ol Chiki numeral glyph
  digitString: string; // e.g., "0", "1", "10"
  englishWord: string; // e.g., "Zero", "One", "Ten"
  value: number; // The actual numeric value
  santaliWord: string; // Santali word for the number, e.g., "Sun", "Mit'"
}

export interface SantaliNamePart {
  olChiki: string;
  transliteration: string;
  meaning: string;
}


// Game related types
export interface GameLevel {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType; // Or string for image path if using actual image files
  stars: number; // 0-5, persisted score
  isLocked: boolean; // For future progression
  questionCount: number;
  gameComponentIdentifier: string; // To know which game component to render
}

export interface TranscriptionQuestion {
  id: string; // Typically the character's id
  olChiki: string;
  correctAnswer: string; // Transliteration or other expected answer
}

// Quiz related types for Reading/Writing Practice
export interface QuizScoreData {
  score: number;
  totalQuestions: number;
  stars: number;
}
