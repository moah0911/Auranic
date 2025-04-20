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
      }
    }
  };

  const scoreCircleVariants = {
    initial: { 
      scale: 0,
      opacity: 0,
      rotate: -90
    },
    animate: { 
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: { 
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: 0.3
      } 
    }
  };

  const scanlineAnimation = {
    animate: {
      y: ["0%", "100%"],
      opacity: [0.1, 0.2, 0.1],
      transition: {
        y: {
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        },
        opacity: {
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }
      }
    }
  };

  const pulseAnimation = {
    animate: {
      boxShadow: [
        "0 0 10px 2px rgba(0, 238, 255, 0.3), 0 0 20px 8px rgba(176, 38, 255, 0.2)",
        "0 0 15px 4px rgba(0, 238, 255, 0.4), 0 0 30px 12px rgba(176, 38, 255, 0.3)",
        "0 0 10px 2px rgba(0, 238, 255, 0.3), 0 0 20px 8px rgba(176, 38, 255, 0.2)",
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Function to share the result card as an image
  const handleShare = async () => {
    if (resultCardRef.current) {
      try {
        const canvas = await html2canvas(resultCardRef.current, {
          backgroundColor: '#121212',
          scale: 2, // Higher resolution
          logging: false,
        });
        
        const image = canvas.toDataURL('image/png');
        
        try {
          if (navigator.share) {
            await navigator.share({
              title: `My ${isSongAnalysis ? 'Song' : 'Aura'} Analysis`,
              text: `Check out my ${isSongAnalysis ? 'song' : 'aura'} analysis from AURANIC!`,
              files: [new File([dataURItoBlob(image)], 'auranic-analysis.png', { type: 'image/png' })]
            });
            return;
          }
        } catch (shareError) {
          console.error('Share API error:', shareError);
        }
        
        // Fallback to copying image to clipboard
        try {
          canvas.toBlob(async (blob) => {
            if (blob) {
              const clipboardItem = new ClipboardItem({ 'image/png': blob });
              await navigator.clipboard.write([clipboardItem]);
              toast({
                title: "Vibe captured!",
                description: "Result card copied to clipboard. Share your energy!",
              });
            }
          });
        } catch (clipError) {
          console.error('Clipboard error:', clipError);
          
          // Final fallback - open in new tab
          const tab = window.open();
          tab?.document.write(`<img src="${image}" alt="Analysis result" />`);
        }
      } catch (error) {
        console.error('Error creating shareable image:', error);
        toast({
          title: "Sharing failed",
          description: "Could not create shareable image",
          variant: "destructive"
        });
      }
    }
  };

  // Helper function to convert data URI to Blob
  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Result Card that will be captured for sharing */}
      <motion.div 
        ref={resultCardRef}
        className="relative w-full max-w-md rounded-xl border-4 border-[#b026ff] p-8 bg-gradient-to-b from-[#121212] to-[#0a0a0a] overflow-hidden shadow-2xl"
        initial="initial"
        animate="animate"
        variants={pulseAnimation}
      >
        {/* CRT scanline effect */}
        <motion.div 
          className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-[#0ef]/5 to-transparent pointer-events-none"
          variants={scanlineAnimation}
          animate="animate"
        />
        
        {/* Glowing corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#0ef] rounded-tl-lg"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#0ef] rounded-tr-lg"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#ff2d95] rounded-bl-lg"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#ff2d95] rounded-br-lg"></div>

        {/* Type indicator & logo */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="font-['Press_Start_2P'] text-xs text-[#0ef] mr-2">AURANIC</span>
            <div className="w-2 h-2 rounded-full bg-[#ff2d95] animate-pulse"></div>
          </div>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-[#b026ff] to-[#ff2d95]">
            {isSongAnalysis ? (
              <FaMusic className="text-white text-sm" />
            ) : (
              <FaCamera className="text-white text-sm" />
            )}
          </div>
        </div>

        <div className="mb-5">
          <h2 className="font-['Press_Start_2P'] text-xl text-center mb-1 text-white">
            {isSongAnalysis ? 'SONIC VIBRATION' : 'AURA ANALYSIS'}
          </h2>
          <p className="text-center font-['Orbitron'] text-sm text-[#0ef] mb-3">
            {isSongAnalysis ? "Music Energy Reading" : "Personal Aura Scan"}
          </p>
        </div>
        
        {/* Song name if available */}
        {isSongAnalysis && result.songName && (
          <div className="text-center mb-5 py-2 px-4 bg-black/50 rounded-lg border border-[#b026ff]/30 backdrop-blur-sm">
            <span className="text-xs text-gray-400 uppercase block">TRACK</span>
            <span className="text-sm font-bold text-white">"{result.songName}"</span>
          </div>
        )}
        
        {/* Rainbow gradient divider */}
        <div className="h-[3px] w-full bg-gradient-to-r from-[#0ef] via-[#b026ff] to-[#ff2d95] rounded-full mb-6"></div>
        
        {/* Mystic title */}
        <div className="text-center mb-7">
          <span className="text-xs text-gray-400 uppercase">YOUR MYSTIC ARCHETYPE</span>
          <motion.h3 
            className="font-['VT323'] text-3xl md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-[#0ef] via-[#b026ff] to-[#ff2d95]"
            variants={glitchAnimation}
          >
            {result.mysticTitle}
          </motion.h3>
        </div>
        
        {/* Gradient color bar */}
        <div className="w-full h-2 bg-gradient-to-r from-[#9925ff] via-[#ff2d95] to-[#0ef] rounded-full mb-6"></div>
        
        {/* Score circles */}
        <div className="grid grid-cols-2 gap-8 mb-7">
          {/* Aura score */}
          <motion.div 
            className="flex flex-col items-center"
            variants={scoreCircleVariants}
          >
            <div className="w-24 h-24 rounded-full border-[4px] border-[#0ef] flex items-center justify-center mb-2 relative bg-black/60 shadow-lg shadow-[#0ef]/20">
              <span className="font-['Press_Start_2P'] text-2xl text-[#0ef]">{result.auraScore}</span>
            </div>
            <span className="uppercase text-xs tracking-widest text-[#0ef] font-bold">AURA POINTS</span>
          </motion.div>
          
          {/* Rizz score */}
          <motion.div 
            className="flex flex-col items-center"
            variants={scoreCircleVariants}
          >
            <div className="w-24 h-24 rounded-full border-[4px] border-[#ff2d95] flex items-center justify-center mb-2 bg-black/60 shadow-lg shadow-[#ff2d95]/20">
              <span className="font-['Press_Start_2P'] text-2xl text-[#ff2d95]">{result.rizzScore}</span>
            </div>
            <span className="uppercase text-xs tracking-widest text-[#ff2d95] font-bold">RIZZ POINTS</span>
          </motion.div>
        </div>
        
        {/* Analysis text */}
        <div className="mb-8 p-4 border border-[#b026ff]/30 rounded-lg bg-black/50 backdrop-blur-sm">
          <p className="font-['VT323'] text-xl text-center leading-relaxed">{result.analysisText}</p>
        </div>
        
        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <motion.button 
            className="group relative bg-gradient-to-r from-[#b026ff] to-[#9925ff] text-white font-['Orbitron'] py-3 px-4 rounded-lg shadow-lg shadow-[#b026ff]/30 overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700 ease-in-out"></span>
            <span className="relative flex items-center justify-center">
              <FaShareAlt className="mr-2" />
              SHARE
            </span>
          </motion.button>
          <motion.button 
            className="group relative bg-gradient-to-r from-[#ff2d95] to-[#ff4898] text-white font-['Orbitron'] py-3 px-4 rounded-lg shadow-lg shadow-[#ff2d95]/30 overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onScanAgain}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700 ease-in-out"></span>
            <span className="relative flex items-center justify-center">
              <FaRedoAlt className="mr-2" />
              TRY AGAIN
            </span>
          </motion.button>
        </div>
      </motion.div>
      
      {/* Footer message */}
      <div className="mt-6 text-center">
        <p className="text-sm text-[#0ef]/70 font-['VT323']">
          "{isSongAnalysis ? 'Sonic waves decoded' : 'Aura revealed'}. The digital essence captured."
        </p>
      </div>
    </div>
  );
}