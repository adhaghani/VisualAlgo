export type MergeSortPhase =
  | "start"
  | "split"
  | "merge"
  | "compare"
  | "place-left"
  | "place-right"
  | "copy-back"
  | "sorted"
  | "complete"

export type MergeSortStep = {
  index: number
  phase: MergeSortPhase
  array: number[]
  highlightIndices: number[]
  sortedIndices: Set<number>
  activeRange: [number, number] | null
  message: string
  aiExplanation: string
}
