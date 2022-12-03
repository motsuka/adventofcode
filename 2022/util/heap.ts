/**
 * A max heap of numbers.
 * TODO: Support custom comparators.
 */
export class Heap {
  // Skipping index zero makes the math easier :p
  private readonly array: number[] = [NaN];

  add(newItem: number) {
    this.array.push(newItem);

    let current = this.array.length - 1;
    let parent = current >> 1;
    while (parent > 0) {
      if (this.array[current] < this.array[parent]) {
        return;
      }
      this.swap(current, parent);
      current = parent;
      parent = current >> 1;
    }
  }

  remove(): number {
    this.swap(1, this.array.length - 1);
    const itemToReturn = this.array.pop()!;
    this.heapifyDown(1);
    return itemToReturn;
  }

  heapifyDown(current: number) {
    const left = current << 1;
    const leftVal = this.array[left];
    const right = left + 1;
    const rightVal = this.array[right];
    if (rightVal && rightVal > leftVal && rightVal > this.array[current]) {
      this.swap(current, right);
      this.heapifyDown(right);
    } else if (leftVal && leftVal > this.array[current]) {
      this.swap(current, left);
      this.heapifyDown(left);
    }
  }

  private swap(a: number, b: number) {
    const temp = this.array[a];
    this.array[a] = this.array[b];
    this.array[b] = temp;
  }
}