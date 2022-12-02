/**
 * A max heap of numbers.
 * TODO: Support custom comparators.
 * TODO: Pretty sure this doesn't balance properly upon removal.
 */
export class Heap {
  // Skipping index zero makes the math easier :p
  private readonly array: number[] = [NaN];

  add(newItem: number) {
    this.array.push(newItem);

    let current = this.array.length - 1;
    let parent = current >> 1;
    while (parent > 0) {
      if (this.array[current] >= this.array[parent]) {
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

    let current = 1;
    let left = current << 1;
    let right = left + 1;
    while (left < this.array.length) {
      const currentVal = this.array[current];
      const leftVal = this.array[left];
      const rightVal = this.array[right];
      const hasRightChild = right < this.array.length;
      if (hasRightChild && leftVal < rightVal && this.array[current] < rightVal) {
        this.swap(current, right);
        current = right;
      } else if (currentVal < leftVal) {
        this.swap(current, left);
        current = left;
      } else {
        break;
      }
      left = current << 1;
      right = left + 1;
    }
  
    return itemToReturn;
  }

  private swap(a: number, b: number) {
    const temp = this.array[a];
    this.array[a] = this.array[b];
    this.array[b] = temp;
  }
}