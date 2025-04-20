export const glitchText = {
  initial: { 
    textShadow: '0 0 0 transparent' 
  },
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

export const flickerAnimation = {
  initial: { 
    opacity: 1 
  },
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

export const pulseNeonAnimation = {
  initial: { 
    boxShadow: '0 0 10px #b026ff, 0 0 20px #b026ff, 0 0 30px #b026ff' 
  },
  animate: {
    boxShadow: [
      '0 0 10px #b026ff, 0 0 20px #b026ff, 0 0 30px #b026ff',
      '0 0 15px #0ef, 0 0 25px #0ef, 0 0 35px #0ef',
      '0 0 10px #b026ff, 0 0 20px #b026ff, 0 0 30px #b026ff'
    ],
    transition: {
      duration: 2,
      repeat: Infinity
    }
  }
};

export const scannerAnimation = {
  initial: {
    y: '-100%',
    opacity: 0
  },
  animate: {
    y: ['0%', '100%', '0%'],
    opacity: [0, 0.3, 0],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const loadingProgressAnimation = {
  initial: {
    width: 0
  },
  animate: {
    width: '100%',
    transition: {
      duration: 3,
      ease: "easeInOut"
    }
  }
};

export const pingAnimation = {
  initial: {
    opacity: 0.3,
    scale: 1
  },
  animate: {
    opacity: [0.3, 0],
    scale: [1, 1.5],
    transition: {
      duration: 2,
      repeat: Infinity
    }
  }
};
