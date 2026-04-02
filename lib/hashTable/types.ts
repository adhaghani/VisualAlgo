export type HashTableOperation = "insert" | "search" | "delete"

export type HashTablePhase =
  | "start"
  | "hash"
  | "insert"
  | "search-found"
  | "search-not-found"
  | "delete-found"
  | "delete-not-found"
  | "collision"
  | "complete"

export type HashTableEntry = {
  key: number
  value: number
}

export type HashTableSnapshotStep = {
  index: number
  operation: HashTableOperation
  phase: HashTablePhase
  buckets: HashTableEntry[][]
  activeBucket: number | null
  activeEntry: HashTableEntry | null
  hashResult: number | null
  message: string
  aiExplanation: string
}
