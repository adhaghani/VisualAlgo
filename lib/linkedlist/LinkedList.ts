import {
  type LinkedListOperation,
  type LinkedListPhase,
  type LinkedListSnapshotStep,
  type SerializedListNode,
} from "@/lib/linkedlist/types"

class ListNode {
  id: number
  value: number
  next: ListNode | null

  constructor(id: number, value: number) {
    this.id = id
    this.value = value
    this.next = null
  }
}

type SnapshotContext = {
  operation: LinkedListOperation
  snapshots: LinkedListSnapshotStep[]
  head: ListNode | null
  activeId?: number
  highlightIds: number[]
}

export class LinkedList {
  private head: ListNode | null = null
  private nextNodeId = 1
  private nextSnapshotIndex = 0

  insertFront(value: number): LinkedListSnapshotStep[] {
    const context = this.createContext("insert-front")

    this.capture(context, "start", {
      message: `Start insertFront(${value}).`,
      aiExplanation: `We will insert ${value} at the front of the list.`,
    })

    const newNode = new ListNode(this.nextNodeId++, value)
    newNode.next = this.head
    this.head = newNode

    this.capture(context, "insert", {
      activeId: newNode.id,
      highlightIds: [newNode.id],
      message: `Inserted ${value} at front. New head is ${value}.`,
      aiExplanation: `New node ${value} now points to the previous head (or null). It becomes the new head.`,
    })

    this.capture(context, "complete", {
      message: `insertFront(${value}) complete.`,
      aiExplanation: "Insertion at front is O(1) - no traversal needed.",
    })

    return context.snapshots
  }

  insertBack(value: number): LinkedListSnapshotStep[] {
    const context = this.createContext("insert-back")

    this.capture(context, "start", {
      message: `Start insertBack(${value}).`,
      aiExplanation: `We will insert ${value} at the back of the list.`,
    })

    const newNode = new ListNode(this.nextNodeId++, value)

    if (!this.head) {
      this.head = newNode
      this.capture(context, "insert", {
        activeId: newNode.id,
        highlightIds: [newNode.id],
        message: `List was empty. ${value} becomes the head.`,
        aiExplanation: "Empty list case: new node becomes both head and tail.",
      })
    } else {
      let current = this.head
      const path: number[] = []

      while (current.next) {
        path.push(current.id)
        this.capture(context, "traverse", {
          activeId: current.id,
          highlightIds: [...path],
          message: `Traverse from ${current.value} to next node.`,
          aiExplanation: `Moving through the list to find the last node. Currently at ${current.value}.`,
        })
        current = current.next!
      }

      path.push(current.id)
      current.next = newNode

      this.capture(context, "insert", {
        activeId: newNode.id,
        highlightIds: [...path, newNode.id],
        message: `Inserted ${value} at back after ${current.value}.`,
        aiExplanation: `Reached the tail (${current.value}). New node ${value} is now the new tail.`,
      })
    }

    this.capture(context, "complete", {
      message: `insertBack(${value}) complete.`,
      aiExplanation:
        "Insertion at back is O(n) - must traverse to find the tail.",
    })

    return context.snapshots
  }

