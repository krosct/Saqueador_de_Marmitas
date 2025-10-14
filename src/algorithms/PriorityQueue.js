class PriorityQueue {
    constructor() {
        this.heap = [];
    }

    getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }

    getLeftChildIndex(index) {
        return 2 * index + 1;
    }

    getRightChildIndex(index) {
        return 2 * index + 2;
    }

    swap(index1, index2) {
        const temp = this.heap[index1];
        this.heap[index1] = this.heap[index2];
        this.heap[index2] = temp;
    }

    heapifyUp() {
        let currentIndex = this.heap.length - 1;

        while (currentIndex > 0) {
            const parentIndex = this.getParentIndex(currentIndex);
            
            if (this.heap[parentIndex].priority <= this.heap[currentIndex].priority) {
                break;
            }

            this.swap(currentIndex, parentIndex);
            currentIndex = parentIndex;
        }
    }

    heapifyDown() {
        let currentIndex = 0;

        while (this.getLeftChildIndex(currentIndex) < this.heap.length) {
            let smallestChildIndex = this.getLeftChildIndex(currentIndex);
            const rightChildIndex = this.getRightChildIndex(currentIndex);

            if (rightChildIndex < this.heap.length && 
                this.heap[rightChildIndex].priority < this.heap[smallestChildIndex].priority) {
                smallestChildIndex = rightChildIndex;
            }

            if (this.heap[currentIndex].priority <= this.heap[smallestChildIndex].priority) {
                break;
            }

            this.swap(currentIndex, smallestChildIndex);
            currentIndex = smallestChildIndex;
        }
    }

    enqueue(element, priority) {
        const queueElement = { element, priority };
        this.heap.push(queueElement);
        this.heapifyUp();
    }

    dequeue() {
        if (this.isEmpty()) return null;
        
        const min = this.heap[0].element;
        const last = this.heap.pop();
        
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this.heapifyDown();
        }
        
        return min;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    peek() {
        if (this.isEmpty()) return null;
        return this.heap[0].element;
    }

    clear() {
        this.heap = [];
    }
}