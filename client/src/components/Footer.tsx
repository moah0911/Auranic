import { FaChartLine, FaHeartbeat, FaRegLightbulb } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="relative z-10 py-6 text-center border-t border-[#0ef]/20 backdrop-blur-sm bg-black/30">
      <div className="max-w-screen-lg mx-auto px-4">
        <div className="mb-4 flex justify-center space-x-6">
          <div className="flex flex-col items-center">
            <FaHeartbeat className="text-[#ff2d95] mb-1" size={20} />
            <span className="text-xs text-gray-400">Aura Detection</span>
          </div>
          <div className="flex flex-col items-center">
            <FaChartLine className="text-[#b026ff] mb-1" size={20} />
            <span className="text-xs text-gray-400">Rizz Analytics</span>
          </div>
          <div className="flex flex-col items-center">
            <FaRegLightbulb className="text-[#0ef] mb-1" size={20} />
            <span className="text-xs text-gray-400">Vibe Reading</span>
          </div>
        </div>
        
        <div className="font-['Orbitron'] text-xs">
          <p className="bg-clip-text text-transparent bg-gradient-to-r from-[#0ef] to-[#ff2d95]">
            AURANIC &copy; {new Date().getFullYear()}
          </p>
          <p className="text-gray-500 mt-1 text-[10px]">No data stored. One-shot and gone.</p>
        </div>
      </div>
    </footer>
  );
}
