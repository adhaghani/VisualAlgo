"use client"

import { useMemo, useState } from "react"

import { ExplainerSidebar } from "@/components/playground/ExplainerSidebar"
import { GraphView } from "@/components/playground/GraphView"
import { PlaybackControls } from "@/components/playground/PlaybackControls"
import { useGraphPlayback } from "@/hooks/useGraphPlayback"

function adaptStepForSidebar(step: { message: string; phase: string } | null) {
  if (!step) return null
  return {
    message: step.message,
    aiExplanation: "",
    operation: "traverse",
    phase: step.phase,
    index: 0,
  }
}

export default function GraphPlaygroundPage() {
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
  } = useGraphPlayback()

  const [modeInput, setModeInput] = useState("bfs")

  const sidebarTimeline = useMemo(() => {
    return timeline
      .map((step) => adaptStepForSidebar(step))
      .filter((step): step is NonNullable<typeof step> => step !== null)
  }, [timeline])

  const runTraversal = () => {
    const mode = modeInput === "dfs" ? "dfs" : "bfs"
    runOperation(mode)
  }

  return (
    <main className="min-h-svh bg-linear-to-b from-background to-muted/20 p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-400 flex-col gap-4">
        <header className="rounded-xl border bg-card p-4 shadow-sm">
          <h1 className="text-xl font-semibold">
            Mini Algorithm Playground • Graph Traversal
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore BFS and DFS traversals on a graph with animated step-by-step
            visualization.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Current: {operationLabel}
          </p>
        </header>

        <GraphView step={currentFrame} />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_1fr]">
          <div className="space-y-4">
            <PlaybackControls
              inputValue={modeInput}
              onInputChange={setModeInput}
              onInsert={runTraversal}
              onDelete={() => reset()}
              isPlaying={isPlaying}
              onPlay={play}
              onPause={pause}
              onStepPrev={stepPrev}
              onStepNext={stepNext}
              onReset={reset}
              speedMs={speedMs}
              onSpeedChange={setSpeed}
              insertLabel="Traverse"
              deleteLabel="Reset"
              inputLabel="Mode (bfs/dfs)"
              inputPlaceholder="bfs or dfs"
            />
          </div>

          <ExplainerSidebar
            timeline={sidebarTimeline}
            frameIndex={frameIndex}
          />
        </div>
      </div>
    </main>
  )
}
