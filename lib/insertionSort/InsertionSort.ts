import {
  type InsertionSortPhase,
  type InsertionSortStep,
} from "@/lib/insertionSort/types"

export class InsertionSort {
  generateSteps(inputArray: number[]): InsertionSortStep[] {
    const arr = [...inputArray]
    const steps: InsertionSortStep[] = []
    let nextIndex = 0
    const sortedIndices = new Set<number>()
    const n = arr.length

    const capture = (
      phase: InsertionSortPhase,
      array: number[],
      highlightIndices: number[],
      message: string,
      aiExplanation: string
    ) => {
      steps.push({
        index: nextIndex++,
        phase,
        array: [...array],
        highlightIndices,
        sortedIndices: new Set(sortedIndices),
        message,
        aiExplanation,
      })
    }

    capture(
      "start",
      arr,
      [],
      `Starting insertion sort on array of ${n} elements.`,
      "Insertion sort builds the sorted array one element at a time by repeatedly picking the next element and inserting it into its correct position among the already sorted elements."
    )

    sortedIndices.add(0)
    capture(
      "sorted",
      arr,
      [0],
      `First element ${arr[0]} is trivially sorted.`,
      "The first element is considered sorted by default. We start picking keys from index 1."
    )

    for (let i = 1; i < n; i++) {
      const key = arr[i]

      capture(
        "pick-key",
        arr,
        [i],
        `Picking key element ${key} at index ${i}.`,
        `We select arr[${i}] = ${key} as the key element to insert into the sorted portion.`
      )

      let j = i - 1

      while (j >= 0 && arr[j] > key) {
        capture(
          "shift",
          arr,
          [j, j + 1],
          `Shifting ${arr[j]} from index ${j} to index ${j + 1}.`,
          `Since arr[${j}] = ${arr[j]} > key (${key}), we shift arr[${j}] one position to the right.`
        )
        arr[j + 1] = arr[j]
        j--
      }

      arr[j + 1] = key

      capture(
        "insert",
        arr,
        [j + 1],
        `Inserted key ${key} at index ${j + 1}.`,
        `Found the correct position. Key ${key} is now placed at index ${j + 1} in the sorted portion.`
      )

      for (let k = 0; k <= i; k++) {
        sortedIndices.add(k)
      }

      capture(
        "sorted",
        arr,
        [j + 1],
        `Elements from index 0 to ${i} are now sorted.`,
        `After inserting ${key}, the subarray arr[0...${i}] is sorted. Ready to pick the next key.`
      )
    }

    capture(
      "complete",
      arr,
      [],
      `Array is fully sorted: [${arr.join(", ")}].`,
      "Insertion sort complete. All elements are now in ascending order."
    )

    return steps
  }
}
