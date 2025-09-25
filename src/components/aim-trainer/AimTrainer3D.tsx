'use client'

import { Suspense, useRef, useState, useCallback, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sphere, Box, Environment, PointerLockControls } from '@react-three/drei'
import * as THREE from 'three'
import { useAudioEffects } from '@/hooks/useAudioEffects'

// Game state interface
interface GameState {
  score: number
  accuracy: number
  targetsHit: number
  targetsMissed: number
  timeLeft: number
  gameActive: boolean
  targets: Target[]
  consecutiveHits: number
  lastHitTime: number
  tracking?: TrackingState // For tracking mode
}

// Target interface
interface Target {
  id: string
  position: [number, number, number]
  scale: number
  color: string
  isHit: boolean
  lifetime: number
  velocity?: [number, number, number] // For tracking mode
  direction?: number // For tracking mode
  timeAlive?: number // For tracking mode
  appearTime?: number // For flicking mode
  disappearTime?: number // For flicking mode
}

// Tracking mode specific state
interface TrackingState {
  crosshairPosition: [number, number]
  targetPosition: [number, number]
  trackingScore: number
  trackingAccuracy: number
  trackingTime: number
  isTracking: boolean
}

// Simple FPS Camera Controls
function FPSControls({ gameMode }: { gameMode: string }) {
  const { camera, gl } = useThree()
  const [isLocked, setIsLocked] = useState(false)
  
  useEffect(() => {
    if (!gl.domElement) return

    const handleClick = (event: MouseEvent) => {
      event.preventDefault()
      
      try {
        if (!isLocked) {
          // Check if pointer lock is available
          if (gl.domElement && gl.domElement.requestPointerLock) {
            gl.domElement.requestPointerLock().catch((error) => {
              console.warn('Pointer lock request failed:', error)
            })
          }
        } else {
          // Shoot immediately when locked
          if (gameMode !== 'tracking' && (window as any).shootFunction) {
            (window as any).shootFunction()
          }
        }
      } catch (error) {
        console.warn('Click handler error:', error)
      }
    }

    const handlePointerLockChange = () => {
      const locked = document.pointerLockElement === gl.domElement
      setIsLocked(locked)
      document.body.style.cursor = locked ? 'none' : 'auto'
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!isLocked || !document.pointerLockElement) return

      try {
        // Get current sensitivity from global settings or use default
        const currentSettings = (window as any).currentAimGameSettings || { sensitivity: 0.4 }
        const sensitivity = 0.002 * currentSettings.sensitivity // Apply Valorant-style sensitivity
        const deltaX = event.movementX * sensitivity
        const deltaY = event.movementY * sensitivity

        // Rotate camera
        camera.rotation.y -= deltaX
        camera.rotation.x -= deltaY
        
        // Clamp vertical rotation
        camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, camera.rotation.x))
        
        // For tracking mode, crosshair is always centered, but we still need to trigger updates
        if (gameMode === 'tracking' && (window as any).updateTrackingPosition) {
          // Crosshair is always centered (0.5, 0.5) but we need to trigger the tracking check
          (window as any).updateTrackingPosition(0.5, 0.5)
        }
      } catch (error) {
        console.warn('Mouse move error:', error)
      }
    }

    gl.domElement.addEventListener('click', handleClick)
    document.addEventListener('pointerlockchange', handlePointerLockChange)
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      gl.domElement.removeEventListener('click', handleClick)
      document.removeEventListener('pointerlockchange', handlePointerLockChange)
      document.removeEventListener('mousemove', handleMouseMove)
      document.body.style.cursor = 'auto'
    }
  }, [camera, gl.domElement, isLocked])

  return null
}


