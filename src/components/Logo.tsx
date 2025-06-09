
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
        <div className="w-4 h-4 bg-background rounded-sm opacity-90"></div>
      </div>
      <span className="text-xl font-bold tracking-tight text-foreground">GLIMPSE</span>
    </div>
  );
};

export default Logo;
