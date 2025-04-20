// Glitchy digital backgrounds
export const glitchBackgrounds = [
  {
    id: 'gb1',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80',
    alt: 'Abstract digital glitch background with blue and purple tones'
  },
  {
    id: 'gb2',
    url: 'https://images.unsplash.com/photo-1506399558188-acca6f8cbf41?auto=format&fit=crop&q=80',
    alt: 'Neon grid lines on dark background'
  },
  {
    id: 'gb3',
    url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80',
    alt: 'Digital circuit board with glowing elements'
  },
  {
    id: 'gb4',
    url: 'https://images.unsplash.com/photo-1531498860502-7c67cf02f657?auto=format&fit=crop&q=80',
    alt: 'Abstract digital network with purple light streaks'
  },
  {
    id: 'gb5',
    url: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&q=80',
    alt: 'Cyberpunk cityscape with neon lights'
  },
  {
    id: 'gb6',
    url: 'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?auto=format&fit=crop&q=80',
    alt: 'Distorted digital data visualization'
  }
];

// Neon aesthetic elements
export const neonTextures = [
  {
    id: 'ne1',
    url: 'https://images.unsplash.com/photo-1607499699372-8cc530fa5529?auto=format&fit=crop&q=80',
    alt: 'Purple and blue neon glow on dark background'
  },
  {
    id: 'ne2',
    url: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?auto=format&fit=crop&q=80',
    alt: 'Neon wave lines on gradient background'
  },
  {
    id: 'ne3',
    url: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&q=80',
    alt: 'Bright neon pink and blue light streaks'
  },
  {
    id: 'ne4',
    url: 'https://images.unsplash.com/photo-1675553621981-43309950362f?auto=format&fit=crop&q=80',
    alt: 'Multicolored neon lights in darkness'
  }
];

// CRT screen textures
export const crtTextures = [
  {
    id: 'ct1',
    url: 'https://images.unsplash.com/photo-1610992245128-3fdb31695e9e?auto=format&fit=crop&q=80',
    alt: 'Close-up of CRT screen scan lines'
  },
  {
    id: 'ct2',
    url: 'https://images.unsplash.com/photo-1525498128493-380d1990a112?auto=format&fit=crop&q=80',
    alt: 'Vintage television CRT texture with static'
  },
  {
    id: 'ct3',
    url: 'https://images.unsplash.com/photo-1596262897411-e7f825025ab5?auto=format&fit=crop&q=80',
    alt: 'Green monochrome CRT terminal display'
  },
  {
    id: 'ct4',
    url: 'https://images.unsplash.com/photo-1580584126903-c17d41830450?auto=format&fit=crop&q=80',
    alt: 'Distorted CRT monitor with digital artifacts'
  }
];

// Get a random background from any collection
export function getRandomBackground(collection: 
  typeof glitchBackgrounds | typeof neonTextures | typeof crtTextures) {
  return collection[Math.floor(Math.random() * collection.length)];
}