// Simple Raycast Component
function RaycastShooter({ 
  onTargetHit, 
  onShoot,
  targets 
}: { 
  onTargetHit: (targetId: string) => void
  onShoot: () => void
  targets: Target[]
}) {
  const { camera, scene } = useThree()
  const raycaster = useRef(new THREE.Raycaster())

  const shoot = useCallback(() => {
    // Register the shot
    onShoot()
    
    try {
      // Cast ray from camera center forward
      const direction = new THREE.Vector3(0, 0, -1)
      direction.applyQuaternion(camera.quaternion)
      
      raycaster.current.set(camera.position, direction)
      
      // Find intersections with targets
      const intersects = raycaster.current.intersectObjects(scene.children, true)
      
      for (const intersect of intersects) {
        const object = intersect.object
        
        if (object.userData?.isTarget && object.userData?.targetId) {
          console.log('Target hit!') // Only log successful hits
          onTargetHit(object.userData.targetId)
          break // Only hit first target
        }
      }
    } catch (error) {
      console.error('Shooting error:', error)
    }
  }, [camera, scene, onTargetHit, onShoot])

  // Expose shoot function globally for FPSControls
  useEffect(() => {
    (window as any).shootFunction = shoot
  }, [shoot])

  return null
}

// Target Movement System for Tracking Mode and Flicking Auto-hide
function TargetMovement({ 
  targets, 
  gameMode, 
  onTargetUpdate,
  onTargetExpired
}: { 
  targets: Target[]
  gameMode: string
  onTargetUpdate: (targets: Target[]) => void 
  onTargetExpired?: () => void
}) {
  useFrame((state, delta) => {
    if (targets.length === 0) return

    // Handle Tracking Mode
    if (gameMode === 'tracking') {
      const updatedTargets = targets.map(target => {
        if (!target.velocity || target.timeAlive === undefined) return target

        const newTimeAlive = (target.timeAlive || 0) + delta
        const newPosition = [...target.position] as [number, number, number]
        const newVelocity = [...target.velocity] as [number, number, number]
        let newDirection = target.direction || 1

        // Update position based on velocity
        newPosition[0] += newVelocity[0] * delta * 2
        newPosition[1] += newVelocity[1] * delta * 2

        // Bounce off boundaries
        if (newPosition[0] > 4 || newPosition[0] < -4) {
          newVelocity[0] *= -1
          newDirection *= -1
        }
        if (newPosition[1] > 2.5 || newPosition[1] < 0) {
          newVelocity[1] *= -1
        }

        // Change direction randomly every 2-3 seconds
        if (newTimeAlive > 2 + Math.random()) {
          newVelocity[0] = (Math.random() - 0.5) * 2
          newVelocity[1] = (Math.random() - 0.5) * 1
          return {
            ...target,
            position: newPosition,
            velocity: newVelocity,
            direction: newDirection,
            timeAlive: 0
          }
        }

        return {
          ...target,
          position: newPosition,
          velocity: newVelocity,
          direction: newDirection,
          timeAlive: newTimeAlive
        }
      })

      onTargetUpdate(updatedTargets)
      
      // Update tracking score continuously (60fps)
      if ((window as any).updateTrackingPosition) {
        (window as any).updateTrackingPosition(0.5, 0.5) // Crosshair is always center
      }
    }

    // Handle Flicking Mode - Auto disappear targets
    if (gameMode === 'flicking') {
      const currentTime = Date.now()
      const validTargets = targets.filter(target => {
        if (target.disappearTime && currentTime > target.disappearTime) {
          // Target expired, trigger miss
          if (onTargetExpired) onTargetExpired()
          return false
        }
        return true
      })

      // If target expired, generate new one
      if (validTargets.length === 0 && targets.length > 0) {
        // Target was removed, onTargetExpired already called
        return
      }

      if (validTargets.length !== targets.length) {
        onTargetUpdate(validTargets)
      }
    }
  })

  return null
}

// Main AimTrainer3D Component
interface AimTrainer3DProps {
  gameMode: string
  onGameUpdate: (gameState: GameState) => void
  settings: {
    sensitivity: number
    fov: number
    targetSize: number
    gameDuration: number
  }
}

