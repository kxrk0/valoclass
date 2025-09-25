'use client'

import { useCallback, useRef } from 'react'

interface AudioSettings {
  masterVolume: number
  sfxVolume: number
  hitSounds: boolean
  missedSounds: boolean
  hitSoundType?: 'aimlabs' | 'kovaaks' | 'classic' | 'off'
}

export function useAudioEffects(settings: AudioSettings) {
  const audioContextRef = useRef<AudioContext | null>(null)
  const initialized = useRef(false)

  // Initialize Web Audio API
  const initAudio = useCallback(async () => {
    if (initialized.current || audioContextRef.current) return

    try {
      // Create audio context on first user interaction
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume()
      }
      
      initialized.current = true
      console.log('Audio initialized successfully')
    } catch (error) {
      console.warn('Audio initialization failed:', error)
    }
  }, [])

  // Create audio buffer for different sounds
  const createOscillator = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!audioContextRef.current || !initialized.current) return
    if (!settings.hitSounds && !settings.missedSounds) return

    try {
      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)
      
      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
      oscillator.type = type
      
      const volume = (settings.masterVolume / 100) * (settings.sfxVolume / 100) * 0.2
      gainNode.gain.setValueAtTime(volume, audioContextRef.current.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + duration)
      
      oscillator.start(audioContextRef.current.currentTime)
      oscillator.stop(audioContextRef.current.currentTime + duration)
      
      // Clean up after sound finishes
      oscillator.onended = () => {
        oscillator.disconnect()
        gainNode.disconnect()
      }
    } catch (error) {
      console.warn('Failed to create audio:', error)
    }
  }, [settings])

  // Hit sound - Multiple styles
  const playHitSound = useCallback(() => {
    if (!settings.hitSounds || settings.hitSoundType === 'off') return
    
    switch (settings.hitSoundType) {
      case 'aimlabs':
        // Real Aim Labs hit sound - sharp metallic "tink"
        createOscillator(2000, 0.05, 'square') // High frequency sharp attack
        setTimeout(() => createOscillator(1600, 0.03, 'triangle'), 10) // Quick decay
        setTimeout(() => createOscillator(3200, 0.02, 'sine'), 5) // Very high harmonic for that "ting" sound
        break
        
      case 'kovaaks':
        // Kovaak's style - deeper and more punchy
        createOscillator(800, 0.12, 'square') // Lower frequency
        setTimeout(() => createOscillator(1200, 0.08, 'sine'), 20) // Harmonic
        break
        
      case 'classic':
        // Classic FPS hit sound
        createOscillator(1000, 0.1, 'sine') // Simple clean tone
        break
        
      default:
        // Default to aimlabs
        createOscillator(2000, 0.05, 'square')
        setTimeout(() => createOscillator(1600, 0.03, 'triangle'), 10)
        setTimeout(() => createOscillator(3200, 0.02, 'sine'), 5)
    }
  }, [createOscillator, settings.hitSounds, settings.hitSoundType])

  // Miss sound - negative feedback
  const playMissSound = useCallback(() => {
    if (!settings.missedSounds) return
    
    // Low buzz sound
    createOscillator(220, 0.2, 'sawtooth')
  }, [createOscillator, settings.missedSounds])

  // Perfect hit sound - for streaks
  const playPerfectHitSound = useCallback(() => {
    if (!settings.hitSounds) return
    
    // Ascending notes for perfect hits
    createOscillator(440, 0.08, 'sine')
    setTimeout(() => createOscillator(660, 0.08, 'sine'), 80)
    setTimeout(() => createOscillator(880, 0.12, 'sine'), 160)
  }, [createOscillator, settings.hitSounds])

  // Game start sound
  const playGameStartSound = useCallback(() => {
    if (!settings.hitSounds) return
    
    // Rising tone
    createOscillator(330, 0.15, 'triangle')
    setTimeout(() => createOscillator(440, 0.15, 'triangle'), 100)
    setTimeout(() => createOscillator(550, 0.2, 'triangle'), 200)
  }, [createOscillator, settings.hitSounds])

  // Game end sound
  const playGameEndSound = useCallback(() => {
    if (!settings.hitSounds) return
    
    // Descending tone
    createOscillator(550, 0.2, 'triangle')
    setTimeout(() => createOscillator(440, 0.2, 'triangle'), 150)
    setTimeout(() => createOscillator(330, 0.3, 'triangle'), 300)
  }, [createOscillator, settings.hitSounds])

  return {
    initAudio,
    playHitSound,
    playMissSound,
    playPerfectHitSound,
    playGameStartSound,
    playGameEndSound
  }
}