  delete(value: number): LinkedListSnapshotStep[] {
    const context = this.createContext("delete")

    this.capture(context, "start", {
      message: `Start delete(${value}).`,
      aiExplanation: `Search for node with value ${value} to delete it.`,
    })

    if (!this.head) {
      this.capture(context, "miss", {
        message: `List is empty. Nothing to delete.`,
        aiExplanation: "Cannot delete from an empty list.",
      })
      return context.snapshots
    }

    if (this.head.value === value) {
      const deletedId = this.head.id
      this.head = this.head.next

      this.capture(context, "delete", {
        activeId: deletedId,
        highlightIds: [deletedId],
        message: `Deleted head node ${value}.`,
        aiExplanation: "Target was the head. Head pointer moved to next node.",
      })

      this.capture(context, "complete", {
        message: `delete(${value}) complete.`,
        aiExplanation: "Head deletion is O(1).",
      })

      return context.snapshots
    }

    let current = this.head
    const path: number[] = [current.id]

    while (current.next && current.next.value !== value) {
      this.capture(context, "traverse", {
        activeId: current.id,
        highlightIds: [...path],
        message: `Traverse: current=${current.value}, looking for ${value}.`,
        aiExplanation: `Checking if next node has value ${value}. Currently at ${current.value}.`,
      })
      path.push(current.next.id)
      current = current.next
    }

    if (!current.next) {
      this.capture(context, "miss", {
        activeId: current.id,
        highlightIds: [...path],
        message: `Value ${value} not found in list.`,
        aiExplanation: "Reached end of list without finding the target value.",
      })
      return context.snapshots
    }

    const deletedNode = current.next
    const deletedId = deletedNode.id
    path.push(deletedId)

    this.capture(context, "found", {
      activeId: deletedId,
      highlightIds: [...path],
      message: `Found ${value} to delete.`,
      aiExplanation: `Target node ${value} found after ${current.value}.`,
    })

    current.next = deletedNode.next

    this.capture(context, "delete", {
      activeId: deletedId,
      highlightIds: [...path],
      message: `Deleted node ${value}. Bypassed it in the chain.`,
      aiExplanation: `Previous node's next pointer now skips over ${value} and points to ${deletedNode.next?.value ?? "null"}.`,
    })

    this.capture(context, "complete", {
      message: `delete(${value}) complete.`,
      aiExplanation: "Deletion is O(n) - required traversal to find the node.",
    })

    return context.snapshots
  }

  search(value: number): LinkedListSnapshotStep[] {
    const context = this.createContext("search")

    this.capture(context, "start", {
      message: `Start search(${value}).`,
      aiExplanation: `Linear search for value ${value} from head to tail.`,
    })

    if (!this.head) {
      this.capture(context, "miss", {
        message: `List is empty.`,
        aiExplanation: "Nothing to search in an empty list.",
      })
      return context.snapshots
    }

    let current: ListNode | null = this.head
    const path: number[] = []

    while (current) {
      path.push(current.id)

      if (current.value === value) {
        this.capture(context, "found", {
          activeId: current.id,
          highlightIds: [...path],
          message: `Found ${value} at position ${path.length}.`,
          aiExplanation: `Value ${value} found after visiting ${path.length} node(s).`,
        })

        this.capture(context, "complete", {
          message: `search(${value}) complete. Found!`,
          aiExplanation:
            "Search complete. Linear search is O(n) in worst case.",
        })

        return context.snapshots
      }

      this.capture(context, "traverse", {
        activeId: current.id,
        highlightIds: [...path],
        message: `Check node ${current.value}. Not a match.`,
        aiExplanation: `${current.value} !== ${value}. Continue to next node.`,
      })

      current = current.next
    }

    this.capture(context, "miss", {
      highlightIds: [...path],
      message: `Value ${value} not found after checking all nodes.`,
      aiExplanation: "Searched entire list. Target value does not exist.",
    })

    this.capture(context, "complete", {
      message: `search(${value}) complete. Not found.`,
      aiExplanation: "Search complete. Value not present in the list.",
    })

    return context.snapshots
  }

  reset(): void {
    this.head = null
    this.nextNodeId = 1
    this.nextSnapshotIndex = 0
  }

  private createContext(operation: LinkedListOperation): SnapshotContext {
    return {
      operation,
      snapshots: [],
      head: this.head,
      activeId: undefined,
      highlightIds: [],
    }
  }

  private capture(
    context: SnapshotContext,
    phase: LinkedListPhase,
    options: {
      activeId?: number
      highlightIds?: number[]
      message: string
      aiExplanation: string
    }
  ): void {
    context.snapshots.push({
      index: this.nextSnapshotIndex++,
      operation: context.operation,
      phase,
      nodes: this.serialize(this.head),
      activeId: options.activeId,
      highlightIds: options.highlightIds ?? [],
      message: options.message,
      aiExplanation: options.aiExplanation,
    })
  }

  private serialize(head: ListNode | null): SerializedListNode[] {
    const nodes: SerializedListNode[] = []
    let current = head

    while (current) {
      nodes.push({
        id: current.id,
        value: current.value,
        nextId: current.next?.id,
      })
      current = current.next
    }

    return nodes
  }
}
