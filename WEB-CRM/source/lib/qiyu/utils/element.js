
/**
 * 计算两个节点之间的偏移量
 * @description 计算节点from到节点to(外层需要定位属性)的距离，如果没有指定节点，默认计算根节点（搬运自nej）
 * @param  {String|Node} arg0 - 起始节点
 * @param  {String|Node} arg1 - 结束节点，没有该参数则计算到根节点
 * @return {Object}             偏移量，如{x:234,y:987}
 */
export const getOffset = function(from, to) {
    if (!from || !to) {
        return null;
    }
    var node = from,
        result = { x: 0, y: 0 },
        isroot, delta, border;
    while (!!node && node != to) {
        isroot = node === document.body || node == from;
        delta = isroot ? 0 : node.scrollLeft;
        border = parseInt(getComputedStyle(node, 'borderLeftWidth')) || 0;
        result.x += node.offsetLeft + border - delta;
        delta = isroot ? 0 : node.scrollTop;
        border = parseInt(getComputedStyle(node, 'borderTopWidth')) || 0;
        result.y += node.offsetTop + border - delta;
        node = node.offsetParent;
    }
    return result;
};

/**
 * 通过类名获取最近的祖先节点    
 * @param  {element} node      
 * @param  {string} className
 * @return {void} 
*/
export const getFirstAncestorByClass = (node, className) => {
    if (node == document.body) {
        return null;
    } else {
        var parent = node.parentNode;
        if (parent.classList.contains(className)) {
            return parent;
        } else {
            return getFirstAncestorByClass(parent, className);
        }
    }
};