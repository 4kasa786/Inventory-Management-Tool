// utils/TopKProducts.js
class MinHeap {
    constructor(k) {
        this.k = k;
        this.heap = [];
        this.indexMap = new Map(); // id -> index
    }

    _swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
        this.indexMap.set(this.heap[i].id, i);
        this.indexMap.set(this.heap[j].id, j);
    }

    _heapifyUp(index) {
        while (index > 0) {
            const parent = Math.floor((index - 1) / 2);
            if (this.heap[index].quantity >= this.heap[parent].quantity) break;
            this._swap(index, parent);
            index = parent;
        }
    }

    _heapifyDown(index) {
        const n = this.heap.length;
        while (true) {
            let smallest = index;
            const left = 2 * index + 1;
            const right = 2 * index + 2;

            if (left < n && this.heap[left].quantity < this.heap[smallest].quantity) {
                smallest = left;
            }
            if (right < n && this.heap[right].quantity < this.heap[smallest].quantity) {
                smallest = right;
            }
            if (smallest === index) break;
            this._swap(index, smallest);
            index = smallest;
        }
    }

    addOrUpdate(id, quantity) {
        if (this.indexMap.has(id)) {
            const index = this.indexMap.get(id);
            this.heap[index].quantity = quantity;
            this._heapifyUp(index);
            this._heapifyDown(index);
        } else {
            if (this.heap.length < this.k) {
                this.heap.push({ id, quantity });
                this.indexMap.set(id, this.heap.length - 1);
                this._heapifyUp(this.heap.length - 1);
            } else if (quantity > this.heap[0].quantity) {
                const removed = this.heap[0];
                this.indexMap.delete(removed.id);
                this.heap[0] = { id, quantity };
                this.indexMap.set(id, 0);
                this._heapifyDown(0);
            }
        }
    }

    remove(id) {
        if (!this.indexMap.has(id)) return;
        const index = this.indexMap.get(id);
        const last = this.heap.length - 1;

        this._swap(index, last);
        this.heap.pop();
        this.indexMap.delete(id);

        if (index < this.heap.length) {
            this._heapifyUp(index);
            this._heapifyDown(index);
        }
    }

    getTopK() {
        return [...this.heap]
            .sort((a, b) => b.quantity - a.quantity)
            .map(entry => entry.id);
    }

    getStatus() {
        const result = [...this.heap]
            .sort((a, b) => b.quantity - a.quantity)
            .map(entry => ({
                id: entry.id,
                quantity: entry.quantity
            }));

        return {
            tracked_products: result,
            count: result.length,
            warning: result.length === 0 ? 'TopK was reset (e.g., after restart)' : undefined
        };
    }

    rebuildFromData(dataArray) {
        this.heap = [];
        this.indexMap.clear();
        for (const { id, quantity } of dataArray) {
            this.addOrUpdate(id, quantity);
        }
    }
}

// Singleton manager
const TOP_K = parseInt(process.env.TOP_K_DEFAULT || '10');
const heap = new MinHeap(TOP_K);

export default heap;
