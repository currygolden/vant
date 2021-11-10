/**
 * dom 节点处理
 */
export function removeNode(el: Node) {
  const parent = el.parentNode;

  if (parent) {
    parent.removeChild(el);
  }
}

export function insertNode(el: Node) {
  const parent = el.parentNode;

  if (parent) {
    parent.appendChild(el);
  }
}
