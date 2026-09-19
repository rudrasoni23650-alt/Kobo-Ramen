import React, { useRef } from 'react';
import { motion, useScroll, useTransform, HTMLMotionProps, Variants } from 'motion/react';

export type RevealVariant =
  | 'fade-up'
  | 'fade-down'
  | 'fade-in'
  | 'fade-scale'
  | 'slide-left'
  | 'slide-right'
  | 'blur-up';

interface ScrollRevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  distance?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
}

const revealVariants: Record<RevealVariant, (distance: number) => Variants> = {
  'fade-up': (distance) => ({
    hidden: { opacity: 0, y: distance },
    visible: { opacity: 1, y: 0 },
  }),
  'fade-down': (distance) => ({
    hidden: { opacity: 0, y: -distance },
    visible: { opacity: 1, y: 0 },
  }),
  'fade-in': () => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }),
  'fade-scale': (distance) => ({
    hidden: { opacity: 0, scale: 0.94, y: distance * 0.5 },
    visible: { opacity: 1, scale: 1, y: 0 },
  }),
  'slide-left': (distance) => ({
    hidden: { opacity: 0, x: -distance },
    visible: { opacity: 1, x: 0 },
  }),
  'slide-right': (distance) => ({
    hidden: { opacity: 0, x: distance },
    visible: { opacity: 1, x: 0 },
  }),
  'blur-up': (distance) => ({
    hidden: { opacity: 0, y: distance, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
  }),
};

/**
 * Super-smooth gradual scroll reveal component using modern motion/react
 */
export function ScrollReveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 0.85,
  distance = 32,
  threshold = 0.15,
  once = true,
  className = '',
  ...props
}: ScrollRevealProps) {
  const getVariants = revealVariants[variant](distance);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold, margin: '-40px' }}
      variants={getVariants}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Custom luxury exponential ease-out
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Container component that staggers its children gradually on scroll
 */
interface ScrollStaggerProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  staggerDelay?: number;
  initialDelay?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
}

export function ScrollStagger({
  children,
  staggerDelay = 0.1,
  initialDelay = 0.05,
  threshold = 0.1,
  once = true,
  className = '',
  ...props
}: ScrollStaggerProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold, margin: '-40px' }}
      variants={containerVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Child item inside ScrollStagger
 */
export function ScrollStaggerItem({
  children,
  className = '',
  distance = 28,
  duration = 0.75,
  ...props
}: HTMLMotionProps<'div'> & { distance?: number; duration?: number }) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Subtle parallax translation on scroll for background visual elements
 */
export function ScrollParallax({
  children,
  offset = 40,
  className = '',
}: {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <div ref={ref} className={`relative overflow-visible ${className}`}>
      <motion.div style={{ y }} className="w-full h-full">
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Elegant expanding divider line on scroll entry
 */
export function ScrollDivider({
  className = '',
  color = '#c53030',
}: {
  className?: string;
  color?: string;
}) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={`origin-left h-[1px] ${className}`}
      style={{ backgroundColor: color }}
    />
  );
}
