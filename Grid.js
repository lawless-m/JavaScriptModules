import { tr, td, th } from '/JavaScriptModules/Elements.js';

import { combine, isObject } from './ObjTools.js';

import { float, int, isNumeric} from './Format.js';


const allowed_keys = ['.', ',', '-', 'Delete', 'Backspace', 'ArrowLeft', 'ArrowRight', 'Control', 'Tab', 'Shift', 'Alt', 'Cmd'];

/*

A Grid is originally a set of Rows and Columns in an HTML table.

However it uses querySelectorAll so it will work with childNodes

*/


HTMLElement.prototype.get = function(field) { 
    return this.getAttribute(`grid-${field}`);
}

HTMLElement.prototype.set = function(field, value, apply) { 
    this.setAttribute(`grid-${field}`, value);
    if(apply) {
        apply(this);
    }
    return this;
}

HTMLElement.prototype.setWithText = function(field, valtext, apply) { 
    this.set(field, valtext[0]);
    this.textContent = valtext[1];
    if(apply) {
        apply(this);
    }
    return this;
}

HTMLElement.prototype.setWithTextFirst = function(field, valtext, apply) { 
    return this.byFirst(field).setWithText(field, valtext, apply);
}


HTMLElement.prototype.by = function(field, value) { 
    return (value === undefined) ? 
        Array.from(this.querySelectorAll(`[grid-${field}]`))
        :
        Array.from(this.querySelectorAll(`[grid-${field}='${value}']`));
}

HTMLElement.prototype.byFirst = function(field, value) { 
    let els = this.by(field, value);
    if(els.length > 0) {
        return els[0];
    }
}

HTMLElement.prototype.byFirstInGroup = function(field, rg, value) { 
    return this.byFirst('rg', rg).byFirst(field, value);
}

HTMLElement.prototype.byDirty = function(counter) { 
    if(counter == undefined) {
        return this.by('dirty');
    } else {
        return this.byFirst('dirty', counter);
    }
}

HTMLElement.prototype.setDirty = function(counter, class_from) { 
    this.set('dirty', counter);
    this.classList.replace(class_from, 'dirty');
    return this;
}

HTMLElement.prototype.setClean = function(counter, class_to) { 
    let dirty = this.byDirty(counter);
    dirty.removeAttribute('grid-dirty');
    dirty.classList.replace('dirty', class_to);
    return dirty;
}

HTMLElement.prototype.float = function(field) { 
    return float(this.get(field));
}

HTMLElement.prototype.getFirst = function(col_field, col_value, field) { 
    return this.byFirst(col_field, col_value).get(field);
}

HTMLElement.prototype.getFirstFloat = function(col_field, col_value, field) { 
    return float(this.getFirst(col_field, col_value, field));
}

HTMLElement.prototype.next = function(field) { 
    let node = this.nextSibling;
    for(; node && node.get(field) == null; node = node.nextSibling);
    return node;
}

HTMLElement.prototype.prev = function(field) { 
    let node = this.previousSibling;
    for(; node && node.getAttribute && node.get(field) == null; node = node.previousSibling);
    return node;
}

HTMLElement.prototype.rowGroups = function(rg) { 
    return this.by('rg', rg);
}

HTMLElement.prototype.rowGroup = function(rg) { 
    return this.byFirst('rg', rg);
}

HTMLElement.prototype.byColNum = function(colnum) { 
    return this.byFirst('c', colnum);
}

HTMLElement.prototype.getRowGroup = function() { 
    let rg = this.get('rg');
    if(rg == undefined) {
        rg = this.parentNode.get('rg');
    }
    return rg;
}

HTMLElement.prototype.colNum = function() { 
    return this.get('c')
}

HTMLElement.prototype.row = function(rn) { 
    return this.byFirst('rn', rn);   
}

HTMLElement.prototype.rowNum = function() { 
    let rn = this.get('rn');
    if(rn == undefined) {
        rn = this.parentNode.get('rn');
    }
    return rn;
}

HTMLElement.prototype.column = function(colnum) { 
    return this.byFirst('c', colnum)
}

HTMLElement.prototype.columnInGroup = function(rg, colnum) { 
    return this.byFirst('rg', rg).column(colnum);
}

HTMLElement.prototype.sumByFields = function(fields) { 
    let sums = {}
    fields.forEach(field =>{
        sums[field] = this.sumBy(field);
    })
    return sums;
}

HTMLElement.prototype.reduceBy = function(fn, initval, field) { 
        return this.by(field).reduce(fn, initval);
}

