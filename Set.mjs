/**
 * A class for maintaining a Set inside a list, where once can toggle membership
 */
export class Set {
    
    /**
     *  constructor()
     *  This creates and empty Set
     */
    constructor() {
        this.set = []
        this.length = this.set.length
        this.empty = this.length == 0
    }

    /**
     * toggle(v) - either include or remove the member
     * @param v the member to toggle
     */
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
    /**
     * contains(v) - does the set contain v
     * @param v 
     * @returns boolean
     */
    contains(v) { return this.set.indexOf(v) != -1; }
/**
 * insert(v) - include v in the set
 * @param v 
 */
    insert(v) {
        if(this.contains(v)) return;
        this.set.push(v);
        this.length = this.set.length
        this.empty = false
    }
/**
 * remove(v) - remove v from the set
 * @param v 
 */
    remove(v) {
        let i = this.set.indexOf(v);
        if(i == -1) return;
        this.set.splice(i, 1);
        this.length = this.set.length
        this.empty = this.length == 0
    }
}