export class Queue<T>{
    array: T[]
    constructor() {
        this.array = []
    }
    // 添加元素
    push(element:T):boolean {
        this.array.push(element)
        return true
    }
    // 弹出元素
    pop():T{
        return this.array.splice(0, 1) as T
    }
    // 获取长度
    size():number {
        return this.array.length
    }
    // 获取最后的元素
    getTailItem():T|null {
        const len = this.array.length
        if(len <= 0) {
            return null
        }

        return this.array[len - 1]
    }
    // 清空队列
    clearQueue():boolean {
        this.array = []
        return true
    }
}
