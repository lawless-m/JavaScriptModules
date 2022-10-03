// import { getData, byData, getDataFirst, byDataFirst, applyByData } from './Elements.js';

import { create, getData, getFloat, byData, getDataFirst, byDataFirst, byId, removeChildren, nbsp, table, thead, tbody, tr, th, td, select_node } from '/JavaScriptModules/Elements.js';
import { combine, isObject } from './ObjTools.js';
/*

A Grid is originally a set of Rows and Columns in an HTML table.

However it uses querySelectorAll so it will work with childNodes

*/

function float(txt) { if(txt == undefined || txt == '') return 0.0; try { return parseFloat(txt, 10); } catch(e) {}; return 0;}
function int(txt) { if(txt == undefined) return 0; try { return parseInt(txt, 10); } catch(e) {}; return 0;}

export function reduceByData(fn, initval, data, nodes, val) {
    return byData(data, nodes, val).reduce(fn, initval);
}

/*
For entries matching data-${data} sum the value of those entries
*/
export function sumByData(data, nodes, val) {
    return reduceByData((total, node) => { return total + float(getData(data, node)); }, 0, data, nodes, val);
}

export function applyByData(fn, data, nodes, val) {
    return byData(data, nodes, val).forEach(fn);
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
            let c = getData('c', cell);
            for(let grp = 0; grp < groups.length; grp++) {
                tots[grp][c] = sum_rowgrp_by_column(grid, grp, c, col);
            };
        });
    })

    return tots;
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
    return {'rn':row_number(e), 'rg':row_group(e), 'c':column_number(e)};
}

export function row_col_grp_field(header, e) {
    let rcgf = row_col_grp(e);
    rcgf.field = column_field(header, rcgf.c);
    return rcgf;
}

export function column_field(header, c) {
    try { return getData('field', byDataFirst('c', byDataFirst('fields', header.parentNode), c)); } catch {}
}

export function row_group(e) {
    try { return getFloat('rg', e.parentNode); } catch {};
}

export function row_number(e) {
    try { return getFloat('rn', e.parentNode); } catch {};
}

export function column_number(e) {
    try { return getFloat('c', e); } catch {};
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

    applyByData(fn, data, value) {
        byData(data, this.tr, value).forEach(fn)
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