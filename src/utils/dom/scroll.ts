type ScrollElement = HTMLElement | Window;

function isWindow(val: unknown): val is Window {
  return val === window;
}

// get nearest scroll element
// https://github.com/youzan/vant/issues/3823
const overflowScrollReg = /scroll|auto/i;

/**
 * 滚动逻辑统一处理
 * @description 获取滚动容器元素
 * @return {node}
 * 样式上有 scroll | overflow 的可能会产生滚动
 * 这里的功能前置需要了解 html 元素的各种距离
 */
export function getScroller(el: HTMLElement, root: ScrollElement = window) {
  let node = el;
  // 会一直递归到root
  while (
    node &&
    node.tagName !== 'HTML' &&
    node.tagName !== 'BODY' &&
    node.nodeType === 1 &&
    node !== root
  ) {
    const { overflowY } = window.getComputedStyle(node);
    if (overflowScrollReg.test(overflowY)) {
      return node;
    }
    node = node.parentNode as HTMLElement;
  }

  return root;
}

export function getScrollTop(el: ScrollElement): number {
  const top = 'scrollTop' in el ? el.scrollTop : el.pageYOffset;

  // iOS scroll bounce cause minus scrollTop
  return Math.max(top, 0);
}
/**
 * @description 设置Y 方向的滚动
 */
export function setScrollTop(el: ScrollElement, value: number) {
  if ('scrollTop' in el) {
    el.scrollTop = value;
  } else {
    el.scrollTo(el.scrollX, value);
  }
}

/**
 * @description 获取根元素的滚动距离
 */
export function getRootScrollTop(): number {
  return (
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

export function setRootScrollTop(value: number) {
  setScrollTop(window, value);
  setScrollTop(document.body, value);
}

// get distance from element top to page top or scroller top
export function getElementTop(el: ScrollElement, scroller?: HTMLElement) {
  if (isWindow(el)) {
    return 0;
  }

  const scrollTop = scroller ? getScrollTop(scroller) : getRootScrollTop();
  return el.getBoundingClientRect().top + scrollTop;
}

export function getVisibleHeight(el: ScrollElement) {
  if (isWindow(el)) {
    return el.innerHeight;
  }
  return el.getBoundingClientRect().height;
}

export function getVisibleTop(el: ScrollElement) {
  if (isWindow(el)) {
    return 0;
  }
  return el.getBoundingClientRect().top;
}
