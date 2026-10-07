import React, { ReactNode } from 'react';
import { motion, Variants, TargetAndTransition } from 'motion/react';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  threshold?: number;
  once?: boolean;
  style?: React.CSSProperties;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 0.75,
  distance = 36,
  threshold = 0.15,
  once = true,
  style,
}) => {
  const getInitial = (): TargetAndTransition => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance };
      case 'down':
        return { opacity: 0, y: -distance };
      case 'left':
        return { opacity: 0, x: distance };
      case 'right':
        return { opacity: 0, x: -distance };
      case 'scale':
        return { opacity: 0, scale: 0.94, y: distance * 0.5 };
      case 'fade':
      default:
        return { opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: {
          duration,
          delay,
          ease: [0.22, 1, 0.36, 1], // Smooth editorial cubic-bezier
        },
      }}
      viewport={{
        once,
        amount: threshold,
        margin: '-50px',
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

interface ScrollStaggerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
  once?: boolean;
  style?: React.CSSProperties;
}

export const ScrollStagger: React.FC<ScrollStaggerProps> = ({
  children,
  className = '',
  staggerDelay = 0.12,
  delayChildren = 0.05,
  once = true,
  style,
}) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.1, margin: '-40px' }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

interface ScrollStaggerItemProps {
  children: ReactNode;
  className?: string;
  direction?: RevealDirection;
  distance?: number;
  duration?: number;
  style?: React.CSSProperties;
}

export const ScrollStaggerItem: React.FC<ScrollStaggerItemProps> = ({
  children,
  className = '',
  direction = 'up',
  distance = 30,
  duration = 0.7,
  style,
}) => {
  const getItemVariants = (): Variants => {
    let initialX = 0;
    let initialY = 0;
    let initialScale = 1;

    if (direction === 'up') initialY = distance;
    else if (direction === 'down') initialY = -distance;
    else if (direction === 'left') initialX = distance;
    else if (direction === 'right') initialX = -distance;
    else if (direction === 'scale') {
      initialScale = 0.95;
      initialY = distance * 0.4;
    }

    return {
      hidden: {
        opacity: 0,
        x: initialX,
        y: initialY,
        scale: initialScale,
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: {
          duration,
          ease: [0.22, 1, 0.36, 1],
        },
      },
    };
  };

  return (
    <motion.div variants={getItemVariants()} className={className} style={style}>
      {children}
    </motion.div>
  );
};
