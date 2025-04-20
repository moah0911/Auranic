import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FaShareAlt, FaRedoAlt, FaCamera, FaMusic } from 'react-icons/fa';
import { AnalysisResult } from '@/lib/types';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';

// Extended interface to handle song data
interface ResultsScreenProps {
  result: AnalysisResult & { songName?: string };
  onScanAgain: () => void;
}

export default function ResultsScreen({ result, onScanAgain }: ResultsScreenProps) {
  const resultCardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isSongAnalysis = 'songName' in result && Boolean(result.songName);

  const glitchAnimation = {
    animate: {
      textShadow: [
        '2px 0 #ff2d95, -2px 0 #0ef',
        '-2px 0 #ff2d95, 2px 0 #0ef',
        '2px 0 #0ef, -2px 0 #ff2d95',
        '-2px 0 #0ef, 2px 0 #ff2d95'
      ],
      x: [0, 2, -5, 0, 5, -2, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse" as const,
        times: [0, 0.34, 0.36, 0.38, 0.64, 0.66, 0.68]
      }
    }
  };

  const pulseAnimation = {
    animate: {
      boxShadow: [
        '0 0 10px #b026ff, 0 0 20px #b026ff, 0 0 30px #b026ff',
        '0 0 15px #0ef, 0 0 25px #0ef, 0 0 35px #0ef',
        '0 0 10px #b026ff, 0 0 20px #b026ff, 0 0 30px #b026ff'
      ],
      transition: {
        duration: 2,
        repeat: Infinity
      }
    }
  };

  const pingAnimation = {
    animate: {
      opacity: [0.3, 0],
      scale: [1, 1.5],
      transition: {
        duration: 2,
        repeat: Infinity
      }
    }
  };

  const handleShare = async () => {
    if (!resultCardRef.current) return;

    try {
      const canvas = await html2canvas(resultCardRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      
      if (navigator.share) {
        // Mobile share API
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'auranic-result.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'My AURANIC Vibe Analysis',
          text: `My vibe: ${result.mysticTitle} | Aura: ${result.auraScore} | Rizz: ${result.rizzScore}`,
          files: [file]
        });
      } else {
        // Fallback for desktop
        const link = document.createElement('a');
        link.download = 'auranic-result.png';
        link.href = dataUrl;
        link.click();
        toast({
          title: "Image saved!",
          description: "Your AURANIC result has been saved to your device.",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Sharing failed",
        description: "Please try saving the image instead.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full max-w-md">
      <motion.div 
        ref={resultCardRef}
        className={`border-2 ${isSongAnalysis ? 'border-[#ff2d95]' : 'border-[#b026ff]'} rounded-lg p-8 bg-[#121212]/70 shadow-lg relative overflow-hidden`}
        variants={pulseAnimation}
        initial="initial"
        animate="animate"
      >
        {/* Type indicator */}
        <div className="absolute top-4 right-4">
          {isSongAnalysis ? (
            <FaMusic className="text-[#ff2d95] text-2xl" />
          ) : (
            <FaCamera className="text-[#b026ff] text-2xl" />
          )}
        </div>

        <h2 className="font-['Press_Start_2P'] text-lg text-center mb-2 text-white">
          {isSongAnalysis ? 'SONIC VIBRATION' : 'AURA ANALYSIS'}
        </h2>
        <p className="text-center font-['Orbitron'] text-sm text-[#0ef] mb-3">
          {isSongAnalysis ? "Music Energy Reading" : "Personal Aura Scan"}
        </p>
        
        {/* Song name if available */}
        {isSongAnalysis && result.songName && (
          <div className="text-center mb-4 py-1 px-2 bg-[#1a1a1a]/70 rounded-lg">
            <span className="text-xs text-gray-400 uppercase block">Track</span>
            <span className="text-sm font-bold text-white">"{result.songName}"</span>
          </div>
        )}
        
        {/* Mystic title */}
        <div className="text-center mb-6">
          <span className="text-xs text-gray-400 uppercase">Your mystic archetype</span>
          <motion.h3 
            className="font-['Press_Start_2P'] text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#b026ff] via-[#ff2d95] to-[#0ef]"
            variants={glitchAnimation}
            initial="initial"
            animate="animate"
          >
            {result.mysticTitle}
          </motion.h3>
        </div>
        
        {/* Score containers */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Aura score */}
          <motion.div 
            className="flex flex-col items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="w-28 h-28 rounded-full border-4 border-[#0ef] flex items-center justify-center relative">
              <span className="font-['Orbitron'] text-4xl text-[#0ef]">{result.auraScore}</span>
              <motion.div 
                className="absolute inset-0 rounded-full border border-[#0ef]/30"
                variants={pingAnimation}
                initial="initial"
                animate="animate"
              />
            </div>
            <span className="mt-2 text-sm uppercase font-['Orbitron'] text-[#0ef]">Aura Points</span>
          </motion.div>
          
          {/* Rizz score */}
          <motion.div 
            className="flex flex-col items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="w-28 h-28 rounded-full border-4 border-[#ff2d95] flex items-center justify-center relative">
              <span className="font-['Orbitron'] text-4xl text-[#ff2d95]">{result.rizzScore}</span>
              <motion.div 
                className="absolute inset-0 rounded-full border border-[#ff2d95]/30"
                variants={pingAnimation}
                initial="initial"
                animate="animate"
              />
            </div>
            <span className="mt-2 text-sm uppercase font-['Orbitron'] text-[#ff2d95]">Rizz Points</span>
          </motion.div>
        </div>
        
        {/* Analysis text */}
        <div className="mb-6 p-4 border border-[#0ef]/30 rounded-lg bg-[#050505]/50">
          <p className="font-['VT323'] text-lg text-center">{result.analysisText}</p>
        </div>
        
        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <motion.button 
            className="bg-[#b026ff] hover:bg-[#0ef] text-white font-['Orbitron'] py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
          >
            <FaShareAlt className="mr-2" />
            SHARE
          </motion.button>
          <motion.button 
            className="bg-[#ff2d95] hover:bg-[#0ef] text-white font-['Orbitron'] py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onScanAgain}
          >
            <FaRedoAlt className="mr-2" />
            TRY AGAIN
          </motion.button>
        </div>
      </motion.div>
      
      {/* Footer */}
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>"{isSongAnalysis ? 'Sonic waves decoded' : 'Aura revealed'}. The mystical vision vanishes soon."</p>
      </div>
    </div>
  );
}
