import { motion } from 'framer-motion';

interface ScanningScreenProps {
  previewUrl: string;
}

export default function ScanningScreen({ previewUrl }: ScanningScreenProps) {
  return (
    <div className="w-full max-w-md">
      <div className="border-2 border-[#0ef] rounded-lg p-8 bg-[#121212]/70 shadow-lg relative overflow-hidden">
        <motion.div
          className="absolute inset-0 w-full h-2 bg-gradient-to-b from-transparent via-[#0ef]/50 to-transparent"
          animate={{
            y: ['-100%', '100%', '-100%'],
            opacity: [0, 0.3, 0]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.h2 
          className="font-['Orbitron'] text-xl text-center mb-6 text-white"
          animate={{
            opacity: [1, 0.8, 0.1, 0.8, 1, 0.1, 1]
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            times: [0, 0.4, 0.42, 0.43, 0.45, 0.46, 0.48]
          }}
        >
          SCANNING DIGITAL AURA
        </motion.h2>
        
        <div className="text-center mb-6">
          <div className="w-40 h-40 mx-auto border-2 border-dashed border-[#ff2d95] rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
            <img className="max-w-full max-h-full object-contain" src={previewUrl} alt="Uploaded screenshot" />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#b026ff]/30"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-[#0ef] mb-1">Analyzing digital energy...</p>
            <div className="w-full h-2 bg-[#050505] rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#b026ff] to-[#0ef]"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
            </div>
          </div>
          
          <div>
            <p className="text-sm text-[#ff2d95] mb-1">Detecting text patterns...</p>
            <div className="w-full h-2 bg-[#050505] rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#ff2d95] to-[#39ff14]"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, delay: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>
          
          <div>
            <p className="text-sm text-[#39ff14] mb-1">Calculating rizz quotient...</p>
            <div className="w-full h-2 bg-[#050505] rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#39ff14] to-[#b026ff]"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, delay: 1, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>
        
        <motion.div 
          className="text-center mt-6 text-xs text-gray-400"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p>No data storage. No history. Pure vibes only.</p>
        </motion.div>
      </div>
    </div>
  );
}
