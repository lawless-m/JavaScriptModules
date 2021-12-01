export class Set {
    
    constructor() {
        this.set = []
        this.length = this.set.length
        this.empty = this.length == 0
    }

    toggle(v) {
        let i = this.set.indexOf(v);
        if (i == -1) {
            this.set.push(v);
            this.length = this.set.length
            this.empty = false
        } else {
            this.set.splice(i, 1);
            this.length = this.set.length
            this.empty = this.length == 0
        }
    }

    contains(v) { return this.set.indexOf(v) != -1; }

    insert(v) {
        if(this.contains(v)) return;
        this.set.push(v);
        this.length = this.set.length
        this.empty = false
    }

    remove(v) {
        let i = this.set.indexOf(v);
        if(i == -1) return;
        this.set.splice(i, 1);
        this.length = this.set.length
        this.empty = this.length == 0
    }
}