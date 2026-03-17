"use client"

import {
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"

type PlaybackControlsProps = {
  inputValue: string
  onInputChange: (value: string) => void
  onInsert: () => void
  onDelete: () => void
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
  onStepPrev: () => void
  onStepNext: () => void
  onReset: () => void
  speedMs: number
  onSpeedChange: (value: number) => void
}

const SPEED_OPTIONS = [1200, 850, 450]

export function PlaybackControls({
  inputValue,
  onInputChange,
  onInsert,
  onDelete,
  isPlaying,
  onPlay,
  onPause,
  onStepPrev,
  onStepNext,
  onReset,
  speedMs,
  onSpeedChange,
}: PlaybackControlsProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h2 className="text-sm font-semibold">Controls</h2>

      <div className="mt-3 flex flex-wrap items-end gap-2">
        <label className="flex min-w-[140px] flex-1 flex-col gap-1 text-xs text-muted-foreground">
          Value
          <input
            className="h-9 rounded-md border bg-background px-3 text-sm text-foreground ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-ring"
            type="number"
            value={inputValue}
            onChange={(event) => onInputChange(event.target.value)}
            placeholder="e.g. 42"
          />
        </label>

        <Button onClick={onInsert}>Insert</Button>
        <Button variant="secondary" onClick={onDelete}>
          <Trash2 className="mr-1 h-4 w-4" />
          Delete
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button variant="outline" size="icon" onClick={onStepPrev}>
          <SkipBack className="h-4 w-4" />
        </Button>

        {isPlaying ? (
          <Button variant="secondary" onClick={onPause}>
            <Pause className="mr-1 h-4 w-4" />
            Pause
          </Button>
        ) : (
          <Button onClick={onPlay}>
            <Play className="mr-1 h-4 w-4" />
            Play
          </Button>
        )}

        <Button variant="outline" size="icon" onClick={onStepNext}>
          <SkipForward className="h-4 w-4" />
        </Button>

        <Button variant="ghost" onClick={onReset}>
          <RotateCcw className="mr-1 h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="mt-4">
        <p className="text-xs text-muted-foreground">Playback speed</p>
        <div className="mt-2 flex gap-2">
          {SPEED_OPTIONS.map((option) => (
            <Button
              key={option}
              variant={option === speedMs ? "default" : "outline"}
              size="sm"
              onClick={() => onSpeedChange(option)}
            >
              {option}ms
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
