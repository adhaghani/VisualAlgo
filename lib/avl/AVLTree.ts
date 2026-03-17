import {
  type AvlOperation,
  type AvlSnapshotPhase,
  type AvlSnapshotStep,
  type RotationType,
  type SerializedAvlNode,
} from "@/lib/avl/types"

class AvlNode {
  id: number
  value: number
  height: number
  left: AvlNode | null
  right: AvlNode | null

  constructor(id: number, value: number) {
    this.id = id
    this.value = value
    this.height = 1
    this.left = null
    this.right = null
  }
}

type SnapshotContext = {
  operation: AvlOperation
  snapshots: AvlSnapshotStep[]
  path: number[]
}

export class AVLTree {
  private root: AvlNode | null = null
  private nextNodeId = 1
  private nextSnapshotIndex = 0

  insert(value: number): AvlSnapshotStep[] {
    const context: SnapshotContext = {
      operation: "insert",
      snapshots: [],
      path: [],
    }

    this.capture(context, "start", {
      focusValue: value,
      message: `Start insert(${value}).`,
      aiExplanation: `We begin from the root and search for the correct position for ${value}.`,
    })

    this.root = this.insertNode(this.root, value, context)

    this.capture(context, "complete", {
      focusValue: value,
      message: `Insert(${value}) complete.`,
      aiExplanation:
        "Insertion timeline finished. The AVL tree remains balanced after any required rotations.",
    })

    return context.snapshots
  }

  delete(value: number): AvlSnapshotStep[] {
    const context: SnapshotContext = {
      operation: "delete",
      snapshots: [],
      path: [],
    }

    this.capture(context, "start", {
      focusValue: value,
      message: `Start delete(${value}).`,
      aiExplanation: `We search for node ${value}, remove it, and rebalance while unwinding.`,
    })

    this.root = this.deleteNode(this.root, value, context)

    this.capture(context, "complete", {
      focusValue: value,
      message: `Delete(${value}) complete.`,
      aiExplanation:
        "Deletion timeline finished. Heights and balance factors were re-validated up to the root.",
    })

    return context.snapshots
  }

  getRootSnapshot(): SerializedAvlNode | null {
    return this.serialize(this.root)
  }

  clear(): void {
    this.root = null
    this.nextNodeId = 1
    this.nextSnapshotIndex = 0
  }

  private insertNode(
    node: AvlNode | null,
    value: number,
    context: SnapshotContext
  ): AvlNode {
    if (!node) {
      const created = new AvlNode(this.nextNodeId++, value)
      this.capture(context, "insert-place", {
        focusValue: value,
        message: `Insert ${value} at leaf position.`,
        aiExplanation:
          "We reached a null child pointer, so this is the correct insertion location.",
      })
      return created
    }

    this.captureVisit(node, value, context)

    if (value < node.value) {
      context.path.push(node.value)
      node.left = this.insertNode(node.left, value, context)
      context.path.pop()
    } else if (value > node.value) {
      context.path.push(node.value)
      node.right = this.insertNode(node.right, value, context)
      context.path.pop()
    } else {
      this.capture(context, "duplicate", {
        focusValue: value,
        message: `Value ${value} already exists; AVL tree ignores duplicates.`,
        aiExplanation:
          "AVL trees typically keep unique keys. Duplicate insertion is skipped.",
      })
      return node
    }

    this.updateHeight(node)
    this.captureHeightAndBalance(node, value, context)

    return this.rebalance(node, value, context)
  }

