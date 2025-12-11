import { GoogleGenAI, Modality } from "@google/genai";
import { SYSTEM_INSTRUCTION_TEACHER } from '../constants';

// Robust API Key Retrieval: Checks process.env (Node/Webpack) and import.meta.env (Vite)
const getApiKey = () => {
  if (typeof process !== 'undefined' && process.env?.API_KEY) {
    return process.env.API_KEY;
  }
  // @ts-ignore - import.meta is available in ES modules
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }
  return '';
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

// Audio Context for playback
let outputAudioContext: AudioContext | null = null;

export const generateEmotionAdvice = async (emotion: string): Promise<{ text: string, audioData?: string }> => {
  let adviceText = "";

  // Step 1: Generate Text Advice
  try {
    const prompt = `I am feeling ${emotion}. Can you explain what this feeling is and give me some advice on what to do?`;

    const textResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_TEACHER,
      }
    });

    adviceText = textResponse.text || "I'm listening...";

  } catch (error) {
    console.error("Error generating text advice:", error);
    return { text: "Oh no! I had trouble thinking. Try again?", audioData: undefined };
  }

  // Step 2: Generate Audio (TTS) from the advice
  // We do this separately to ensure we have the text to display even if audio fails
  let audioData: string | undefined;
  
  try {
    if (adviceText && adviceText !== "I'm listening...") {
        // Clean text for TTS (optional, but good practice to remove markdown like bolding)
        const ttsText = adviceText.replace(/[*#]/g, ''); 
        
        const ttsResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text: ttsText }] }],
          config: {
            // TTS model typically does not support systemInstruction, so we omit it here.
            responseModalities: [Modality.AUDIO], 
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' }, 
              },
            },
          },
        });

        const candidate = ttsResponse.candidates?.[0];
        audioData = candidate?.content?.parts?.[0]?.inlineData?.data;
    }
  } catch (error) {
    console.warn("Error generating audio advice:", error);
    // Continue without audio - better to show text than nothing
  }

  return {
    text: adviceText,
    audioData: audioData
  };
};

// Helper to play the audio data returned by Gemini
export const playAudio = async (base64Audio: string): Promise<void> => {
  try {
    if (!outputAudioContext) {
      outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    // If context is suspended (autoplay policy), resume it
    if (outputAudioContext.state === 'suspended') {
      await outputAudioContext.resume();
    }

    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // PCM Decoding
    const dataInt16 = new Int16Array(bytes.buffer);
    const numChannels = 1; 
    const sampleRate = 24000;
    
    const frameCount = dataInt16.length;
    const buffer = outputAudioContext.createBuffer(numChannels, frameCount, sampleRate);
    
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }

    const source = outputAudioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(outputAudioContext.destination);
    source.start();
  } catch (e) {
    console.error("Audio playback error:", e);
  }
};