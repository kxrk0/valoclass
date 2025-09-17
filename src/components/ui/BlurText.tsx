'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState, useMemo } from 'react'

const buildKeyframes = (from: any, steps: any[]) => {
  const keys = new Set([...Object.keys(from), ...steps.flatMap(s => Object.keys(s))])

  const keyframes: any = {}
  keys.forEach(k => {
    keyframes[k] = [from[k], ...steps.map(s => s[k])]
  })
  return keyframes
}

interface BlurTextProps {
  text?: string
  delay?: number
  className?: string
  animateBy?: 'words' | 'chars'
  direction?: 'top' | 'bottom'
  threshold?: number
  rootMargin?: string
  animationFrom?: any
  animationTo?: any
  easing?: (t: number) => number
  onAnimationComplete?: () => void
  stepDuration?: number
}

const BlurText = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = (t: number) => t,
  onAnimationComplete,
  stepDuration = 0.35
}: BlurTextProps) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('')
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(ref.current!)
        }
      },
      { threshold, rootMargin }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  const defaultFrom = useMemo(
    () =>
      direction === 'top' 
        ? { filter: 'blur(10px)', opacity: 0, y: -50 } 
        : { filter: 'blur(10px)', opacity: 0, y: 50 },
    [direction]
  )

  const defaultTo = useMemo(
    () => [
      {
        filter: 'blur(5px)',
        opacity: 0.5,
        y: direction === 'top' ? 5 : -5
      },
      { filter: 'blur(0px)', opacity: 1, y: 0 }
    ],
    [direction]
  )

  const fromSnapshot = animationFrom ?? defaultFrom
  const toSnapshots = animationTo ?? defaultTo

  const stepCount = toSnapshots.length + 1
  const totalDuration = stepDuration * (stepCount - 1)
  const times = Array.from({ length: stepCount }, (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)))

  return (
    <p ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap' }}>
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots)

        const spanTransition = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000,
          ease: easing
        }

        // Special styling for "Level Up Your Game"
        const isLevelUp = segment === 'Level' || segment === 'Up'
        const isYourGame = segment === 'Your' || segment === 'Game'
        
        const getWordStyle = () => {
          if (text === 'Level Up Your Game') {
            if (isLevelUp) {
              return 'bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent'
            } else if (isYourGame) {
              return 'text-white'
            }
          }
          return ''
        }

        return (
          <motion.span
            className={`inline-block will-change-[transform,filter,opacity] ${getWordStyle()}`}
            key={index}
            initial={fromSnapshot}
            animate={inView ? animateKeyframes : fromSnapshot}
            transition={spanTransition}
            onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
          >
            {segment === ' ' ? '\u00A0' : segment}
            {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
            {/* Add line break after "Up" if it's the "Level Up Your Game" text */}
            {text === 'Level Up Your Game' && segment === 'Up' && <br />}
          </motion.span>
        )
      })}
    </p>
  )
}

export default BlurText