export default function AimTrainer3D({ 
  gameMode, 
  onGameUpdate, 
  settings 
}: AimTrainer3DProps) {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    accuracy: 100,
    targetsHit: 0,
    targetsMissed: 0,
    timeLeft: settings.gameDuration,
    gameActive: false,
    targets: [],
    consecutiveHits: 0,
    lastHitTime: 0,
    tracking: gameMode === 'tracking' ? {
      crosshairPosition: [0, 0],
      targetPosition: [0, 0],
      trackingScore: 0,
      trackingAccuracy: 100,
      trackingTime: 0,
      isTracking: false
    } : undefined
  })

  // Audio effects based on settings
  const audioSettings = {
    masterVolume: settings.masterVolume * 100,
    sfxVolume: settings.hitSoundVolume * 100,
    hitSounds: settings.hitSoundType !== 'off',
    missedSounds: settings.hitSoundType !== 'off',
    hitSoundType: settings.hitSoundType
  }
  
  const { 
    playHitSound, 
    playMissSound, 
    playPerfectHitSound, 
    playGameStartSound, 
    playGameEndSound,
    initAudio 
  } = useAudioEffects(audioSettings)

  // Generate single target - AIM LABS STYLE
  const generateSingleTarget = useCallback(() => {
    // Get current settings to ensure latest values
    const currentSettings = (window as any).currentAimGameSettings || settings
    
    const baseTarget = {
      id: `target_${Date.now()}_${Math.random()}`,
      position: [
        (Math.random() - 0.5) * 6, // -3 to 3
        Math.random() * 1.5 + 0.5, // 0.5 to 2
        -(Math.random() * 3 + 8) // -8 to -11
      ] as [number, number, number],
      scale: 0.3, // Fixed size - removed targetSize setting
      color: currentSettings.targetColor || settings.targetColor, // Ensure target color always applies
      isHit: false,
      lifetime: 0
    }

    // Add tracking-specific properties
    if (gameMode === 'tracking') {
      return {
        ...baseTarget,
        velocity: [
          (Math.random() - 0.5) * 2, // X velocity: -1 to 1
          (Math.random() - 0.5) * 1, // Y velocity: -0.5 to 0.5
          0 // Z velocity: 0 (stay at same depth)
        ] as [number, number, number],
        direction: 1, // 1 or -1 for direction changes
        timeAlive: 0
      }
    }

    // Add flicking-specific properties  
    if (gameMode === 'flicking') {
      return {
        ...baseTarget,
        position: [
          (Math.random() - 0.5) * 8, // Wider spread for flicks: -4 to 4
          Math.random() * 2 + 0.5, // 0.5 to 2.5
          -(Math.random() * 4 + 7) // Varied depth: -7 to -11
        ] as [number, number, number],
        scale: 0.25, // Smaller targets for flicking precision
        color: '#ff6b35', // Orange color for flicking
        appearTime: Date.now(),
        disappearTime: Date.now() + 1500 + Math.random() * 1000 // 1.5-2.5 seconds visibility
      }
    }

    return baseTarget
  }, [gameMode, settings.targetSize, settings.targetColor])

  // Start game
  const startGame = useCallback(async () => {
    try {
      await initAudio()
      
      const newTargets = [generateSingleTarget()]
      console.log('Generated targets:', newTargets) // Debug log
      
      setGameState(prev => ({
        ...prev,
        gameActive: true,
        timeLeft: settings.gameDuration,
        score: 0,
        targetsHit: 0,
        targetsMissed: 0,
        accuracy: 100,
        targets: newTargets,
        consecutiveHits: 0,
        lastHitTime: 0
      }))
      
      // No start sound - quiet game start
    } catch (error) {
      console.error('Failed to start game:', error)
    }
  }, [settings.gameDuration, generateSingleTarget, initAudio])

  // Handle shooting (register misses only, no sound)
  const handleShoot = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      targetsMissed: prev.targetsMissed + 1,
      consecutiveHits: 0 // Reset consecutive hits on miss
    }))
    
    // No miss sound - only hit sounds allowed
  }, [])

  // Handle target hit - AIM LABS STYLE
  const handleTargetHit = useCallback((targetId: string) => {
    setGameState(prev => {
      const newTargetsHit = prev.targetsHit + 1
      const totalShots = newTargetsHit + prev.targetsMissed
      const newAccuracy = totalShots > 0 ? (newTargetsHit / totalShots) * 100 : 100
      const newConsecutiveHits = prev.consecutiveHits + 1
      const currentTime = Date.now()
      
      // Generate new single target immediately (except in tracking mode where we keep the same moving target)
      let newTargets = prev.targets
      if (gameMode !== 'tracking') {
        const newTarget = generateSingleTarget()
        newTargets = [newTarget]
      } else {
        // In tracking mode, keep the existing target but reset its position
        const existingTarget = prev.targets[0]
        if (existingTarget) {
          newTargets = [{
            ...existingTarget,
            position: [
              (Math.random() - 0.5) * 6,
              Math.random() * 1.5 + 0.5,
              -(Math.random() * 3 + 8)
            ] as [number, number, number],
            timeAlive: 0
          }]
        }
      }
      
      // Play hit sound
      playHitSound()

      const newState = {
        ...prev,
        score: prev.score + 100, // Standard Aim Labs score
        targetsHit: newTargetsHit,
        accuracy: newAccuracy,
        targets: newTargets,
        targetsMissed: prev.targetsMissed - 1, // Subtract the miss we added in handleShoot
        consecutiveHits: newConsecutiveHits,
        lastHitTime: currentTime
      }

      return newState
    })
  }, [generateSingleTarget, playHitSound, gameMode])

  // Update targets (for tracking movement)
  const updateTargets = useCallback((updatedTargets: Target[]) => {
    setGameState(prev => ({
      ...prev,
      targets: updatedTargets
    }))
  }, [])

  // Handle target expiration (for flicking mode)
  const handleTargetExpired = useCallback(() => {
    setGameState(prev => {
      // Count as a miss and generate new target
      const newTarget = generateSingleTarget()
      return {
        ...prev,
        targetsMissed: prev.targetsMissed + 1,
        targets: [newTarget]
      }
    })
  }, [generateSingleTarget])

  // Game timer - Works for all modes including tracking
  useEffect(() => {
    if (!gameState.gameActive) return

    const timer = setInterval(() => {
      setGameState(prev => {
        if (!prev.gameActive) return prev // Safety check
        
        if (prev.timeLeft <= 1) {
          playGameEndSound()
          const finalState = { ...prev, timeLeft: 0, gameActive: false }
          // Use setTimeout to avoid setState during render
          setTimeout(() => onGameUpdate(finalState), 0)
          return finalState
        }
        
        const newState = { ...prev, timeLeft: prev.timeLeft - 1 }
        
        // Update tracking time for tracking mode
        if (gameMode === 'tracking' && newState.tracking) {
          newState.tracking = {
            ...newState.tracking,
            trackingTime: newState.tracking.trackingTime + 1
          }
        }
        
        // Update parent component asynchronously
        setTimeout(() => onGameUpdate(newState), 0)
        return newState
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState.gameActive, onGameUpdate, playGameEndSound, gameMode])

  // Start the actual game timer
  const startGameTimer = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameActive: true,
      timeLeft: settings.gameDuration
    }))
  }, [settings.gameDuration])

  // Pause/Resume game
  const pauseGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameActive: false
    }))
  }, [])

  const resumeGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameActive: true
    }))
  }, [])

  // Fixed tracking system - Real-time scoring when crosshair is on target
  const updateTrackingPosition = useCallback((crosshairX: number, crosshairY: number) => {
    if (gameMode === 'tracking' && gameState.gameActive && gameState.targets[0]) {
      setGameState(prev => {
        if (!prev.tracking || !prev.targets[0]) return prev
        
        const target = prev.targets[0]
        
        // Convert 3D target position to screen space (improved calculation)
        // Camera is at [0,0,0] looking down negative Z
        // Target is at target.position = [x, y, z] where z is negative
        const targetWorldX = target.position[0]
        const targetWorldY = target.position[1]
        const targetWorldZ = target.position[2] // negative value
        
        // Project to screen space (simplified projection)
        const fov = 103 * (Math.PI / 180) // Convert to radians
        const aspect = window.innerWidth / window.innerHeight
        
        // Simple perspective projection
        const projectedX = targetWorldX / (-targetWorldZ * Math.tan(fov / 2))
        const projectedY = targetWorldY / (-targetWorldZ * Math.tan(fov / 2) / aspect)
        
        // Convert to screen coordinates (0-1)
        const targetScreenX = (projectedX + 1) / 2  // -1 to 1 becomes 0 to 1
        const targetScreenY = 1 - (projectedY + 1) / 2  // Flip Y and -1 to 1 becomes 0 to 1
        
        // Crosshair is always at center of screen
        const crosshairScreenX = 0.5
        const crosshairScreenY = 0.5
        
        // Calculate distance between crosshair and target on screen
        const screenDistance = Math.sqrt(
          Math.pow(crosshairScreenX - targetScreenX, 2) + 
          Math.pow(crosshairScreenY - targetScreenY, 2)
        )
        
        // Aim Labs style tracking threshold (smaller = more precise)
        const trackingRadius = 0.05 // 5% of screen
        const isTracking = screenDistance < trackingRadius
        
        let scoreIncrease = 0
        let newAccuracy = prev.accuracy
        
        if (isTracking) {
          // Award points continuously while tracking
          const trackingQuality = Math.max(0, 1 - (screenDistance / trackingRadius))
          scoreIncrease = trackingQuality * 2.0 // 2 points per update when perfectly centered
          
          // Gradually improve accuracy
          newAccuracy = Math.min(100, prev.accuracy + 0.1)
          
          // Update tracking stats
          const updatedTracking = {
            ...prev.tracking,
            crosshairPosition: [crosshairScreenX, crosshairScreenY] as [number, number],
            targetPosition: [targetScreenX, targetScreenY] as [number, number],
            trackingScore: prev.tracking.trackingScore + scoreIncrease,
            trackingAccuracy: newAccuracy,
            isTracking: true
          }
          
          return {
            ...prev,
            score: Math.floor(prev.score + scoreIncrease),
            accuracy: newAccuracy,
            tracking: updatedTracking
          }
        } else {
          // Not tracking - gradual accuracy decrease
          newAccuracy = Math.max(0, prev.accuracy - 0.02)
          
          const updatedTracking = {
            ...prev.tracking,
            crosshairPosition: [crosshairScreenX, crosshairScreenY] as [number, number],
            targetPosition: [targetScreenX, targetScreenY] as [number, number],
            trackingAccuracy: newAccuracy,
            isTracking: false
          }
          
          return {
            ...prev,
            accuracy: newAccuracy,
            tracking: updatedTracking
          }
        }
      })
    }
  }, [gameMode, gameState.gameActive, gameState.targets])

  // Apply settings updates
  const updateGameSettings = useCallback((newSettings: any) => {
    // Store settings globally so mouse controls can access them
    if (typeof window !== 'undefined') {
      (window as any).currentAimGameSettings = newSettings
    }
    
    console.log('Applied new settings to game:', newSettings)
    
    // Settings like crosshair color, target color, etc. are applied via the settings prop
    // Sensitivity is now applied in real-time via the global settings access
  }, [])

  // Test hit sound function
  const testHitSound = useCallback(() => {
    playHitSound()
  }, [playHitSound])

  // Expose functions to parent component
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).startAimGame = startGameTimer;
      (window as any).pauseAimGame = pauseGame;
      (window as any).resumeAimGame = resumeGame;
      (window as any).updateTrackingPosition = updateTrackingPosition;
      (window as any).updateAimGameSettings = updateGameSettings;
      (window as any).testHitSound = testHitSound;
    }
  }, [startGameTimer, pauseGame, resumeGame, updateTrackingPosition, updateGameSettings, testHitSound])

  // Initialize game when component mounts - FIXED VERSION
  useEffect(() => {
    console.log('AimTrainer3D Component mounted - initializing once!')
    
    const initGame = () => {
      try {
        // Generate initial targets - AIM LABS STYLE
        const targetCount = gameMode === 'gridshot' ? 1 : gameMode === 'precision' ? 1 : 1 // One target at a time like Aim Labs
        const newTargets: Target[] = []
        
        for (let i = 0; i < targetCount; i++) {
          newTargets.push(generateSingleTarget())
        }
        
        console.log('Initial targets created:', newTargets.length)
        
        setGameState({
          score: 0,
          accuracy: 100,
          targetsHit: 0,
          targetsMissed: 0,
          timeLeft: settings.gameDuration,
          gameActive: false, // Wait for user to start
          targets: newTargets,
          consecutiveHits: 0,
          lastHitTime: 0,
          tracking: gameMode === 'tracking' ? {
            crosshairPosition: [0.5, 0.5],
            targetPosition: [0.5, 0.5],
            trackingScore: 0,
            trackingAccuracy: 100,
            trackingTime: 0,
            isTracking: false
          } : undefined
        })
        
        // Initialize audio (no start sound)
        initAudio().catch(() => {
          console.warn('Audio init failed, continuing without sound')
        })
        
      } catch (error) {
        console.error('Failed to initialize game:', error)
      }
    }
    
    initGame()
  }, [gameMode, settings.gameDuration]) // Only depend on props, not callbacks

  return (
    <div className="w-full h-screen relative">
      {/* Instructions overlay */}
      {!gameState.gameActive && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/80 backdrop-blur-sm px-6 py-3 rounded-xl text-white text-center">
          <p className="text-lg font-semibold mb-2">FPS Aim Trainer</p>
          <p className="text-sm">Click to lock mouse • Move mouse to look around • Click to shoot</p>
          <p className="text-xs text-gray-400 mt-1">Press ESC to unlock mouse</p>
        </div>
      )}

      {/* Modern HUD Overlay */}
      {gameState.gameActive && (
        <div className="absolute inset-0 pointer-events-none z-40">
          {/* Top HUD Bar */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-8">
            {/* Score */}
            <div 
              className="px-6 py-3 rounded-2xl backdrop-blur-xl border shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                boxShadow: '0 0 30px rgba(0, 212, 255, 0.2)'
              }}
            >
              <div className="text-center">
                <p className="text-cyan-300 text-xs font-bold uppercase tracking-wider">Score</p>
                <p className="text-white text-2xl font-black">{gameState.score}</p>
              </div>
            </div>

            {/* Time */}
            <div 
              className="px-6 py-3 rounded-2xl backdrop-blur-xl border shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 0, 84, 0.15) 0%, rgba(255, 70, 84, 0.1) 100%)',
                border: '1px solid rgba(255, 0, 84, 0.3)',
                boxShadow: '0 0 30px rgba(255, 0, 84, 0.2)'
              }}
            >
              <div className="text-center">
                <p className="text-red-300 text-xs font-bold uppercase tracking-wider">Time</p>
                <p className="text-white text-2xl font-black">{gameState.timeLeft}s</p>
              </div>
            </div>

            {/* Accuracy */}
            <div 
              className="px-6 py-3 rounded-2xl backdrop-blur-xl border shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                boxShadow: '0 0 30px rgba(168, 85, 247, 0.2)'
              }}
            >
              <div className="text-center">
                <p className="text-purple-300 text-xs font-bold uppercase tracking-wider">Accuracy</p>
                <p className="text-white text-2xl font-black">{gameState.accuracy.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          {/* Side Stats */}
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 space-y-4">
            {/* Hits */}
            <div 
              className="px-4 py-3 rounded-xl backdrop-blur-xl border"
              style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(22, 163, 74, 0.1) 100%)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)'
              }}
            >
              <p className="text-green-300 text-xs font-bold">HITS</p>
              <p className="text-white text-xl font-black">{gameState.targetsHit}</p>
            </div>

            {/* Consecutive Hits */}
            {gameState.consecutiveHits > 0 && (
              <div 
                className="px-4 py-3 rounded-xl backdrop-blur-xl border animate-pulse"
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(251, 191, 36, 0.1) 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.2)'
                }}
              >
                <p className="text-yellow-300 text-xs font-bold">STREAK</p>
                <p className="text-white text-xl font-black">{gameState.consecutiveHits}</p>
              </div>
            )}
          </div>

          {/* Center Crosshair Overlay (for visibility) */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              {/* Crosshair lines - change color based on tracking */}
              <div 
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-60 transition-colors duration-100 ${
                  gameMode === 'tracking' && gameState.tracking?.isTracking 
                    ? 'bg-green-400 shadow-lg shadow-green-400/50' 
                    : 'bg-white'
                }`}
                style={{ width: '20px', height: '2px' }}
              />
              <div 
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-60 transition-colors duration-100 ${
                  gameMode === 'tracking' && gameState.tracking?.isTracking 
                    ? 'bg-green-400 shadow-lg shadow-green-400/50' 
                    : 'bg-white'
                }`}
                style={{ width: '2px', height: '20px' }}
              />
              {/* Center dot */}
              <div 
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 transition-all duration-100 ${
                  gameMode === 'tracking' && gameState.tracking?.isTracking 
                    ? 'bg-green-400 shadow-lg shadow-green-400/50 scale-125' 
                    : 'bg-white'
                }`}
                style={{ width: '4px', height: '4px' }}
              />
              
              {/* Tracking radius indicator for tracking mode */}
              {gameMode === 'tracking' && (
                <div 
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 rounded-full transition-all duration-200 ${
                    gameState.tracking?.isTracking 
                      ? 'border-green-400/40 bg-green-400/10' 
                      : 'border-red-400/40 bg-red-400/5'
                  }`}
                  style={{ 
                    width: '100px', 
                    height: '100px',
                    pointerEvents: 'none'
                  }}
                />
              )}
            </div>
          </div>
          
          {/* Tracking Mode Specific UI */}
          {gameMode === 'tracking' && gameState.tracking && gameState.gameActive && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-40">
              <div className={`px-6 py-3 rounded-xl backdrop-blur-xl border transition-all duration-200 ${
                gameState.tracking.isTracking 
                  ? 'bg-green-500/20 border-green-500/40 shadow-lg shadow-green-500/25' 
                  : 'bg-red-500/20 border-red-500/40 shadow-lg shadow-red-500/25'
              }`}>
                <div className="text-center">
                  <p className={`text-sm font-bold uppercase tracking-wider ${
                    gameState.tracking.isTracking ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {gameState.tracking.isTracking ? '🎯 TRACKING!' : '❌ NOT TRACKING'}
                  </p>
                  <p className="text-white text-lg font-black">+{gameState.score.toFixed(0)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <Canvas
        camera={{ 
          position: [0, 0, 0], // Start at origin like FPS games
          fov: 103, // Fixed Valorant FOV
          near: 0.1,
          far: 1000,
          rotation: [0, 0, 0] // Face forward
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(settings.backgroundColor || '#0a0a0a')
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        }}
        style={{ 
          width: '100%', 
          height: '100vh',
          display: 'block',
          background: settings.backgroundColor || '#0a0a0a'
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <FPSControls gameMode={gameMode} />
        <RaycastShooter 
          onTargetHit={handleTargetHit}
          onShoot={handleShoot}
          targets={gameState.targets}
        />
        
        {/* Target Movement System */}
        <TargetMovement 
          targets={gameState.targets}
          gameMode={gameMode || 'gridshot'}
          onTargetUpdate={updateTargets}
          onTargetExpired={handleTargetExpired}
        />
        
        {/* Game targets */}
        {gameState.targets.length > 0 ? (
          gameState.targets.map((target) => (
            <Sphere
              key={target.id}
              args={[target.scale || 1, 16, 16]}
              position={target.position}
              userData={{ targetId: target.id, isTarget: true }}
            >
              <meshBasicMaterial color={target.color} />
            </Sphere>
          ))
        ) : (
          // Fallback test cube
          <Box args={[2, 2, 2]} position={[0, 2, -8]}>
            <meshBasicMaterial color="red" />
          </Box>
        )}
        
        {/* Perfectly synced crosshair - exact same proportions as preview */}
        {settings.crosshairStyle === 'cross' && (
          <group position={[0, 0, -10]}>
            {/* Using exact same scaling as preview: size*3 for length, thickness for width */}
            {/* Top line */}
            <Box args={[settings.crosshairSize * 0.0015, settings.crosshairThickness * 0.0002, 0.001]} 
                 position={[0, (settings.crosshairGap * 0.0002 + settings.crosshairThickness * 0.0001), 0]}>
              <meshBasicMaterial color={settings.crosshairColor} transparent opacity={settings.crosshairOpacity} />
            </Box>
            {/* Bottom line */}
            <Box args={[settings.crosshairSize * 0.0015, settings.crosshairThickness * 0.0002, 0.001]} 
                 position={[0, -(settings.crosshairGap * 0.0002 + settings.crosshairThickness * 0.0001), 0]}>
              <meshBasicMaterial color={settings.crosshairColor} transparent opacity={settings.crosshairOpacity} />
            </Box>
            {/* Left line */}
            <Box args={[settings.crosshairThickness * 0.0002, settings.crosshairSize * 0.0015, 0.001]} 
                 position={[-(settings.crosshairGap * 0.0002 + settings.crosshairThickness * 0.0001), 0, 0]}>
              <meshBasicMaterial color={settings.crosshairColor} transparent opacity={settings.crosshairOpacity} />
            </Box>
            {/* Right line */}
            <Box args={[settings.crosshairThickness * 0.0002, settings.crosshairSize * 0.0015, 0.001]} 
                 position={[(settings.crosshairGap * 0.0002 + settings.crosshairThickness * 0.0001), 0, 0]}>
              <meshBasicMaterial color={settings.crosshairColor} transparent opacity={settings.crosshairOpacity} />
            </Box>
          </group>
        )}
        
        {settings.crosshairStyle === 'dot' && (
          <group position={[0, 0, -10]}>
            <Sphere args={[settings.crosshairSize * 0.0005, 16, 16]}>
              <meshBasicMaterial color={settings.crosshairColor} transparent opacity={settings.crosshairOpacity} />
            </Sphere>
          </group>
        )}
        
        {settings.crosshairStyle === 'circle' && (
          <group position={[0, 0, -10]}>
            <mesh>
              <ringGeometry args={[settings.crosshairSize * 0.002, settings.crosshairSize * 0.002 + settings.crosshairThickness * 0.0003, 32]} />
              <meshBasicMaterial color={settings.crosshairColor} transparent opacity={settings.crosshairOpacity} />
            </mesh>
          </group>
        )}
        
        {/* Center dot - always rendered if enabled */}
        {settings.centerDot && (
          <group position={[0, 0, -10]}>
            <Sphere args={[settings.centerDotSize * 0.0002, 8, 8]} position={[0, 0, 0.001]}>
              <meshBasicMaterial color={settings.crosshairColor} transparent opacity={settings.centerDotOpacity} />
            </Sphere>
          </group>
        )}
      </Canvas>

      {/* Game over overlay */}
      {!gameState.gameActive && gameState.timeLeft === 0 && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Game Complete!</h2>
            <p className="text-2xl mb-2">Final Score: {gameState.score}</p>
            <p className="text-xl mb-6">Accuracy: {gameState.accuracy.toFixed(1)}%</p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-bold hover:scale-105 transition-all duration-300"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
