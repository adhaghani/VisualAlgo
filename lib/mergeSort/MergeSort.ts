import { type MergeSortPhase, type MergeSortStep } from "@/lib/mergeSort/types"

export class MergeSort {
  generateSteps(inputArray: number[]): MergeSortStep[] {
    const arr = [...inputArray]
    const steps: MergeSortStep[] = []
    let nextIndex = 0
    const sortedIndices = new Set<number>()

    const capture = (
      phase: MergeSortPhase,
      array: number[],
      highlightIndices: number[],
      sortedIndices: Set<number>,
      activeRange: [number, number] | null,
      message: string,
      aiExplanation: string
    ) => {
      steps.push({
        index: nextIndex++,
        phase,
        array: [...array],
        highlightIndices,
        sortedIndices: new Set(sortedIndices),
        activeRange,
        message,
        aiExplanation,
      })
    }

    capture(
      "start",
      arr,
      [],
      new Set(),
      [0, arr.length - 1],
      `Starting merge sort on array of ${arr.length} elements.`,
      "Merge sort divides the array in half recursively, then merges sorted halves back together."
    )

    this.mergeSort(arr, 0, arr.length - 1, sortedIndices, capture)

    for (let i = 0; i < arr.length; i++) {
      sortedIndices.add(i)
    }

    capture(
      "complete",
      arr,
      [],
      sortedIndices,
      null,
      `Array is fully sorted: [${arr.join(", ")}].`,
      "Merge sort complete. All elements are now in ascending order."
    )

    return steps
  }

  private mergeSort(
    arr: number[],
    left: number,
    right: number,
    sortedIndices: Set<number>,
    capture: (
      phase: MergeSortPhase,
      array: number[],
      highlightIndices: number[],
      sortedIndices: Set<number>,
      activeRange: [number, number] | null,
      message: string,
      aiExplanation: string
    ) => void
  ): void {
    if (left >= right) return

    const mid = Math.floor((left + right) / 2)

    capture(
      "split",
      arr,
      [],
      new Set(sortedIndices),
      [left, right],
      `Split range [${left}..${right}] at midpoint ${mid}.`,
      `Divide array into left half [${left}..${mid}] and right half [${mid + 1}..${right}].`
    )

    this.mergeSort(arr, left, mid, sortedIndices, capture)
    this.mergeSort(arr, mid + 1, right, sortedIndices, capture)
    this.merge(arr, left, mid, right, sortedIndices, capture)
  }

  private merge(
    arr: number[],
    left: number,
    mid: number,
    right: number,
    sortedIndices: Set<number>,
    capture: (
      phase: MergeSortPhase,
      array: number[],
      highlightIndices: number[],
      sortedIndices: Set<number>,
      activeRange: [number, number] | null,
      message: string,
      aiExplanation: string
    ) => void
  ): void {
    capture(
      "merge",
      arr,
      [],
      new Set(sortedIndices),
      [left, right],
      `Merge sorted halves [${left}..${mid}] and [${mid + 1}..${right}].`,
      "Two sorted sub-arrays will be merged into one sorted range."
    )

    const leftArr = arr.slice(left, mid + 1)
    const rightArr = arr.slice(mid + 1, right + 1)
    let i = 0
    let j = 0
    let k = left

    while (i < leftArr.length && j < rightArr.length) {
      capture(
        "compare",
        arr,
        [left + i, mid + 1 + j],
        new Set(sortedIndices),
        [left, right],
        `Compare ${leftArr[i]} (left) vs ${rightArr[j]} (right).`,
        `Pick the smaller element to place next in the merged result.`
      )

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i]
        capture(
          "place-left",
          arr,
          [k],
          new Set(sortedIndices),
          [left, right],
          `Place ${leftArr[i]} from left half at index ${k}.`,
          `Left element ${leftArr[i]} is smaller, so it goes into position ${k}.`
        )
        i++
      } else {
        arr[k] = rightArr[j]
        capture(
          "place-right",
          arr,
          [k],
          new Set(sortedIndices),
          [left, right],
          `Place ${rightArr[j]} from right half at index ${k}.`,
          `Right element ${rightArr[j]} is smaller, so it goes into position ${k}.`
        )
        j++
      }
      k++
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i]
      capture(
        "copy-back",
        arr,
        [k],
        new Set(sortedIndices),
        [left, right],
        `Copy remaining left element ${leftArr[i]} to index ${k}.`,
        "Left half still has elements; copy them into the merged range."
      )
      i++
      k++
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j]
      capture(
        "copy-back",
        arr,
        [k],
        new Set(sortedIndices),
        [left, right],
        `Copy remaining right element ${rightArr[j]} to index ${k}.`,
        "Right half still has elements; copy them into the merged range."
      )
      j++
      k++
    }

    capture(
      "sorted",
      arr,
      [],
      new Set(sortedIndices),
      [left, right],
      `Range [${left}..${right}] is now sorted.`,
      "The merge step completed. This sub-range is now sorted."
    )
  }
}
