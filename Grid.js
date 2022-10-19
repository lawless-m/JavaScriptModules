import { tr, td, th } from '/JavaScriptModules/Elements.js';

import { combine, isObject } from './ObjTools.js';

import { float, int, isNumeric} from './Format.js';


const allowed_keys = ['.', ',', '-', 'Delete', 'Backspace', 'ArrowLeft', 'ArrowRight', 'Control', 'Tab', 'Shift', 'Alt', 'Cmd'];

/*

A Grid is originally a set of Rows and Columns in an HTML table.

However it uses querySelectorAll so it will work with childNodes

*/


HTMLElement.prototype.g_get = function(field) { 
    return this.getAttribute(`grid-${field}`);
}

HTMLElement.prototype.g_set = function(field, value, apply) { 
    this.setAttribute(`grid-${field}`, value);
    if(apply) {
        apply(this);
    }
    return this;
}

HTMLElement.prototype.g_setWithText = function(field, valtext, apply) { 
    this.g_set(field, valtext[0]);
    this.textContent = valtext[1];
    if(apply) {
        apply(this);
    }
    return this;
}

HTMLElement.prototype.g_setWithTextFirst = function(field, valtext, apply) { 
    return this.g_byFirst(field).g_setWithText(field, valtext, apply);
}


HTMLElement.prototype.g_by = function(field, value) { 
    return (value === undefined) ? 
        Array.from(this.querySelectorAll(`[grid-${field}]`))
        :
        Array.from(this.querySelectorAll(`[grid-${field}='${value}']`));
}

HTMLElement.prototype.g_byFirst = function(field, value) { 
    let els = this.g_by(field, value);
    if(els.length > 0) {
        return els[0];
    }
}

HTMLElement.prototype.g_byFirstInGroup = function(field, rg, value) { 
    return this.g_byFirst('rg', rg).g_byFirst(field, value);
}

HTMLElement.prototype.g_byDirty = function(counter) { 
    if(counter == undefined) {
        return this.g_by('dirty');
    } else {
        return this.g_byFirst('dirty', counter);
    }
}

HTMLElement.prototype.g_setDirty = function(counter, class_from) { 
    this.g_set('dirty', counter);
    this.classList.replace(class_from, 'dirty');
    return this;
}

HTMLElement.prototype.g_setClean = function(counter, class_to) { 
    let dirty = this.g_byDirty(counter);
    if(dirty.removeAttribute) {
        dirty.removeAttribute('grid-dirty');
        dirty.classList.replace('dirty', class_to);
    }
    
    return dirty;
}

HTMLElement.prototype.g_float = function(field) { 
    return float(this.g_get(field));
}

HTMLElement.prototype.g_getFirst = function(col_field, col_value, field) { 
    return this.g_byFirst(col_field, col_value).g_get(field);
}

HTMLElement.prototype.g_getFirstFloat = function(col_field, col_value, field) { 
    return float(this.g_getFirst(col_field, col_value, field));
}

HTMLElement.prototype.g_next = function(field) { 
    let node = this.nextSibling;
    for(; node && node.g_get(field) == null; node = node.nextSibling);
    return node;
}

HTMLElement.prototype.g_prev = function(field) { 
    let node = this.previousSibling;
    for(; node && node.getAttribute && node.g_get(field) == null; node = node.previousSibling);
    return node;
}

HTMLElement.prototype.g_rowGroups = function(rg) { 
    return this.g_by('rg', rg);
}

HTMLElement.prototype.g_rowGroup = function(rg) { 
    return this.g_byFirst('rg', rg);
}

HTMLElement.prototype.g_byColNum = function(colnum) { 
    return this.g_byFirst('c', colnum);
}

HTMLElement.prototype.g_getRowGroup = function() { 
    let rg = this.g_get('rg');
    if(rg == undefined) {
        rg = this.parentNode.g_get('rg');
    }
    return rg;
}

HTMLElement.prototype.g_colNum = function() { 
    return this.g_get('c')
}

HTMLElement.prototype.g_row = function(rn) { 
    return this.g_byFirst('rn', rn);   
}

HTMLElement.prototype.g_rowNum = function() { 
    let rn = this.g_get('rn');
    if(rn == undefined) {
        rn = this.parentNode.g_get('rn');
    }
    return rn;
}

HTMLElement.prototype.g_column = function(colnum) { 
    return this.g_byFirst('c', colnum)
}

HTMLElement.prototype.g_columnInGroup = function(rg, colnum) { 
    return this.g_byFirst('rg', rg).g_column(colnum);
}

HTMLElement.prototype.g_sumByFields = function(fields, condition) { 
    let sums = {}
    fields.forEach(field =>{
        sums[field] = this.g_sumBy(field, condition);
    })
    return sums;
}

HTMLElement.prototype.g_reduceBy = function(fn, initval, field) { 
        return this.g_by(field).reduce(fn, initval);
}

HTMLElement.prototype.g_sumBy = function(field, condition) {
    if(condition) {
        return this.g_reduceBy((total, node) => { 
            let s = total;
            if(condition(node)) {
                s += node.g_float(field);
            }
            return s;

            //return total + condition(node) ? node.g_float(field) : 0;
        }, 0, field);
    }
    return this.g_reduceBy((total, node) => { return total + node.g_float(field)}, 0, field);
}

HTMLElement.prototype.g_sumGroupsByColumn = function(rg, colnum, field) { 
    return this.g_by('rg', rg)
           .map(n=>n.g_byFirst('c', colnum))
           .reduce((total, cell) => { return total + cell.g_float(field)}, 0);
}

HTMLElement.prototype.g_select = function() { 
    let rng = new Range();
    if (this.childNodes.length > 0) {
        rng.setStartBefore(this.firstChild);
        rng.setEndAfter(this.firstChild);
        document.getSelection().addRange(rng);
    }
    return this;
}

HTMLElement.prototype.g_num_fields = function() { 
    return this.g_byFirst('fields').g_float('fields');
}

HTMLElement.prototype.g_field = function(colnum) { 
    return this.g_byFirst('fields').g_byFirst('c', colnum).g_get('field');
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
        this.tr.g_by(field, value).forEach(fn)
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