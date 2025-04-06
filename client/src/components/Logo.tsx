import React from "react";

interface LogoProps {
  className?: string;
  variant?: "default" | "light";
  size?: "sm" | "md" | "lg";
}

export function Logo({ 
  className = "", 
  variant = "default",
  size = "md"
}: LogoProps) {
  const textColor = variant === "light" ? "#ffffff" : "#6989b0";
  const accentColor = variant === "light" ? "#f0f4f9" : "#3a5a85";
  
  const sizeMap = {
    sm: { width: 120, height: 40 },
    md: { width: 180, height: 60 },
    lg: { width: 240, height: 80 }
  };
  
  const { width, height } = sizeMap[size];
  
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 180 60" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Brain + Circuit pattern */}
      <g>
        <path 
          d="M45 15C49.9706 15 54 19.0294 54 24C54 28.9706 49.9706 33 45 33C40.0294 33 36 28.9706 36 24C36 19.0294 40.0294 15 45 15Z" 
          fill={accentColor} 
          fillOpacity="0.1"
        />
        <path 
          d="M45 18C48.3137 18 51 20.6863 51 24C51 27.3137 48.3137 30 45 30C41.6863 30 39 27.3137 39 24C39 20.6863 41.6863 18 45 18Z" 
          stroke={textColor} 
          strokeWidth="1.5" 
          strokeLinecap="round"
        />
        
        {/* Circuit connections */}
        <path d="M45 18V12" stroke={textColor} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M51 24H57" stroke={textColor} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M45 30V36" stroke={textColor} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M39 24H33" stroke={textColor} strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Neural connections */}
        <circle cx="45" cy="12" r="2" fill={accentColor} />
        <circle cx="57" cy="24" r="2" fill={accentColor} />
        <circle cx="45" cy="36" r="2" fill={accentColor} />
        <circle cx="33" cy="24" r="2" fill={accentColor} />
      </g>
      
      {/* Text: OLIPMÍADAS IA */}
      <text 
        x="66" 
        y="24" 
        fontFamily="sans-serif" 
        fontSize="14" 
        fontWeight="300"
        fill={textColor}
        letterSpacing="1"
      >
        OLIMPÍADAS
      </text>
      <text 
        x="66" 
        y="42" 
        fontFamily="sans-serif" 
        fontSize="22" 
        fontWeight="600"
        fill={textColor}
        letterSpacing="2"
      >
        IA
      </text>
      
      {/* Subtle line under text */}
      <path 
        d="M66 45H100" 
        stroke={accentColor}
        strokeWidth="1" 
        strokeLinecap="round" 
      />
      
      {/* Small text: PORTUGAL */}
      <text 
        x="66" 
        y="54" 
        fontFamily="sans-serif" 
        fontSize="9" 
        fontWeight="400"
        fill={textColor}
        letterSpacing="1.5"
      >
        PORTUGAL
      </text>
    </svg>
  );
}