import React, { DetailedHTMLProps, HTMLAttributes, PropsWithoutRef } from 'react';

type HTMLDivWithoutRef = PropsWithoutRef<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>;

interface LimiterProps extends HTMLDivWithoutRef {
  maxWidth?: number | string;
  unit?: string;
  center?: boolean;
  children: React.ReactNode;
}

const Limiter = ({ maxWidth = 800, unit = 'px', center = true, children, style = {}, ...props }: LimiterProps) => {
  return (
    <div
      style={{
        maxWidth: `${maxWidth}${unit}`,
        width: '100%',
        ...(center ? { margin: '0 auto' } : {}),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Limiter;
