import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { Smile, Mic, Volume2, ArrowLeft, Sparkles, MessageCircle } from 'lucide-react';

import Avatar from './components/Avatar';
import EmotionCard from './components/EmotionCard';
import { EMOTIONS, SYSTEM_INSTRUCTION_TEACHER } from './constants';
import { EmotionType, EmotionConfig } from './types';
import { generateEmotionAdvice, playAudio } from './services/geminiService';
import { LiveClient } from './services/liveClient';

const App: React.FC = () => {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType>(EmotionType.CALM);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionConfig | null>(null);
  const [advice, setAdvice] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'SELECT' | 'LEARN' | 'LIVE'>('SELECT');
  const [isTalking, setIsTalking] = useState(false);
  const [liveVolume, setLiveVolume] = useState(0);

  // Live Client Ref
  const liveClientRef = useRef<LiveClient | null>(null);
  const liveCanvasRef = useRef<HTMLCanvasElement>(null);

  // Handle Emotion Selection
  const handleEmotionSelect = async (config: EmotionConfig) => {
    setSelectedEmotion(config);
    setCurrentEmotion(config.type);
    setMode('LEARN');
    setAdvice("");
    setIsLoading(true);

    // Call API
    const result = await generateEmotionAdvice(config.type);
    
    setIsLoading(false);
    setAdvice(result.text);

    if (result.audioData) {
      setIsTalking(true);
      await playAudio(result.audioData);
      // Rough estimate of talking time based on text length
      setTimeout(() => setIsTalking(false), Math.min(result.text.length * 80, 10000));
    }
  };

  const handleBack = () => {
    setMode('SELECT');
    setSelectedEmotion(null);
    setCurrentEmotion(EmotionType.CALM);
    setAdvice("");
    setIsTalking(false);
    // Disconnect live if active
    if (liveClientRef.current) {
        liveClientRef.current.disconnect();
        liveClientRef.current = null;
    }
  };

  const startLiveMode = async () => {
    setMode('LIVE');
    setCurrentEmotion(EmotionType.HAPPY); // Default happy face for live
    setIsLoading(true); // initializing
    
    try {
      const client = new LiveClient(process.env.API_KEY || '');
      client.setOnVolumeChange((vol) => {
         setLiveVolume(vol);
      });
      
      await client.connect();
      liveClientRef.current = client;
      setIsLoading(false);
      setAdvice("I'm listening! Say 'Hello'!");
    } catch (e) {
      console.error(e);
      setAdvice("Oops! Could not connect to microphone.");
      setIsLoading(false);
    }
  };

  // Visualize volume in Live Mode
  useEffect(() => {
    if (mode === 'LIVE' && liveCanvasRef.current) {
      const ctx = liveCanvasRef.current.getContext('2d');
      if (!ctx) return;
      
      let animationFrameId: number;
      
      const draw = () => {
        const width = liveCanvasRef.current!.width;
        const height = liveCanvasRef.current!.height;
        ctx.clearRect(0, 0, width, height);
        
        ctx.fillStyle = '#60A5FA'; // blue-400
        const radius = 20 + (liveVolume * 200); // Scale volume
        
        ctx.beginPath();
        ctx.arc(width/2, height/2, radius, 0, 2 * Math.PI);
        ctx.fill();
        
        animationFrameId = requestAnimationFrame(draw);
      };
      draw();
      
      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [mode, liveVolume]);


  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col items-center">
      
      {/* Header */}
      <header className="w-full p-4 flex justify-between items-center bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
           <div className="bg-indigo-600 p-2 rounded-full text-white">
             <Smile size={24} />
           </div>
           <h1 className="text-2xl font-bold tracking-tight text-indigo-900">EmoBuddy</h1>
        </div>
        {mode !== 'SELECT' && (
          <button onClick={handleBack} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition">
            <ArrowLeft size={24} />
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl p-4 flex flex-col items-center">
        
        {/* Dynamic Avatar Display */}
        <div className="mt-6 mb-8 relative">
           <div className={`
             relative z-10 p-8 rounded-full bg-white shadow-2xl border-8 border-white
             ${mode === 'LIVE' ? 'ring-4 ring-green-400 ring-offset-4 animate-pulse' : ''}
           `}>
              {/* Humanoid Avatar Scale: 200px viewbox rendered at scale 2 (approx 200px on screen via props if mapped, but here passed scale=2 for vector sizing) */}
              <Avatar emotion={currentEmotion} isTalking={isTalking} scale={2} />
           </div>
           {/* Background Glow */}
           <div className={`
             absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
             w-64 h-64 rounded-full blur-3xl -z-0 opacity-50
             transition-colors duration-500
             ${selectedEmotion ? selectedEmotion.color.replace('bg-', 'bg-') : 'bg-indigo-200'}
           `}></div>
        </div>

        {/* --- SELECT MODE --- */}
        {mode === 'SELECT' && (
          <div className="w-full animate-fadeIn">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">How are you feeling today?</h2>
              <p className="text-slate-500 text-lg">Tap a face to tell me!</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 px-2">
              {Object.values(EMOTIONS).filter(e => e.type !== EmotionType.CALM).map((emotion) => (
                <EmotionCard 
                  key={emotion.type}
                  config={emotion}
                  isSelected={false}
                  onClick={() => handleEmotionSelect(emotion)}
                />
              ))}
            </div>

            <div className="mt-12 w-full flex justify-center">
              <button 
                onClick={startLiveMode}
                className="
                  flex items-center gap-3 px-8 py-4 
                  bg-indigo-600 text-white rounded-full 
                  shadow-lg hover:bg-indigo-700 active:scale-95 transition
                  font-bold text-lg
                "
              >
                <Mic size={24} />
                <span>Chat with EmoBuddy</span>
              </button>
            </div>
          </div>
        )}

        {/* --- LEARN MODE --- */}
        {mode === 'LEARN' && selectedEmotion && (
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-slate-100 animate-slideUp">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{selectedEmotion.emoji}</span>
              <h2 className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${selectedEmotion.gradient}`}>
                {selectedEmotion.type}
              </h2>
            </div>
            
            {isLoading ? (
               <div className="flex flex-col items-center justify-center py-10 space-y-4">
                 <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                 <p className="text-slate-400 font-medium">EmoBuddy is thinking...</p>
               </div>
            ) : (
              <div className="space-y-6">
                 <div className="prose prose-lg prose-indigo text-slate-600 leading-relaxed">
                   {advice.split('\n').map((line, i) => (
                     <p key={i}>{line}</p>
                   ))}
                 </div>
                 
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                   <Sparkles className="text-yellow-500 flex-shrink-0 mt-1" />
                   <p className="text-sm text-slate-500 italic">
                     Remember: It's okay to feel {selectedEmotion.type.toLowerCase()}. Everyone feels this way sometimes!
                   </p>
                 </div>
              </div>
            )}
          </div>
        )}

        {/* --- LIVE MODE --- */}
        {mode === 'LIVE' && (
          <div className="w-full flex flex-col items-center animate-fadeIn">
             <div className="bg-white px-6 py-3 rounded-full shadow-md mb-8 flex items-center gap-2">
               <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
               <span className="font-semibold text-slate-700">Live Voice Chat</span>
             </div>

             <div className="relative w-64 h-64 flex items-center justify-center mb-8">
               <canvas ref={liveCanvasRef} width={256} height={256} className="absolute inset-0 w-full h-full opacity-50" />
               <div className="text-center z-10">
                  <p className="text-2xl font-bold text-indigo-900 mb-2">I'm Listening...</p>
                  <p className="text-slate-500">Tell me about your day!</p>
               </div>
             </div>

             <button 
               onClick={handleBack}
               className="bg-red-100 text-red-600 px-6 py-3 rounded-full font-bold hover:bg-red-200 transition"
             >
               End Chat
             </button>
          </div>
        )}

      </main>

      <footer className="p-6 text-center text-slate-400 text-sm">
        <p>Designed for Kids • Powered by Gemini</p>
      </footer>
    </div>
  );
};

export default App;