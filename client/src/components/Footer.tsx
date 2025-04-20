import { FaInstagram, FaTiktok, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="relative z-10 py-4 text-center text-xs text-gray-500">
      <p>AURANIC &copy; {new Date().getFullYear()} - No data, only vibes</p>
      <div className="mt-2 flex justify-center space-x-4">
        <a href="#" className="text-[#0ef] hover:text-[#ff2d95] transition-colors">
          <FaInstagram size={18} />
        </a>
        <a href="#" className="text-[#0ef] hover:text-[#ff2d95] transition-colors">
          <FaTiktok size={18} />
        </a>
        <a href="#" className="text-[#0ef] hover:text-[#ff2d95] transition-colors">
          <FaTwitter size={18} />
        </a>
      </div>
    </footer>
  );
}
