
'use client';

import React from 'react';

interface InteractiveLinkProps {
  href: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  hoverBackgroundColor: string;
  hoverTextColor: string;
  hoverBorderColor: string;
  initialBackgroundColor: string;
  initialTextColor: string;
  initialBorderColor: string;
}

const InteractiveLink: React.FC<InteractiveLinkProps> = ({
  href,
  className,
  style,
  children,
  hoverBackgroundColor,
  hoverTextColor,
  hoverBorderColor,
  initialBackgroundColor,
  initialTextColor,
  initialBorderColor
}) => {
  return (
    <a
      href={href}
      className={className}
      style={style}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = hoverBackgroundColor;
        e.currentTarget.style.color = hoverTextColor;
        e.currentTarget.style.borderColor = hoverBorderColor;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = initialBackgroundColor;
        e.currentTarget.style.color = initialTextColor;
        e.currentTarget.style.borderColor = initialBorderColor;
      }}
    >
      {children}
    </a>
  );
};

export default InteractiveLink;

