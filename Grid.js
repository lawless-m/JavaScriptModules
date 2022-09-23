import { getData, byData, getFirstData, byDataFirst } from './Elements.js';

/*

A Grid is originally a set of Rows and Columns in an HTML table.

However it uses querySelectorAll so it will work with childNodes

*/

function float(txt) { if(txt == undefined || txt == '') return 0.0; try { return parseFloat(txt, 10); } catch(e) {}; return 0;}

/*
For entries matching data-${data} sum the value of those entries
*/
export function sum_by_data(data, nodes) {
    return byData(data, nodes).reduce((total, node) => { 
        return total + float(getData(data, node)); }
    , 0);
}

/*
for a set of nodes, 
extract the ones matching data-rn=rowgrp
then sum the first child nodes matching data-rc=coln
*/
export function sum_rowgrp_by_column(nodes, rowgrp, coln, data) {
    return byData('rg', nodes, rowgrp).reduce((total,row) => { 
        return total + float(getFirstData('c', row, coln, data)); }
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

export function byDataFirstInGroup(data, src, grp) {
    return byDataFirst(data, byDataFirst('rg', src, grp));
}
