import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

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
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="relative z-10 py-4 px-4 mb-4">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
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
        </div>
        
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center">
              <div className="mr-4 bg-black/40 border border-[#b026ff]/30 rounded-lg px-3 py-1 hidden md:flex items-center">
                <FaUserCircle className="text-[#0ef] mr-2" />
                <span className="text-white font-['Orbitron'] text-sm">{user.username}</span>
              </div>
              
              <Button 
                onClick={handleLogout}
                className="group relative bg-gradient-to-r from-[#b026ff] to-[#9925ff] text-white font-['Orbitron'] py-2 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-[#b026ff]/50 hover:shadow-md"
                disabled={logoutMutation.isPending}
              >
                <span className="flex items-center">
                  <FaSignOutAlt className="mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-2 text-center">
        <span className="inline-block text-[#ff2d95] text-sm">Upload a screenshot. Get your digital vibe. Then it vanishes.</span>
      </div>
    </header>
  );
}