  private deleteNode(
    node: AvlNode | null,
    value: number,
    context: SnapshotContext
  ): AvlNode | null {
    if (!node) {
      this.capture(context, "miss", {
        focusValue: value,
        message: `Value ${value} not found in tree.`,
        aiExplanation: `Search reached a null branch. Nothing to delete for ${value}.`,
      })
      return null
    }

    this.captureVisit(node, value, context)

    if (value < node.value) {
      context.path.push(node.value)
      node.left = this.deleteNode(node.left, value, context)
      context.path.pop()
    } else if (value > node.value) {
      context.path.push(node.value)
      node.right = this.deleteNode(node.right, value, context)
      context.path.pop()
    } else {
      this.capture(context, "delete-found", {
        focusValue: node.value,
        message: `Found node ${node.value} for deletion.`,
        aiExplanation:
          "Target located. We now apply one of the three deletion cases based on child count.",
      })

      if (!node.left && !node.right) {
        this.capture(context, "delete-leaf", {
          focusValue: node.value,
          message: `Node ${node.value} is a leaf, remove it directly.`,
          aiExplanation:
            "Leaf nodes have no children, so deletion is just pointer removal.",
        })
        return null
      }

      if (!node.left || !node.right) {
        const promotedChild = node.left ?? node.right
        this.capture(context, "delete-promote-child", {
          focusValue: node.value,
          message: `Node ${node.value} has one child, promote child ${promotedChild?.value}.`,
          aiExplanation:
            "With a single child, we bypass the node and connect its parent directly to that child.",
        })
        return promotedChild
      }

      this.capture(context, "delete-successor-search", {
        focusValue: node.value,
        message: `Node ${node.value} has two children, find inorder successor.`,
        aiExplanation:
          "For two-child delete, replace with the smallest value from the right subtree.",
      })

      const successor = this.findMin(node.right, context)

      this.capture(context, "delete-successor-selected", {
        focusValue: successor.value,
        message: `Successor chosen: ${successor.value}.`,
        aiExplanation: `Successor ${successor.value} preserves BST ordering when moved into the deleted node.`,
      })

      node.value = successor.value
      this.capture(context, "delete-replace-value", {
        focusValue: node.value,
        message: `Replace node value with successor ${successor.value}.`,
        aiExplanation:
          "The target node now stores successor value; next we remove duplicate successor node from right subtree.",
      })

      context.path.push(node.value)
      node.right = this.deleteNode(node.right, successor.value, context)
      context.path.pop()
    }

    this.updateHeight(node)
    this.captureHeightAndBalance(node, value, context)

    return this.rebalance(node, value, context)
  }

  private findMin(node: AvlNode, context: SnapshotContext): AvlNode {
    let current = node
    while (current.left) {
      this.capture(context, "delete-successor-search", {
        focusValue: current.value,
        message: `Move left from ${current.value} while searching successor.`,
        aiExplanation:
          "The inorder successor is the left-most node in the right subtree.",
      })
      current = current.left
    }
    return current
  }

  private rebalance(
    node: AvlNode,
    targetValue: number,
    context: SnapshotContext
  ): AvlNode {
    const balance = this.getBalance(node)

    if (balance > 1) {
      if (this.getBalance(node.left) >= 0) {
        this.captureRotation(
          node,
          "right",
          context,
          "rotation-before",
          targetValue
        )
        const rotated = this.rotateRight(node)
        this.captureRotation(
          rotated,
          "right",
          context,
          "rotation-after",
          targetValue
        )
        return rotated
      }

      this.captureRotation(
        node,
        "left-right",
        context,
        "rotation-before",
        targetValue
      )
      node.left = node.left ? this.rotateLeft(node.left) : null
      this.captureRotation(
        node,
        "left-right",
        context,
        "rotation-after",
        targetValue
      )
      const rotated = this.rotateRight(node)
      this.captureRotation(
        rotated,
        "right",
        context,
        "rotation-after",
        targetValue
      )
      return rotated
    }

    if (balance < -1) {
      if (this.getBalance(node.right) <= 0) {
        this.captureRotation(
          node,
          "left",
          context,
          "rotation-before",
          targetValue
        )
        const rotated = this.rotateLeft(node)
        this.captureRotation(
          rotated,
          "left",
          context,
          "rotation-after",
          targetValue
        )
        return rotated
      }

      this.captureRotation(
        node,
        "right-left",
        context,
        "rotation-before",
        targetValue
      )
      node.right = node.right ? this.rotateRight(node.right) : null
      this.captureRotation(
        node,
        "right-left",
        context,
        "rotation-after",
        targetValue
      )
      const rotated = this.rotateLeft(node)
      this.captureRotation(
        rotated,
        "left",
        context,
        "rotation-after",
        targetValue
      )
      return rotated
    }

    return node
  }

  private rotateLeft(pivot: AvlNode): AvlNode {
    const newRoot = pivot.right
    if (!newRoot) {
      return pivot
    }

    const transfer = newRoot.left

    newRoot.left = pivot
    pivot.right = transfer

    this.updateHeight(pivot)
    this.updateHeight(newRoot)

    return newRoot
  }

