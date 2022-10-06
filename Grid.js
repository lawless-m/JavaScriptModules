import { create, 
    getData, getFloat, byData, 
    getDataFirst, byDataFirst, 
    byDataPrev, 
    setData, setDataText, setDataTextFirst, byDataNext,
    byId, removeChildren, nbsp, table, thead, tbody, tr, th, td, select_node
} from '/JavaScriptModules/Elements.js';

import { combine, isObject } from './ObjTools.js';

import { float, int, isNumeric} from './Format.js';


const allowed_keys = ['.', ',', '-', 'Delete', 'Backspace', 'ArrowLeft', 'ArrowRight', 'Control', 'Tab', 'Shift', 'Alt', 'Cmd'];

/*

A Grid is originally a set of Rows and Columns in an HTML table.

However it uses querySelectorAll so it will work with childNodes

*/


HTMLElement.prototype.get = function(field) { 
    return this.getAttribute(`g-${field}`);
}

HTMLElement.prototype.by = function(field, value) { 
    return (value === undefined) ? 
        Array.from(this.querySelectorAll(`[g-${field}]`))
        :
        Array.from(this.querySelectorAll(`[g-${field}='${value}']`));
}

HTMLElement.prototype.byFirst = function(field, value) { 
    let els = this.by(data, value);
    if(els.length > 0) {
        return els[0];
    }
}

HTMLElement.prototype.float = function(field) { 
    return float(this.get(field));
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

export function reduceByData(fn, initval, data, nodes, val) {
    return byData(data, nodes, val).reduce(fn, initval);
}

/*
For entries matching data-${data} sum the value of those entries
*/
export function sumByField(field, nodes, val) {
    return reduceByData((total, node) => { return total + node.get(field); }, 0, field, nodes, val);
}

export function applyByField(fn, field, nodes, val) {
    return byField(field, nodes, val).forEach(fn);
}

/*
for a set of nodes, 
extract the ones matching data-rn=rowgrp
then sum the first child nodes matching data-rc=coln
*/
export function sum_rowgrp_by_column(nodes, rowgrp, coln, data) {
    return byData('rg', nodes, rowgrp).reduce((total,row) => { 
        return total + float(getDataFirst('c', row, coln, data)); }
    , 0);
}

export function byRowGroup(nodes, rg) {
    return byData('rg', nodes, rg);
}

export function byRowGroupFirst(nodes, rg) {
    return byDataFirst('rg', nodes, rg);
}

export function getRowGroup(node) {
    let rg = getData('rg', node);
    if(rg == undefined) {
        rg = getData('rg', node.parentNode);
    }
    return rg;
}

export function byDirty(nodes, counter) {
    if(isNumeric(counter)) {
        return byDataFirst('dirty', nodes, counter);
    }
    return byData('dirty', nodes);
}

export function byField(field, nodes, value) {
    return byData(field, nodes, value);
}

export function getField(field, nodes, value) {
    return getData(field, nodes, value);
}

export function getFieldFloat(field, nodes, value) {
    return float(getData(field, nodes, value));
}

export function setField(field, node, value, apply) {
    return setData(field, node, value, apply);
}

export function setFieldText(field, node, valtext, apply) {
    return setDataText(field, node, valtext, apply)
}

export function setFieldTextFirst(field, node, valtext, apply) {
    return setDataTextFirst(field, node, valtext, apply)
}

export function setDirty(node, counter, class_from, class_to) {
    setData('dirty', node, counter);
    node.classList.replace(class_from, 'dirty');
}

export function setClean(nodes, counter, class_to) {
    let node = byDirty(nodes, counter);
    node.removeAttribute('data-dirty');
    node.classList.replace('dirty', class_to);
}

/*

given the entire grid, the list of groups and the data names of the cols

* column_totals(grid, groups, cols)
* @param grid - all the nodes
* @param groups - an array of the row group names (only uses the length)
* @param cols - the data-${col} names of the cols to sum
* @returns - the totals

*/

export function column_totals(grid, groups, cols) {
    let tots = {};
    for(let grp = 0; grp < groups.length; grp++) {
        tots[grp] = [];
    };

    let first_row = byData('rn', grid, 0)[0];

    cols.forEach(col => {
        byData(col, first_row).forEach(cell => { 
            let c = getColNum('c', cell);
            for(let grp = 0; grp < groups.length; grp++) {
                tots[grp][c] = sum_rowgrp_by_column(grid, grp, c, col);
            };
        });
    })

    return tots;
}

export function byColumnInGroup(nodes, rg, colnum) {
    return byColNum(byRowGroupFirst(nodes, rg), colnum);
}

export function byDataFirstInGroup(data, src, grp, dataval) {
    return byDataFirst(data, byDataFirst('rg', src, grp), dataval);
}

export function getRow(grid, rownum) {
    return byDataFirst('rn', grid, rownum);
}

function dataise(data) {
    let dattr = {};
    if(isObject(data)) {
        Object.keys(data).forEach(k => {
            dattr[`data-${k}`] = data[k];
        });
    }
    return dattr;
}

export function byColNum(nodes, colnum) {
    return byDataFirst('c', nodes, colnum);
}

export function byFieldNext(field, node) {
    return byDataNext(field, node);
}

export function byFieldPrev(field, node) {
    return byDataPrev(field, node);
}

export function byFieldFirst(field, nodes, value) {
    return byDataFirst(field, nodes, value);
}

export function tdd(classes, data, txt, attrs){
    let dattr = combine(attrs, dataise(data));
    dattr.class = classes.join(' ');
    return td(dattr, txt);
}

export function trr(rn, rg, tds, data, attrs) {
    return tr(combine(dataise(combine(data, {'rn':rn, 'rg':rg})), attrs), tds);
}

export function num_fields(header) {
    return getFloat('fields', byDataFirst('fields', header.parentNode));
}

export function row_col_grp(e) {
    return {'rn':getRowNum(e), 'rg':getRowGroup(e), 'c':getColNum(e)};
}

export function row_col_grp_field(header, e) {
    let rcgf = row_col_grp(e);
    rcgf.field = column_field(header, rcgf.c);
    return rcgf;
}

export function column_field(header, c) {
    try { return getData('field', byDataFirst('c', byDataFirst('fields', header.parentNode), c)); } catch {}
}


export function getRowNum(e) {
    try { return getData('rn', e.parentNode) } catch {};
}

export function getColNum(e) {
    try { return getData('c', e) } catch {};
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

    td(classes, txt, data, attrs, apply) {
        let dattr = {'data-c':this.c++};
        if(isObject(data)) {
            Object.keys(data).forEach(k => {
                dattr[`data-${k}`] = data[k];
            });
        }
        dattr['class'] = classes.join(' ');
        dattr = combine(attrs, dattr)
        let t = td(dattr, txt);
        if('colspan' in dattr) {
            this.c += dattr.colspan -1 ;
        }
        this.tr.append(t);
        if(apply) {
            apply(t);
        }
    }

    applyByField(fn, field, value) {
        byField(field, this.tr, value).forEach(fn)
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