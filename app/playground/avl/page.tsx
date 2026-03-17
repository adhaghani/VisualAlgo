"use client"

import { useMemo, useState } from "react"

import { ExplainerSidebar } from "@/components/playground/ExplainerSidebar"
import { PlaybackControls } from "@/components/playground/PlaybackControls"
import { TreeView } from "@/components/playground/TreeView"
import { useAvlPlayback } from "@/hooks/useAvlPlayback"

export default function AvlPlaygroundPage() {
  const [inputValue, setInputValue] = useState("")
  const {
    timeline,
    frameIndex,
    currentFrame,
    isPlaying,
    speedMs,
    operationLabel,
    runOperation,
    stepNext,
    stepPrev,
    play,
    pause,
    reset,
    setSpeed,
  } = useAvlPlayback()

  const parsedValue = useMemo(() => Number(inputValue), [inputValue])
  const valueIsValid = Number.isInteger(parsedValue)

  const runInsert = () => {
    if (!valueIsValid) {
      return
    }
    runOperation("insert", parsedValue)
  }

  const runDelete = () => {
    if (!valueIsValid) {
      return
    }
    runOperation("delete", parsedValue)
  }

  return (
    <main className="min-h-svh bg-gradient-to-b from-background to-muted/20 p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4">
        <header className="rounded-xl border bg-card p-4 shadow-sm">
          <h1 className="text-xl font-semibold">
            Mini Algorithm Playground • AVL Rotations
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Insert or delete values, then play through each balancing step with
            rotation-aware animation.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Current: {operationLabel}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_1fr_360px]">
          <div className="space-y-4">
            <PlaybackControls
              inputValue={inputValue}
              onInputChange={setInputValue}
              onInsert={runInsert}
              onDelete={runDelete}
              isPlaying={isPlaying}
              onPlay={play}
              onPause={pause}
              onStepPrev={stepPrev}
              onStepNext={stepNext}
              onReset={() => {
                setInputValue("")
                reset()
              }}
              speedMs={speedMs}
              onSpeedChange={setSpeed}
            />

            {!valueIsValid && inputValue.length > 0 ? (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                Please enter a valid integer.
              </div>
            ) : null}
          </div>

          <TreeView step={currentFrame} />

          <ExplainerSidebar timeline={timeline} frameIndex={frameIndex} />
        </div>
      </div>
    </main>
  )
}
