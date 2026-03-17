export type AvlOperation = "insert" | "delete"

export type AvlSnapshotPhase =
  | "start"
  | "visit"
  | "insert-place"
  | "delete-found"
  | "delete-leaf"
  | "delete-promote-child"
  | "delete-successor-search"
  | "delete-successor-selected"
  | "delete-replace-value"
  | "height-update"
  | "balance-check"
  | "rotation-before"
  | "rotation-after"
  | "complete"
  | "duplicate"
  | "miss"

export type RotationType = "left" | "right" | "left-right" | "right-left"

export type SerializedAvlNode = {
  id: number
  value: number
  height: number
  balance: number
  left: SerializedAvlNode | null
  right: SerializedAvlNode | null
}

export type AvlSnapshotStep = {
  index: number
  operation: AvlOperation
  phase: AvlSnapshotPhase
  tree: SerializedAvlNode | null
  path: number[]
  focusValue?: number
  balanceAtFocus?: number
  rotation?: RotationType
  message: string
  aiExplanation: string
}
