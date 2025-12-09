import React, { useMemo } from 'react';

const Avatar = ({ seed, size = 100, className = '' }) => {
  const avatarUrl = useMemo(() => {
    // Using DiceBear Pixel Art style
    return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(seed)}`;
  }, [seed]);

  return (
    <div
      className={`pixel-box p-0 ${className}`}
      style={{
        width: size + 16, // +16 for border/padding adjustment if needed, but pixel-box handles it
        height: size + 16,
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
      }}
    >
      <img
        src={avatarUrl}
        alt={`Avatar ${seed}`}
        width={size}
        height={size}
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};

export default Avatar;
