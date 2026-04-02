import {
  type HashTableEntry,
  type HashTableOperation,
  type HashTablePhase,
  type HashTableSnapshotStep,
} from "@/lib/hashTable/types"

type SnapshotContext = {
  snapshots: HashTableSnapshotStep[]
  buckets: HashTableEntry[][]
}

export class HashTable {
  private buckets: HashTableEntry[][] = []
  private capacity: number
  private nextSnapshotIndex = 0

  constructor(capacity: number = 10) {
    this.capacity = capacity
    this.buckets = Array.from({ length: capacity }, () => [])
  }

  insert(key: number): HashTableSnapshotStep[] {
    const context = this.createContext()

    this.capture(context, "start", {
      message: `Inserting key ${key} into hash table.`,
      aiExplanation: `We will compute hash(${key}) to find the correct bucket, then add the key using separate chaining.`,
    })

    const hashResult = this.hash(key)

    this.capture(context, "hash", {
      activeBucket: hashResult,
      hashResult,
      message: `hash(${key}) = ${key} % ${this.capacity} = ${hashResult}.`,
      aiExplanation: `Using modulo hashing: key % table_size. The key ${key} maps to bucket ${hashResult}.`,
    })

    const bucket = this.buckets[hashResult]
    const exists = bucket.find((e) => e.key === key)

    if (exists) {
      this.capture(context, "complete", {
        activeBucket: hashResult,
        activeEntry: exists,
        message: `Key ${key} already exists in bucket ${hashResult}.`,
        aiExplanation: `Duplicate key detected. Hash tables typically don't allow duplicate keys.`,
      })
      return context.snapshots
    }

    if (bucket.length > 0) {
      this.capture(context, "collision", {
        activeBucket: hashResult,
        message: `Collision! Bucket ${hashResult} already has ${bucket.length} entry(ies).`,
        aiExplanation: `Multiple keys hash to the same bucket. Using separate chaining (linked list) to handle the collision.`,
      })
    }

    const entry: HashTableEntry = { key, value: key }
    bucket.push(entry)

    this.capture(context, "insert", {
      activeBucket: hashResult,
      activeEntry: entry,
      message: `Inserted ${key} into bucket ${hashResult}.`,
      aiExplanation: `Key ${key} added to bucket ${hashResult}. ${bucket.length > 1 ? "It's chained with existing entries." : "Bucket now contains 1 entry."}`,
    })

    this.capture(context, "complete", {
      message: `Insert complete. Key ${key} is now in the hash table.`,
      aiExplanation:
        "Insertion successful. The key can now be found in O(1) average time.",
    })

    return context.snapshots
  }

  search(key: number): HashTableSnapshotStep[] {
    const context = this.createContext()

    this.capture(context, "start", {
      message: `Searching for key ${key} in hash table.`,
      aiExplanation: `Compute the hash to find the bucket, then search within the chain.`,
    })

    const hashResult = this.hash(key)

    this.capture(context, "hash", {
      activeBucket: hashResult,
      hashResult,
      message: `hash(${key}) = ${key} % ${this.capacity} = ${hashResult}.`,
      aiExplanation: `Looking in bucket ${hashResult} for key ${key}.`,
    })

    const bucket = this.buckets[hashResult]
    const found = bucket.find((e) => e.key === key)

    if (found) {
      this.capture(context, "search-found", {
        activeBucket: hashResult,
        activeEntry: found,
        message: `Found key ${key} in bucket ${hashResult} with value ${found.value}.`,
        aiExplanation: `Key ${key} found! Search took O(1) average time. The value is ${found.value}.`,
      })
    } else {
      this.capture(context, "search-not-found", {
        activeBucket: hashResult,
        message: `Key ${key} not found in bucket ${hashResult}.`,
        aiExplanation: `Searched bucket ${hashResult} but key ${key} is not in the hash table.`,
      })
    }

    this.capture(context, "complete", {
      activeBucket: hashResult,
      activeEntry: found ?? null,
      message: found
        ? `Search complete. Key ${key} found.`
        : `Search complete. Key ${key} not found.`,
      aiExplanation: found
        ? "Search successful. Hash tables provide O(1) average lookup time."
        : "Search complete. The key does not exist in this hash table.",
    })

    return context.snapshots
  }

  delete(key: number): HashTableSnapshotStep[] {
    const context = this.createContext()

    this.capture(context, "start", {
      message: `Deleting key ${key} from hash table.`,
      aiExplanation: `Compute the hash to find the bucket, then remove the key from the chain.`,
    })

    const hashResult = this.hash(key)

    this.capture(context, "hash", {
      activeBucket: hashResult,
      hashResult,
      message: `hash(${key}) = ${key} % ${this.capacity} = ${hashResult}.`,
      aiExplanation: `Looking in bucket ${hashResult} to delete key ${key}.`,
    })

    const bucket = this.buckets[hashResult]
    const index = bucket.findIndex((e) => e.key === key)

    if (index === -1) {
      this.capture(context, "delete-not-found", {
        activeBucket: hashResult,
        message: `Key ${key} not found in bucket ${hashResult}. Nothing to delete.`,
        aiExplanation: `The key ${key} doesn't exist in bucket ${hashResult}. Delete operation has no effect.`,
      })
    } else {
      const removed = bucket.splice(index, 1)[0]

      this.capture(context, "delete-found", {
        activeBucket: hashResult,
        activeEntry: removed,
        message: `Deleted key ${key} from bucket ${hashResult}.`,
        aiExplanation: `Key ${key} removed from bucket ${hashResult}. ${bucket.length > 0 ? `${bucket.length} entries remain in this bucket.` : "Bucket is now empty."}`,
      })
    }

    this.capture(context, "complete", {
      activeBucket: hashResult,
      message:
        index === -1
          ? `Delete complete. Key ${key} was not in the table.`
          : `Delete complete. Key ${key} removed.`,
      aiExplanation:
        index === -1
          ? "No action taken. The key was not present."
          : "Deletion successful. The key has been removed from the hash table.",
    })

    return context.snapshots
  }

  reset(): void {
    this.buckets = Array.from({ length: this.capacity }, () => [])
    this.nextSnapshotIndex = 0
  }

  private hash(key: number): number {
    return Math.abs(key) % this.capacity
  }

  private createContext(): SnapshotContext {
    return {
      snapshots: [],
      buckets: this.buckets.map((bucket) => [...bucket]),
    }
  }

  private capture(
    context: SnapshotContext,
    phase: HashTablePhase,
    options: {
      activeBucket?: number | null
      activeEntry?: HashTableEntry | null
      hashResult?: number | null
      message: string
      aiExplanation: string
    }
  ): void {
    context.snapshots.push({
      index: this.nextSnapshotIndex++,
      operation: this.inferOperation(phase),
      phase,
      buckets: this.buckets.map((bucket) => [...bucket]),
      activeBucket: options.activeBucket ?? null,
      activeEntry: options.activeEntry ?? null,
      hashResult: options.hashResult ?? null,
      message: options.message,
      aiExplanation: options.aiExplanation,
    })
  }

  private inferOperation(phase: HashTablePhase): HashTableOperation {
    switch (phase) {
      case "insert":
      case "collision":
        return "insert"
      case "search-found":
      case "search-not-found":
        return "search"
      case "delete-found":
      case "delete-not-found":
        return "delete"
      default:
        return "insert"
    }
  }
}
