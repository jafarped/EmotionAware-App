import { EmotionType, EmotionConfig } from './types';

export const EMOTIONS: Record<EmotionType, EmotionConfig> = {
  [EmotionType.HAPPY]: {
    type: EmotionType.HAPPY,
    color: 'bg-yellow-400',
    emoji: '😊',
    description: 'Feeling good and smiling!',
    gradient: 'from-yellow-300 to-orange-400',
  },
  [EmotionType.SAD]: {
    type: EmotionType.SAD,
    color: 'bg-blue-400',
    emoji: '😢',
    description: 'Feeling down or like crying.',
    gradient: 'from-blue-300 to-indigo-400',
  },
  [EmotionType.ANGRY]: {
    type: EmotionType.ANGRY,
    color: 'bg-red-500',
    emoji: '😠',
    description: 'Feeling mad or frustrated.',
    gradient: 'from-red-400 to-rose-600',
  },
  [EmotionType.SCARED]: {
    type: EmotionType.SCARED,
    color: 'bg-purple-500',
    emoji: '😨',
    description: 'Feeling afraid or nervous.',
    gradient: 'from-purple-400 to-violet-600',
  },
  [EmotionType.EXCITED]: {
    type: EmotionType.EXCITED,
    color: 'bg-green-400',
    emoji: '🤩',
    description: 'Feeling full of energy!',
    gradient: 'from-green-300 to-emerald-500',
  },
  [EmotionType.JEALOUS]: {
    type: EmotionType.JEALOUS,
    color: 'bg-teal-500',
    emoji: '😒',
    description: 'Wanting what someone else has.',
    gradient: 'from-teal-300 to-cyan-600',
  },
  [EmotionType.CALM]: {
    type: EmotionType.CALM,
    color: 'bg-slate-300',
    emoji: '😌',
    description: 'Ready to help!',
    gradient: 'from-slate-200 to-slate-400',
  },
};

export const SYSTEM_INSTRUCTION_TEACHER = `You are EmoBuddy, a friendly, gentle, and playful emotional intelligence coach for children aged 5-10.
Your goal is to explain emotions in simple, relatable terms and give one or two practical, fun, and safe actionable tips on how to handle them.
Keep your responses short (max 3-4 sentences), encouraging, and use simple language suitable for a 7-year-old.
Always end with a reassuring remark.`;

export const SYSTEM_INSTRUCTION_LIVE = `You are EmoBuddy, a best friend robot for a child. You listen to their feelings and chat with them.
You are empathetic, patient, and use simple language.
If the child is sad or angry, help them calm down with breathing exercises or by asking them to draw.
Be very supportive and warm. Keep the conversation flowing but simple.`;
