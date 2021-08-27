const {inline, empty, block} = require('./htmlparser.js');
const pre = ["pre", "code", "samp", "kbd", "var"]
const white_space_styles = ["pre", "pre-wrap", "break-spaces"]
const display_styles = ["inline", "block", "inline-block"]

function is_all_ws(text){return !(/[^\t\n\r ]/.test(text))}

function is_ignorable( {node="", text}={} ){return (node === 'text') && is_all_ws(text)}

function node_before(sib){
    while ((sib = sib.previousSibling)) {
        if (!is_ignorable(sib)) return sib;
    }
    return null;
}

function node_after(sib){
    while ((sib = sib.nextSibling)) {
        if (!is_ignorable(sib)) return sib;
    }
    return null;
}

function last_child(par){
    while (par.child.length>0) {
        if (!is_ignorable(par.child[par.child.length-1])) return par.child[par.child.length-1];
        par.child.pop();
    }
    return null;
}

function first_child(par){
    while (par.child.length>0) {
        if (!is_ignorable(par.child[0])) {
            first_child(par.child[0])
        } else {
            par.child.shift();
        }
    }
    return null;
}

function removeSpaces(node){
    const {node:node_node, tag, style:{"white-space":ws="", "display":display=""}={}} = node
    if(pre.indexOf(tag) > -1 || white_space_styles.indexOf(ws)> -1 || node_node !== "element"){
        return
    }
    let nodeType = getNodeType(node.tag, display)

    if(nodeType === "block"&& node.child){
        while(is_ignorable(node.child[0])){
            node.child.shift();
        }
        if(node.child[0].node === "text"){
            node.child[0].text =
                node.child[0].text.replace(/^[\t\n\r ]+/, '');
        }
        while(is_ignorable(node.child[node.child.length-1])){
            node.child.pop();
        }

        if(node.child[node.child.length-1].node === "text"){
            node.child[node.child.length-1].text =
                node.child[node.child.length-1].text.replace(/[\t\n\r ]+$/, '');
        }
        const indexes_to_remove = []
        for(let i=1;i<node.child.length-1;i++){
            if(is_ignorable(node.child[i])){
                const {style:{"display":display_before=""}={}} = node.child[i-1]
                const {style:{"display":display_after=""}={}} = node.child[i+1]
                if(
                    getNodeType(node.child[i-1].tag,display_before) === "block" &&
                    getNodeType(node.child[i+1].tag,display_after) === "block"
                ){
                    indexes_to_remove.push(i)
                }else {
                    node.child[i].text = " ";
                }
            }
        }

        for(let j=indexes_to_remove.length-1;j>-1;j--){
            node.child.splice(indexes_to_remove[j], 1)
        }
    }
}

function getNodeType(tag, display){
    let nodeType = "";
    if(Object.keys(empty).indexOf(tag) > -1){
        nodeType = "empty"
    } else if(Object.keys(inline).indexOf(tag) > -1) {
        nodeType = "inline"
    } else if(Object.keys(block).indexOf(tag) > -1) {
        nodeType = "block"
    }
    if(display_styles.indexOf(display)>-1){
        nodeType = display;
    }
    return nodeType;
}

// function processSpaceTexts(node){
//     if(node.child && node.child.length>0) {
//         if (is_ignorable(node)){
//             node.text = " "
//         } else if(node.node === "root" || node.node === "element") {
//             const {tag, style:{"white-space":ws=""}={}} = node
//             if(pre.indexOf(tag) > -1 || white_space_styles.indexOf(ws)> -1 ){
//                 return
//             }
//             for (let i = 0; i < node.child.length; i++) {
//                 processSpaceTexts(node)
//             }
//         }
//     }
// }

function removeNonRenderingSpaces(node){
    if(node.child && node.child.length>0) {
        for (let i = 0; i < node.child.length; i++) {
            const child = node.child[i];
            const nodeType = getNodeType(node.tag)
            if(nodeType === "block" || node.node === "root") {
                removeNonRenderingSpaces(child);
            }
        }
    }
    removeSpaces(node)
}

function processNonRenderingSpaces(node){
    // processSpaceTexts(node)
    removeNonRenderingSpaces(node)
}

module.exports = {processNonRenderingSpaces}