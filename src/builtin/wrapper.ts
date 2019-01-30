import { Widget } from "@phosphor/widgets";

/**
 * @internal
 * A type for widgets with a particular node type
 */
export type TypedNodeWidget<T extends HTMLElement> = Widget & {node: T};

/**
 * @internal
 * A function that generates a widget wrapper for a given HTML element.
 */
export function DOMWrapper<K extends keyof HTMLElementTagNameMap>(
    elName: K
): {new(...args: any[]): TypedNodeWidget<HTMLElementTagNameMap[K]>} {
    type ElementType = HTMLElementTagNameMap[K];
    return class extends Widget {
        //@ts-ignore TS2564 This is set by the Widget constructor
        public readonly node: ElementType;

        constructor() {
            super({node: document.createElement(elName)});
        }
    }
}
