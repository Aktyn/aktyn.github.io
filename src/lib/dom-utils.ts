import { useEntryAnimations } from '~/hooks/useEntryAnimations'

type ParentCondition = (element: HTMLElement) => boolean

export function getParent(
  element: Element,
  condition: ParentCondition,
  recursive: false,
  includeSelf?: boolean,
): HTMLElement | null
export function getParent(
  element: Element,
  condition: ParentCondition,
  recursive: true,
  includeSelf?: boolean,
): Array<HTMLElement>
export function getParent(
  element: Element,
  condition: ParentCondition,
  recursive: boolean = false,
  includeSelf = false,
): HTMLElement | Array<HTMLElement> | null {
  let parent = includeSelf && element instanceof HTMLElement ? element : element.parentElement
  const result: Array<HTMLElement> = []

  while (parent) {
    if (condition(parent)) {
      if (!recursive) {
        return parent
      }
      result.push(parent)
    }
    parent = parent.parentElement
  }

  return recursive ? result : null
}

function isScrollable(element: HTMLElement) {
  const { overflow, overflowX, overflowY } = window.getComputedStyle(element)
  return /(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)
}

export function getScrollableParent(element: Element, recursive?: false): HTMLElement | null
export function getScrollableParent(element: Element, recursive: true): Array<HTMLElement>
export function getScrollableParent(
  element: Element,
  recursive?: boolean,
): HTMLElement | Array<HTMLElement> | null {
  return getParent(element, isScrollable, recursive as never)
}

function hasEntryAnimationAttribute(element: HTMLElement) {
  return useEntryAnimations.attributeNames.some((attribute) => element.hasAttribute(attribute))
}

export function getEntryAnimationParent(element: Element) {
  return getParent(element, hasEntryAnimationAttribute, false, true)
}