HTMLElement.prototype.sumBy = function(field, apply) { 
    let sum = this.reduceBy((total, node) => { return total + node.float(field); }, 0, field);
    if(apply) {
        return apply(sum);
    }
    return sum;
}

HTMLElement.prototype.sumGroupsByColumn = function(rg, colnum, field) { 
    return this.by('rg', rg)
           .map(n=>n.byFirst('c', colnum))
           .reduce((total, cell) => { return total + cell.float(field)}, 0);
}

HTMLElement.prototype.select = function() { 
    let rng = new Range();
    if (this.childNodes.length > 0) {
        rng.setStartBefore(this.firstChild);
        rng.setEndAfter(this.firstChild);
        document.getSelection().addRange(rng);
    }
    return this;
}

HTMLElement.prototype.num_fields = function() { 
    return this.byFirst('fields').float('fields');
}

HTMLElement.prototype.field = function(colnum) { 
    return this.byFirst('fields').byFirst('c', colnum).get('field');
}

export function numeric_only(evt) {
    if(isNumeric(evt.key) || allowed_keys.indexOf(evt.key) != -1 || evt.key == 'Enter' || evt.ctrlKey) { return; }
    evt.preventDefault();
}

export function numeric_only_no_enter(evt) {
    if(isNumeric(evt.key) || allowed_keys.indexOf(evt.key) != -1 || evt.ctrlKey) { return; }
    evt.preventDefault();
}

export function numeric_entry(node) {
    node.innerText = node.innerText.replace(/\n/g, '').replace(',', '');
    if(node.innerText == '') {
        node.innerText = '0';
        return true;
    }
    if(!isNumeric(node.innerText)) {
        alert('Not a valid number');
        return false;
    }
    return true;
}

/*

given the entire grid, the list of groups and the data names of the cols

* column_totals(grid, groups, cols)
* @param grid - all the nodes
* @param groups - an array of the row group names (only uses the length)
* @param cols - the data-${col} names of the cols to sum
* @returns - the totals

*/


function dataise(data) {
    let dattr = {};
    if(isObject(data)) {
        Object.keys(data).forEach(k => {
            dattr[`grid-${k}`] = data[k];
        });
    }
    return dattr;
}

export function tdd(classes, data, txt, attrs){
    let dattr = combine(attrs, dataise(data));
    dattr.class = classes.join(' ');
    return td(dattr, txt);
}

export function trr(rn, rg, tds, data, attrs) {
    return tr(combine(dataise(combine(data, {'rn':rn, 'rg':rg})), attrs), tds);
}

export class TD {
    constructor() {
        this.data = {};
        this.text = '';
    }
}

export class TR {
    constructor(data, attrs) {
        this.data = data;
        this.tr = tr(combine(dataise(data), attrs));
        this.c = 0;
    }

    tdh(tagfn, classes, txt, data, attrs, apply) {

        let dattr = {'grid-c':this.c++};
        if(isObject(data)) {
            Object.keys(data).forEach(k => {
                dattr[`grid-${k}`] = data[k];
            });
        }
        let cl = classes.join(' ');
        if(cl != '') {
            dattr['class'] = classes.join(' ');    
        }
        
        dattr = combine(attrs, dattr)
        let t = tagfn(dattr, txt);
        if('colspan' in dattr) {
            this.c += dattr.colspan -1 ;
        }
        this.tr.append(t);
        if(apply) {
            apply(t);
        }

        return t;
    }

    td(classes, txt, data, attrs, apply) {
        return this.tdh(td, classes, txt, data, attrs, apply);
    }

    th(classes, txt, data, attrs, apply) {
        return this.tdh(th, classes, txt, data, attrs, apply);
    }


    applyByField(fn, field, value) {
        this.tr.by(field, value).forEach(fn)
    }

}
/*
export class Grid {
    
    constructor(columns, rows) {
        this.rows = Array.from({length:rows}, (x,i) => new Row(columns));
    }

    get nrows() {
        return this.rows.length;
    }

    get ncols() {
        return this.rows[0].cells.length;
    }

    asTable() {
        let _table = table();
        let _tr = tr();
        for(let c = 0; c < this.ncols; c++) {
            _tr.append(th());
        }
        _table.append(thead({}, [_tr]));
        let _tbody = tbody();
        for(let r = 0; r < this.nrows; r++) {    
            _tr = tr({'data-rn':r});
            for(let c = 0; c < this.ncols; c++) {
                _tr.append(td({'data-c':c}, c));
            }
            _tbody.append(_tr);
        }

        _table.append(_tbody);
        return _table;
    }
}
*/