export type InsertionSortPhase =
  | "start"
  | "pick-key"
  | "shift"
  | "insert"
  | "sorted"
  | "complete"

export type InsertionSortStep = {
  index: number
  phase: InsertionSortPhase
  array: number[]
  highlightIndices: number[]
  sortedIndices: Set<number>
  message: string
  aiExplanation: string
}
