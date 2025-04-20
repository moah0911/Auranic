import { motion } from 'framer-motion';

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
      repeatType: 'reverse',
      times: [0, 0.34, 0.36, 0.38, 0.64, 0.66, 0.68]
    }
  }
};

const flickerAnimation = {
  animate: {
    opacity: [1, 0.8, 0.1, 0.8, 1, 0.1, 1],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: 'mirror',
      times: [0, 0.4, 0.42, 0.43, 0.45, 0.46, 0.48]
    }
  }
};

export default function Header() {
  return (
    <header className="relative z-10 py-6 px-4 text-center mb-6">
      <motion.h1 
        className="font-['Press_Start_2P'] text-2xl md:text-3xl relative inline-block"
        initial="initial"
        animate="animate"
        variants={glitchAnimation}
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b026ff] via-[#0ef] to-[#ff2d95]">AURANIC</span>
      </motion.h1>
      
      <motion.p 
        className="font-['VT323'] text-lg mt-2 text-[#0ef]"
        initial="initial"
        animate="animate"
        variants={flickerAnimation}
      >
        Aura & Rizz Analyzer
      </motion.p>
      
      <div className="mt-2 text-[#ff2d95] text-sm">
        <span className="inline-block">Upload a screenshot. Get your digital vibe. Then it vanishes.</span>
      </div>
    </header>
  );
}
