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
  // Junction.org inspired colors - minimal nordic design
  const primaryColor = variant === "light" ? "#ffffff" : "#2A3F55";
  const secondaryColor = variant === "light" ? "#f0f4f9" : "#7E98B4";
  const accentColor = variant === "light" ? "#ffffff" : "#d13239"; // Portuguese flag accent
  
  const sizeMap = {
    sm: { width: 110, height: 40 },
    md: { width: 165, height: 60 },
    lg: { width: 220, height: 80 }
  };
  
  const { width, height } = sizeMap[size];
  
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 220 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g>
        {/* I - Minimalist rectangular form */}
        <rect 
          x="10" 
          y="15" 
          width="14" 
          height="50" 
          rx="0"
          fill={primaryColor} 
        />
        
        {/* A - Clean geometric shape */}
        <path 
          d="M40 65L60 15L80 65H40Z" 
          fill={primaryColor} 
          strokeLinejoin="round"
        />
        <rect 
          x="50" 
          y="45" 
          width="20" 
          height="7" 
          fill="#ffffff" 
        />
        
        {/* O - With subtle Portuguese reference */}
        <g>
          <circle 
            cx="110" 
            cy="40" 
            r="25" 
            fill={primaryColor} 
          />
          <circle 
            cx="110" 
            cy="40" 
            r="17" 
            fill="#ffffff" 
          />
          
          {/* Simplified shield contours - just the top arc */}
          <path 
            d="M95 32 Q110 25, 125 32 V42 H95 V32Z" 
            fill={accentColor} 
          />
          
          {/* Minimalist dots representing the castles/coat of arms */}
          <circle cx="103" cy="38" r="2" fill="#ffffff" />
          <circle cx="110" cy="38" r="2" fill="#ffffff" />
          <circle cx="117" cy="38" r="2" fill="#ffffff" />
        </g>
      </g>
      
      {/* Clean typography - with proper letter spacing */}
      <g>
        <text 
          x="10" 
          y="75" 
          fontFamily="sans-serif" 
          fontSize="11" 
          fontWeight="400"
          fill={secondaryColor}
          letterSpacing="1.2"
          style={{ textTransform: 'uppercase' }}
        >
          Olimpíadas Portugal
        </text>
      </g>
    </svg>
  );
}