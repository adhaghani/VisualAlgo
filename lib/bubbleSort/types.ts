export type BubbleSortPhase =
  | "start"
  | "compare"
  | "swap"
  | "no-swap"
  | "sorted"
  | "complete"

export type BubbleSortStep = {
  index: number
  phase: BubbleSortPhase
  array: number[]
  highlightIndices: number[]
  sortedIndices: Set<number>
  message: string
  aiExplanation: string
}
