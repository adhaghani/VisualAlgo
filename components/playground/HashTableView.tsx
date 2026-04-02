"use client"

import { motion } from "framer-motion"

import type {
  HashTableEntry,
  HashTableSnapshotStep,
} from "@/lib/hashTable/types"

type HashTableViewProps = {
  step: HashTableSnapshotStep | null
}

const ENTRY_WIDTH = 56
const ENTRY_GAP = 4

export default function HashTableView({ step }: HashTableViewProps) {
  const buckets = step?.buckets ?? []
  const activeBucket = step?.activeBucket
  const activeEntry = step?.activeEntry
  const phase = step?.phase ?? "start"

  function getBucketColor(bucketIndex: number): string {
    if (activeBucket !== null && activeBucket === bucketIndex) {
      if (phase === "collision") return "var(--warning)"
      if (
        phase === "insert" ||
        phase === "delete-found" ||
        phase === "search-found"
      ) {
        return "var(--success)"
      }
      if (phase === "search-not-found" || phase === "delete-not-found") {
        return "var(--destructive)"
      }
      return "var(--primary)"
    }
    return "var(--muted)"
  }

  function getEntryColor(entry: HashTableEntry, bucketIndex: number): string {
    if (
      activeEntry &&
      activeEntry.key === entry.key &&
      activeBucket === bucketIndex
    ) {
      if (phase === "insert") return "var(--success)"
      if (phase === "delete-found") return "var(--destructive)"
      if (phase === "search-found") return "var(--primary)"
      return "var(--warning)"
    }
    return "var(--background)"
  }

  return (
    <div className="rounded-2xl border bg-linear-to-b from-card to-muted/20 p-4 shadow-sm md:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide">Hash Table View</h2>
        <div className="rounded-full border bg-background px-2 py-1 text-[11px] text-muted-foreground">
          Separate Chaining
        </div>
      </div>

      <div className="w-full overflow-auto rounded-xl border bg-background/80">
        <div className="flex min-h-[300px] flex-col gap-2 p-4">
          {buckets.map((bucket, bucketIndex) => {
            const isActive = activeBucket === bucketIndex
            const totalWidth =
              bucket.length * (ENTRY_WIDTH + ENTRY_GAP) + ENTRY_GAP

            return (
              <div key={bucketIndex} className="flex items-center gap-3">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: getBucketColor(bucketIndex),
                    scale: isActive ? 1.02 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 font-mono text-sm font-bold"
                  style={{
                    borderColor: isActive ? "var(--primary)" : "var(--border)",
                  }}
                >
                  {bucketIndex}
                </motion.div>

                <div
                  className="relative flex items-center"
                  style={{ minWidth: Math.max(totalWidth, 60) }}
                >
                  {bucket.length === 0 ? (
                    <span className="text-xs text-muted-foreground">empty</span>
                  ) : (
                    bucket.map((entry, entryIndex) => (
                      <motion.div
                        key={`${bucketIndex}-${entryIndex}-${entry.key}`}
                        initial={false}
                        animate={{
                          backgroundColor: getEntryColor(entry, bucketIndex),
                          scale:
                            activeEntry?.key === entry.key &&
                            activeBucket === bucketIndex
                              ? 1.05
                              : 1,
                          x: entryIndex * (ENTRY_WIDTH + ENTRY_GAP),
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 28,
                        }}
                        className="absolute flex h-9 items-center justify-center rounded-md border font-mono text-xs font-semibold"
                        style={{
                          width: ENTRY_WIDTH,
                          borderColor:
                            activeEntry?.key === entry.key &&
                            activeBucket === bucketIndex
                              ? "var(--primary)"
                              : "var(--border)",
                        }}
                      >
                        {entry.key}
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-primary" />
          <span>Active bucket</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-[var(--success)]" />
          <span>Insert/Found</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-[var(--warning)]" />
          <span>Collision</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-[var(--destructive)]" />
          <span>Not found/Delete</span>
        </div>
      </div>
    </div>
  )
}