  private rotateRight(pivot: AvlNode): AvlNode {
    const newRoot = pivot.left
    if (!newRoot) {
      return pivot
    }

    const transfer = newRoot.right

    newRoot.right = pivot
    pivot.left = transfer

    this.updateHeight(pivot)
    this.updateHeight(newRoot)

    return newRoot
  }

  private updateHeight(node: AvlNode): void {
    node.height =
      1 + Math.max(this.getHeight(node.left), this.getHeight(node.right))
  }

  private getHeight(node: AvlNode | null): number {
    return node?.height ?? 0
  }

  private getBalance(node: AvlNode | null): number {
    if (!node) {
      return 0
    }
    return this.getHeight(node.left) - this.getHeight(node.right)
  }

  private captureVisit(
    node: AvlNode,
    targetValue: number,
    context: SnapshotContext
  ): void {
    this.capture(context, "visit", {
      focusValue: node.value,
      message: `Visit node ${node.value} while processing ${targetValue}.`,
      aiExplanation: `${targetValue} is compared against ${node.value} to choose left or right branch.`,
    })
  }

  private captureHeightAndBalance(
    node: AvlNode,
    targetValue: number,
    context: SnapshotContext
  ): void {
    this.capture(context, "height-update", {
      focusValue: node.value,
      message: `Update height at node ${node.value} to ${node.height}.`,
      aiExplanation: `After subtree changes, node ${node.value} recomputes height as 1 + max(leftHeight, rightHeight).`,
    })

    const balance = this.getBalance(node)
    this.capture(context, "balance-check", {
      focusValue: node.value,
      balanceAtFocus: balance,
      message: `Check balance at node ${node.value}: BF=${balance}.`,
      aiExplanation: `Balance Factor is leftHeight - rightHeight. AVL requires this value to stay between -1 and 1.`,
    })

    if (Math.abs(balance) > 1) {
      this.capture(context, "balance-check", {
        focusValue: node.value,
        balanceAtFocus: balance,
        message: `Node ${node.value} is unbalanced (BF=${balance}).`,
        aiExplanation: `Because |BF| > 1 at node ${node.value}, one or two rotations are required.`,
      })
    }

    void targetValue
  }

  private captureRotation(
    node: AvlNode,
    rotation: RotationType,
    context: SnapshotContext,
    phase: AvlSnapshotPhase,
    targetValue: number
  ): void {
    const label = this.rotationLabel(rotation)
    this.capture(context, phase, {
      focusValue: node.value,
      rotation,
      balanceAtFocus: this.getBalance(node),
      message:
        phase === "rotation-before"
          ? `Prepare ${label} rotation at node ${node.value}.`
          : `${label} rotation applied. New local root is ${node.value}.`,
      aiExplanation:
        phase === "rotation-before"
          ? `Node ${node.value} is unbalanced during ${context.operation}(${targetValue}), so ${label} rotation restores AVL constraints.`
          : `${label} rotation restructured pointers and reduced height imbalance.`,
    })
  }

  private rotationLabel(rotation: RotationType): string {
    if (rotation === "left-right") {
      return "Left-Right"
    }
    if (rotation === "right-left") {
      return "Right-Left"
    }
    return rotation === "left" ? "Left" : "Right"
  }

  private capture(
    context: SnapshotContext,
    phase: AvlSnapshotPhase,
    options: {
      focusValue?: number
      rotation?: RotationType
      balanceAtFocus?: number
      message: string
      aiExplanation: string
    }
  ): void {
    context.snapshots.push({
      index: this.nextSnapshotIndex++,
      operation: context.operation,
      phase,
      tree: this.serialize(this.root),
      path: [...context.path],
      focusValue: options.focusValue,
      rotation: options.rotation,
      balanceAtFocus: options.balanceAtFocus,
      message: options.message,
      aiExplanation: options.aiExplanation,
    })
  }

  private serialize(node: AvlNode | null): SerializedAvlNode | null {
    if (!node) {
      return null
    }

    return {
      id: node.id,
      value: node.value,
      height: node.height,
      balance: this.getBalance(node),
      left: this.serialize(node.left),
      right: this.serialize(node.right),
    }
  }
}
