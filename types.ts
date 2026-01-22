
export enum Emotion {
  HAPPY = '愉快',
  DEPRESSED = '心情低落',
  EXCITED = '激动',
  SAD = '共感中',
  HUMOROUS = '调皮',
  TOXIC = '冷峻'
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  emotion?: Emotion;
  timestamp: number;
  sources?: string[];
}

export interface SystemStatus {
  batteryOptimization: boolean;
  learningProgress: number;
  stealthMode: boolean;
  scannedTopics: string[];
}
