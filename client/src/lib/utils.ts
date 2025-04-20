import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Create a timed loading function that returns a promise
export const timedLoading = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Format a score with leading zeros
export const formatScore = (score: number, digits = 2) => {
  return score.toString().padStart(digits, '0');
};

// Get a random glitch background url 
export const getRandomGlitchBackground = () => {
  const glitchBgs = [
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506399558188-acca6f8cbf41?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531498860502-7c67cf02f657?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?auto=format&fit=crop&q=80'
  ];
  
  return glitchBgs[Math.floor(Math.random() * glitchBgs.length)];
};

// Get a random neon texture
export const getRandomNeonTexture = () => {
  const neonTextures = [
    'https://images.unsplash.com/photo-1607499699372-8cc530fa5529?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579546929662-711aa81148cf?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1675553621981-43309950362f?auto=format&fit=crop&q=80'
  ];
  
  return neonTextures[Math.floor(Math.random() * neonTextures.length)];
};

// Get a random CRT texture
export const getRandomCRTTexture = () => {
  const crtTextures = [
    'https://images.unsplash.com/photo-1610992245128-3fdb31695e9e?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525498128493-380d1990a112?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1596262897411-e7f825025ab5?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580584126903-c17d41830450?auto=format&fit=crop&q=80'
  ];
  
  return crtTextures[Math.floor(Math.random() * crtTextures.length)];
};
