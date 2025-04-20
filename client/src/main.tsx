import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add CSS variables for glitch effects
const styleEl = document.createElement('style');
styleEl.textContent = `
  :root {
    --neon-purple: #b026ff;
    --electric-blue: #0ef;
    --neon-pink: #ff2d95;
    --glitch-green: #39ff14;
    --glitch-red: #ff3131;
    --dark-bg: #050505;
    --dark-secondary: #121212;
  }

  @font-face {
    font-family: 'VT323';
    font-style: normal;
    font-weight: 400;
    src: url(https://fonts.gstatic.com/s/vt323/v17/pxiKyp0ihIEF2isfFJU.woff2) format('woff2');
  }

  @font-face {
    font-family: 'Press Start 2P';
    font-style: normal;
    font-weight: 400;
    src: url(https://fonts.gstatic.com/s/pressstart2p/v15/e3t4euO8T-267oIAQAu6jDQyK3nVivM.woff2) format('woff2');
  }

  @font-face {
    font-family: 'Orbitron';
    font-style: normal;
    font-weight: 400;
    src: url(https://fonts.gstatic.com/s/orbitron/v31/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyGy6xpmIyXw.woff2) format('woff2');
  }

  body::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.2),
      rgba(0, 0, 0, 0.2) 1px,
      transparent 1px,
      transparent 2px
    );
    pointer-events: none;
    z-index: 50;
  }

  body {
    background-color: var(--dark-bg) !important;
    font-family: 'VT323', monospace;
  }
`;
document.head.appendChild(styleEl);

createRoot(document.getElementById("root")!).render(<App />);
