import { AStarNode } from '../interfaces/a-star.model';

/**
 * * Heap as a Tree:
 * root of the tree = first element (i = 1)
 * parent(i) = i/2
 * left(i) = 2i
 * right(i) = 2i + 1
 *
 * * Min Heap Property :
 * The key of a node is smaller than to the keys of its children
 */
// TODO: Refactor to be generic
export class MinHeap {
  private heapArray: AStarNode[] = [];

  constructor(arr) {
    this.heapArray = arr;
    this.buildMinHeap();
  }

  /**
   * return element of the heap with the smallest key
   */
  min() {
    return this.heapArray[0];
  }

  /**
   * returns element of the heap with the smallest key and removes it
   */
  extractMin() {
    const last = this.heapArray[this.heapSize() - 1];
    const root = this.heapArray[0];

    this.heapArray[0] = last;
    this.heapArray.splice(this.heapSize() - 1, 1);
    this.minHeapify(1);
    return root;
  }

  /**
   * Insert element into heap
   */
  insert(element) {
    this.heapArray.push(element);
    const index = this.heapSize();
    this.bubbleUp(index);
  }

  /**
   * updates the element at a specified index
   *
   * @param index Index needed to be updated
   */
  update(index, newElement) {
    const oldElement = this.heapArray[index];
    this.heapArray[index] = newElement;

    if (oldElement.g > newElement.g) {
      this.bubbleUp(index);
    } else if (oldElement.g < newElement.g) {
      this.minHeapify(index);
    }
  }

  /**
   * returns the node and index where the given node is located
   * @param node the nodes id will be used to compare and see if it is the same
   */
  find(node) {
    let foundNode: AStarNode;
    let index;

    for (let i = 0; i < this.heapSize(); i++) {
      if (this.heapArray[i].value.x === node.value.x && this.heapArray[i].value.y === node.value.y) {
        foundNode = this.heapArray[i];
        index = i;
        break;
      }
    }

    return { node: foundNode, index: index };
  }

  /**
   * fixes the minHeap by bubbling up
   */
  private bubbleUp(index) {
    let parent = this.parent(index);

    while (parent > 0) {
      parent = this.parent(index);
      if (parent && this.heapArray[index - 1].g < this.heapArray[parent - 1].g) {
        this.swap(index, parent);
        index = parent;
      } else {
        break;
      }
    }
  }

  /**
   * produces a min heap from an unordered array
   */
  private buildMinHeap() {
    for (let i = Math.floor(this.heapSize() / 2); i > 0; i--) {
      this.minHeapify(i);
    }

    return this.heapArray;
  }

  /**
   * Correct a single violation of the heap property
   * in a subtree's root
   *
   * ! precondition: Assume that the trees rooted at left(i)
   * ! and right(i) are min heaps
   */
  private minHeapify(index) {
    const left = this.left(index);
    const right = this.right(index);
    let smallest;

    if (
      left <= this.heapSize() &&
      this.heapArray[left - 1].g <
      this.heapArray[index - 1].g
    ) {
      smallest = left;
    } else {
      smallest = index;
    }

    if (
      right <= this.heapSize() &&
      this.heapArray[right - 1].g < this.heapArray[smallest - 1].g
    ) {
      smallest = right;
    }

    if (smallest !== index) {
      this.swap(smallest, index);
      this.minHeapify(smallest);
    }
  }

  public heapSize() {
    return this.heapArray.length;
  }

  private left(index: number) {
    return 2 * index;
  }

  private right(index: number) {
    return 2 * index + 1;
  }

  private parent(index: number) {
    return Math.floor(index / 2);
  }

  private swap(a, b) {
    const temp = this.heapArray[a - 1];
    this.heapArray[a - 1] = this.heapArray[b - 1];
    this.heapArray[b - 1] = temp;
  }
}
