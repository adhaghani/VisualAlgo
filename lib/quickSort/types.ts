export type QuickSortPhase =
  | "start"
  | "choose-pivot"
  | "partition"
  | "swap"
  | "pivot-placed"
  | "sorted"
  | "complete"

export type QuickSortStep = {
  index: number
  phase: QuickSortPhase
  array: number[]
  highlightIndices: number[]
  sortedIndices: Set<number>
  pivotIndex: number | null
  message: string
  aiExplanation: string
}
