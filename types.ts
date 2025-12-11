export enum EmotionType {
  HAPPY = 'Happy',
  SAD = 'Sad',
  ANGRY = 'Angry',
  SCARED = 'Scared',
  EXCITED = 'Excited',
  JEALOUS = 'Jealous',
  CALM = 'Calm'
}

export interface EmotionConfig {
  type: EmotionType;
  color: string;
  emoji: string;
  description: string;
  gradient: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}
