'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  ChevronDown, Music2, Shuffle, Repeat,
} from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

interface Track {
  title: string
  artist: string
  duration: number
  artwork?: string
  platform?: string
}

const DEMO_QUEUE: Track[] = [
  { title: 'Neon Pulse', artist: 'AXEL NOVA', duration: 195 },
  { title: 'Midnight Signal', artist: 'LUNA WAVE', duration: 223 },
  { title: 'Solar Drift', artist: 'SOLSTICE', duration: 178 },
  { title: 'Echo Chamber', artist: 'REVERB', duration: 241 },
]

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const BAR_COUNT = 28

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const track = DEMO_QUEUE[trackIndex]
  const elapsed = (progress / 100) * track.duration

  const tick = useCallback(() => {
    setProgress(p => {
      if (p >= 100) {
        if (repeat) return 0
        setTrackIndex(i => (i + 1) % DEMO_QUEUE.length)
        return 0
      }
      return p + (100 / track.duration) * 0.5
    })
  }, [track.duration, repeat])

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(tick, 500)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isPlaying, tick])

  const skipNext = () => {
    const next = shuffle
      ? Math.floor(Math.random() * DEMO_QUEUE.length)
      : (trackIndex + 1) % DEMO_QUEUE.length
    setTrackIndex(next)
    setProgress(0)
  }

  const skipPrev = () => {
    if (progress > 10) { setProgress(0); return }
    setTrackIndex((trackIndex - 1 + DEMO_QUEUE.length) % DEMO_QUEUE.length)
    setProgress(0)
  }

  const barHeights = Array.from({ length: BAR_COUNT }, (_, i) => {
    const base = 20 + Math.sin(i * 0.7) * 15 + Math.cos(i * 1.3) * 10
    return Math.max(15, Math.min(85, base))
  })

  return (
    <div className={cn(
      'fixed bottom-0 right-0 z-50 transition-all duration-300',
      'left-0 lg:left-[280px]',
    )}>
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="border-t border-border/50 bg-background/95 backdrop-blur-xl"
          >
            {/* Progress bar at top */}
            <div className="relative h-[2px] bg-muted/30 cursor-pointer group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                setProgress(((e.clientX - rect.left) / rect.width) * 100)
              }}
            >
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity -ml-1.5"
                style={{ left: `${progress}%` }}
              />
            </div>

            <div className="flex items-center gap-4 px-4 py-3">
              {/* Artwork / Waveform */}
              <div className="flex-shrink-0 relative">
                <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
                  <Music2 className="h-5 w-5 text-primary" />
                </div>
                {isPlaying && (
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                )}
              </div>

              {/* Waveform visualization */}
              <div className="hidden sm:flex items-end gap-[2px] h-8 flex-shrink-0">
                {barHeights.map((h, i) => (
                  <motion.div
                    key={i}
                    className={cn(
                      'w-[3px] rounded-full origin-bottom',
                      i < (progress / 100) * BAR_COUNT ? 'bg-primary' : 'bg-muted-foreground/20',
                    )}
                    animate={isPlaying ? {
                      scaleY: [1, 1.4 + Math.random() * 0.8, 0.7, 1.2, 1],
                    } : { scaleY: 1 }}
                    transition={isPlaying ? {
                      duration: 0.5 + Math.random() * 0.4,
                      repeat: Infinity,
                      repeatType: 'mirror',
                      delay: i * 0.04,
                      ease: 'easeInOut',
                    } : { duration: 0.3 }}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{track.title}</p>
                <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
              </div>

              {/* Time */}
              <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0 font-mono">
                <span>{formatTime(elapsed)}</span>
                <span>/</span>
                <span>{formatTime(track.duration)}</span>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => setShuffle(!shuffle)}
                  className={cn(
                    'hidden sm:flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                    shuffle ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Shuffle className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={skipPrev}
                  className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SkipBack className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-9 w-9 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {isPlaying
                    ? <Pause className="h-4 w-4" />
                    : <Play className="h-4 w-4 translate-x-[1px]" />
                  }
                </button>

                <button
                  onClick={skipNext}
                  className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SkipForward className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setRepeat(!repeat)}
                  className={cn(
                    'hidden sm:flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                    repeat ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Repeat className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Volume */}
              <div className="hidden lg:flex items-center gap-2 flex-shrink-0 w-28">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isMuted || volume === 0
                    ? <VolumeX className="h-4 w-4" />
                    : <Volume2 className="h-4 w-4" />
                  }
                </button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={([v]) => { setVolume(v); setIsMuted(v === 0) }}
                  className="w-20"
                />
              </div>

              {/* Collapse */}
              <button
                onClick={() => setIsCollapsed(true)}
                className="h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini pill when collapsed */}
      <AnimatePresence>
        {isCollapsed && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => setIsCollapsed(false)}
            className="fixed bottom-4 right-4 flex items-center gap-2 rounded-full border border-border/60 bg-background/95 backdrop-blur px-3 py-2 text-xs font-medium shadow-lg hover:bg-secondary/50 transition-colors"
          >
            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Music2 className="h-3 w-3 text-primary" />
            </div>
            <span className="truncate max-w-[120px]">{track.title}</span>
            {isPlaying && <span className="h-2 w-2 rounded-full bg-primary animate-pulse flex-shrink-0" />}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
