import React, { useMemo } from 'react';
import { EmotionType } from '../types';

interface AvatarProps {
  emotion: EmotionType;
  isTalking?: boolean;
  scale?: number;
}

const Avatar: React.FC<AvatarProps> = ({ emotion, isTalking = false, scale = 1 }) => {

  const features = useMemo(() => {
    // Default Shapes (Calm)
    let eyeShape = (
      <g>
        <ellipse cx="70" cy="95" rx="10" ry="12" fill="white" />
        <circle cx="70" cy="95" r="5" fill="#3E2723" />
        <ellipse cx="130" cy="95" rx="10" ry="12" fill="white" />
        <circle cx="130" cy="95" r="5" fill="#3E2723" />
        {/* Shine */}
        <circle cx="72" cy="92" r="2" fill="white" opacity="0.8" />
        <circle cx="132" cy="92" r="2" fill="white" opacity="0.8" />
      </g>
    );

    let mouthShape = (
       <path d="M 85 140 Q 100 145 115 140" fill="none" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" />
    );

    let eyebrowShape = (
       <g>
         <path d="M 60 75 Q 70 70 80 75" stroke="#3E2723" strokeWidth="3" fill="none" strokeLinecap="round" />
         <path d="M 120 75 Q 130 70 140 75" stroke="#3E2723" strokeWidth="3" fill="none" strokeLinecap="round" />
       </g>
    );

    let shirtColor = "#93C5FD"; // Blue-300
    let blush = false;
    let tear = false;

    switch (emotion) {
      case EmotionType.HAPPY:
        shirtColor = "#FCD34D"; // Yellow
        // Wide smile
        mouthShape = (
           <path d="M 75 135 Q 100 160 125 135" fill="none" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" />
        );
        // Happy arched brows
        eyebrowShape = (
           <g>
             <path d="M 60 75 Q 70 65 80 75" stroke="#3E2723" strokeWidth="3" fill="none" strokeLinecap="round" />
             <path d="M 120 75 Q 130 65 140 75" stroke="#3E2723" strokeWidth="3" fill="none" strokeLinecap="round" />
           </g>
        );
        blush = true;
        break;

      case EmotionType.EXCITED:
        shirtColor = "#4ADE80"; // Green
        // Big open mouth showing tongue
        mouthShape = (
            <g>
                <path d="M 75 135 Q 100 165 125 135 Z" fill="#5D4037" stroke="#5D4037" strokeWidth="2" strokeLinejoin="round" />
                <path d="M 90 155 Q 100 160 110 155" fill="none" stroke="#F472B6" strokeWidth="4" strokeLinecap="round" />
            </g>
        );
        // Wide eyes
        eyeShape = (
          <g>
            <ellipse cx="70" cy="95" rx="12" ry="14" fill="white" />
            <circle cx="70" cy="95" r="6" fill="#3E2723" />
            <ellipse cx="130" cy="95" rx="12" ry="14" fill="white" />
            <circle cx="130" cy="95" r="6" fill="#3E2723" />
            <circle cx="73" cy="92" r="3" fill="white" />
            <circle cx="133" cy="92" r="3" fill="white" />
          </g>
        );
        eyebrowShape = (
           <g>
             <path d="M 55 70 Q 70 60 85 70" stroke="#3E2723" strokeWidth="3" fill="none" strokeLinecap="round" />
             <path d="M 115 70 Q 130 60 145 70" stroke="#3E2723" strokeWidth="3" fill="none" strokeLinecap="round" />
           </g>
        );
        blush = true;
        break;

      case EmotionType.SAD:
        shirtColor = "#60A5FA"; // Blue
        // Frown
        mouthShape = (
           <path d="M 80 150 Q 100 135 120 150" fill="none" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" />
        );
        // Droopy eyelids look
        eyeShape = (
          <g>
             <ellipse cx="70" cy="95" rx="10" ry="10" fill="white" />
             <circle cx="70" cy="98" r="5" fill="#3E2723" />
             <path d="M 58 90 Q 70 95 82 90" fill="none" stroke="#D6A484" strokeWidth="2" /> {/* Eyelid */}

             <ellipse cx="130" cy="95" rx="10" ry="10" fill="white" />
             <circle cx="130" cy="98" r="5" fill="#3E2723" />
             <path d="M 118 90 Q 130 95 142 90" fill="none" stroke="#D6A484" strokeWidth="2" /> {/* Eyelid */}
          </g>
        );
        // Sad brows
        eyebrowShape = (
           <g>
             <path d="M 60 75 Q 65 70 80 80" stroke="#3E2723" strokeWidth="3" fill="none" strokeLinecap="round" />
             <path d="M 120 80 Q 135 70 140 75" stroke="#3E2723" strokeWidth="3" fill="none" strokeLinecap="round" />
           </g>
        );
        tear = true;
        break;

      case EmotionType.ANGRY:
        shirtColor = "#F87171"; // Red
        // Gritted teeth/line
        mouthShape = (
            <g>
             <path d="M 85 145 Q 100 140 115 145" fill="none" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" />
            </g>
        );
        // Sharp brows
        eyebrowShape = (
           <g>
             <path d="M 55 70 L 85 80" stroke="#3E2723" strokeWidth="4" fill="none" strokeLinecap="round" />
             <path d="M 115 80 L 145 70" stroke="#3E2723" strokeWidth="4" fill="none" strokeLinecap="round" />
           </g>
        );
        // Smaller pupils
        eyeShape = (
           <g>
            <ellipse cx="70" cy="95" rx="9" ry="9" fill="white" />
            <circle cx="70" cy="95" r="3" fill="#3E2723" />
            <ellipse cx="130" cy="95" rx="9" ry="9" fill="white" />
            <circle cx="130" cy="95" r="3" fill="#3E2723" />
           </g>
        );
        break;

      case EmotionType.SCARED:
        shirtColor = "#A78BFA"; // Purple
        // Open O mouth
        mouthShape = (
           <ellipse cx="100" cy="145" rx="10" ry="12" fill="#5D4037" />
        );
        // Wide eyes with small pupils
        eyeShape = (
          <g>
            <circle cx="70" cy="95" r="12" fill="white" stroke="#3E2723" strokeWidth="1" />
            <circle cx="70" cy="95" r="3" fill="#3E2723" />
            <circle cx="130" cy="95" r="12" fill="white" stroke="#3E2723" strokeWidth="1" />
            <circle cx="130" cy="95" r="3" fill="#3E2723" />
          </g>
        );
        // Raised brows
        eyebrowShape = (
           <g>
             <path d="M 60 70 Q 70 65 80 70" stroke="#3E2723" strokeWidth="3" fill="none" strokeLinecap="round" transform="translate(0, -5)" />
             <path d="M 120 70 Q 130 65 140 70" stroke="#3E2723" strokeWidth="3" fill="none" strokeLinecap="round" transform="translate(0, -5)" />
           </g>
        );
        break;

      case EmotionType.JEALOUS:
        shirtColor = "#2DD4BF"; // Teal
        // Straight mouth
        mouthShape = (
           <path d="M 85 145 L 115 145" fill="none" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" />
        );
        // Side eye
        eyeShape = (
          <g>
             <ellipse cx="70" cy="95" rx="10" ry="11" fill="white" />
             <circle cx="74" cy="95" r="5" fill="#3E2723" />
             <ellipse cx="130" cy="95" rx="10" ry="11" fill="white" />
             <circle cx="134" cy="95" r="5" fill="#3E2723" />
          </g>
        );
        // One raised brow
        eyebrowShape = (
           <g>
             <path d="M 60 75 L 85 75" stroke="#3E2723" strokeWidth="3" fill="none" strokeLinecap="round" />
             <path d="M 115 70 Q 130 65 145 70" stroke="#3E2723" strokeWidth="3" fill="none" strokeLinecap="round" />
           </g>
        );
        break;

      default:
        break;
    }

    return { eyeShape, mouthShape, eyebrowShape, shirtColor, blush, tear };
  }, [emotion]);


  return (
    <svg 
      width={100 * scale} 
      height={100 * scale} 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform duration-300"
    >
        <defs>
            <linearGradient id="skinGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#FFDFC4" />
                <stop offset="100%" stopColor="#F0C0A0" />
            </linearGradient>
            <linearGradient id="shirtGradient" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor={features.shirtColor} />
                <stop offset="100%" stopColor="white" stopOpacity="0.5" />
            </linearGradient>
        </defs>

        {/* --- BODY --- */}
        <g clipPath="url(#circleClip)">
             {/* Torso/Shoulders */}
             {/* We simulate shoulders by drawing a large curve at the bottom */}
             <path 
                d="M 30 220 C 30 170, 170 170, 170 220 L 170 230 L 30 230 Z" 
                fill={features.shirtColor} 
                transform="translate(0, -25)"
                className="transition-colors duration-500"
             />
             
             {/* Neck */}
             <path d="M 85 130 L 85 160 Q 100 170 115 160 L 115 130 Z" fill="#E8B898" />
             <path d="M 85 155 Q 100 165 115 155" fill="none" stroke="#D6A484" strokeWidth="2" />
        </g>
        
        {/* --- HEAD --- */}
        <g className="transition-transform duration-300">
            {/* Face Shape */}
            <ellipse cx="100" cy="100" rx="65" ry="70" fill="url(#skinGradient)" stroke="#E8B898" strokeWidth="2" />
            
            {/* Ears */}
            <path d="M 36 95 Q 30 105 38 115" fill="#FFDFC4" stroke="#E8B898" strokeWidth="2" />
            <path d="M 164 95 Q 170 105 162 115" fill="#FFDFC4" stroke="#E8B898" strokeWidth="2" />

            {/* Hair (Back) */}
            {/* <path d="M 40 100 C 40 40, 160 40, 160 100" fill="#3E2723" strokeWidth="0" /> */}

            {/* Hair (Top/Front) */}
            <path 
                d="M 30 90 C 25 30, 175 30, 170 90 C 170 110, 160 80, 160 70 C 140 20, 60 20, 40 70 C 40 80, 30 110, 30 90 Z" 
                fill="#3E2723" 
            />
            {/* Hair Detail */}
            <path d="M 100 25 Q 110 15 120 30" fill="none" stroke="#5D4037" strokeWidth="3" strokeLinecap="round" />

            {/* --- FACIAL FEATURES --- */}
            
            {/* Brows */}
            {features.eyebrowShape}
            
            {/* Eyes */}
            {features.eyeShape}
            
            {/* Nose */}
            <path d="M 98 110 Q 100 115 102 110" fill="none" stroke="#D6A484" strokeWidth="3" strokeLinecap="round" />

            {/* Cheeks/Blush */}
            {features.blush && (
                <g opacity="0.4">
                    <circle cx="55" cy="115" r="8" fill="#FF8ba7" />
                    <circle cx="145" cy="115" r="8" fill="#FF8ba7" />
                </g>
            )}

            {/* Tear */}
            {features.tear && (
                <path d="M 130 105 Q 135 115 130 125 Q 125 115 130 105" fill="#60A5FA" className="animate-pulse-slow" />
            )}

            {/* Mouth (Animated) */}
            <g 
               className={isTalking ? "animate-talking" : ""} 
               style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            >
                {features.mouthShape}
            </g>
        </g>
    </svg>
  );
};

export default Avatar;
