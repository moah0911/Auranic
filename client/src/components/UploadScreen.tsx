import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaCommentDots, FaMusic, FaMobileAlt, FaCreditCard } from 'react-icons/fa';

interface UploadScreenProps {
  onFileSelect: (file: File) => void;
}

export default function UploadScreen({ onFileSelect }: UploadScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <motion.div 
        className="w-full max-w-md border-2 border-[#b026ff] rounded-lg p-8 bg-[#121212]/70 shadow-lg relative overflow-hidden"
        animate={{ 
          boxShadow: ['0 0 10px #b026ff, 0 0 20px #b026ff, 0 0 30px #b026ff', 
                      '0 0 15px #0ef, 0 0 25px #0ef, 0 0 35px #0ef', 
                      '0 0 10px #b026ff, 0 0 20px #b026ff, 0 0 30px #b026ff'] 
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <h2 className="font-['Orbitron'] text-xl text-center mb-6 text-white">VIBE DETECTOR</h2>
        
        <div className="text-center mb-8">
          <motion.button
            className="cursor-pointer bg-gradient-to-r from-[#b026ff] to-[#ff2d95] hover:from-[#0ef] hover:to-[#b026ff] text-white font-['Orbitron'] py-3 px-6 rounded-lg inline-block transition-all duration-300 shadow-lg shadow-[#b026ff]/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={triggerFileInput}
          >
            <span className="flex items-center">
              <FaUpload className="mr-2" />
              UPLOAD SCREENSHOT
            </span>
          </motion.button>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*" 
            className="hidden"
          />
          <p className="text-sm mt-4 text-gray-400">We don't store your images. One-shot and gone.</p>
        </div>
        
        <div className="text-center">
          <p className="font-['VT323'] text-sm mb-2 text-[#ff2d95]">What we can read:</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <FaCommentDots className="text-[#0ef] mr-2" />
              <span>Chat screenshots</span>
            </div>
            <div className="flex items-center">
              <FaMusic className="text-[#0ef] mr-2" />
              <span>Playlists</span>
            </div>
            <div className="flex items-center">
              <FaMobileAlt className="text-[#0ef] mr-2" />
              <span>App interfaces</span>
            </div>
            <div className="flex items-center">
              <FaCreditCard className="text-[#0ef] mr-2" />
              <span>Digital moments</span>
            </div>
          </div>
        </div>
      </motion.div>
      
      <div className="mt-8 w-full max-w-md mx-auto">
        <h3 className="font-['Orbitron'] text-lg mb-3 text-[#0ef] text-center">How it works:</h3>
        <ol className="space-y-4">
          <li className="flex items-start">
            <div className="bg-gradient-to-r from-[#b026ff] to-[#ff2d95] rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0 shadow-lg shadow-[#b026ff]/30">
              <span className="text-white font-bold">1</span>
            </div>
            <span className="mt-1">Upload a screenshot (no data stored)</span>
          </li>
          <li className="flex items-start">
            <div className="bg-gradient-to-r from-[#b026ff] to-[#ff2d95] rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0 shadow-lg shadow-[#b026ff]/30">
              <span className="text-white font-bold">2</span>
            </div>
            <span className="mt-1">AI analyzes the <span className="text-[#ff2d95] font-bold">digital energy</span> of your image</span>
          </li>
          <li className="flex items-start">
            <div className="bg-gradient-to-r from-[#0ef] to-[#b026ff] rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0 shadow-lg shadow-[#0ef]/30">
              <span className="text-white font-bold">3</span>
            </div>
            <span className="mt-1">Get your <span className="text-[#0ef] font-bold">Aura</span> & <span className="text-[#ff2d95] font-bold">Rizz</span> scores</span>
          </li>
          <li className="flex items-start">
            <div className="bg-gradient-to-r from-[#0ef] to-[#b026ff] rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0 shadow-lg shadow-[#0ef]/30">
              <span className="text-white font-bold">4</span>
            </div>
            <span className="mt-1">Share your digital essence (or keep it private)</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
