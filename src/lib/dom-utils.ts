export function getScrollableParent(element: Element, recursive?: false): HTMLElement | null
export function getScrollableParent(element: Element, recursive: true): Array<HTMLElement>
export function getScrollableParent(
  element: Element,
  recursive: boolean = false,
): HTMLElement | null | Array<HTMLElement> {
  let parent = element.parentElement
  const result: Array<HTMLElement> = []

  while (parent) {
    const { overflow, overflowX, overflowY } = window.getComputedStyle(parent)
    if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
      if (!recursive) {
        return parent
      }
      result.push(parent)
    }
    parent = parent.parentElement
  }

  return recursive ? result : null
}
