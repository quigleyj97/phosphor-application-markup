import { WidgetFactory } from "./factory";
import { MessageLoop } from "@phosphor/messaging";
import { Widget } from "@phosphor/widgets";

/**
 * Injests some markup, and returns a widget
 */
export class MarkupLoader {
    private factory: WidgetFactory;

    constructor(factory = WidgetFactory.global) {
        this.factory = factory;
    }

    /**
     * Load some PAML as XML, returning a valid Phosphor widget.
     * 
     * ## Notes
     * 
     * The loader walks through the XML tree, breadth-first, to create a widget
     * matching the markup. For each element it encounters, it creates a
     * corresponding widget using the WidgetFactory, and then sets any attached
     * properties by looking for attributes that begin with an upper-case
     * letter.
     * 
     * Node attributes that begin with a lowercase letter are correspondingly
     * set on the DOM, including data-attrs.
     *
     * ### Caveats
     *
     * Phosphor attached properties are hacked in right now, as most of them
     * aren't publicly exposed.
     * 
     */
    public loadXml(input: string) {
        const reader = new DOMParser();
        let doc: Document;
        try {
            doc = reader.parseFromString(input, "application/xml");
        }
        catch (err) {
            console.error("[PAM- Loader]", "Failed to load XML- could not parse markup");
            throw err; // nothing better to do
        }
        const errorDoc = doc.getElementsByTagName("parsererror");
        if (errorDoc.length > 0) {
            // There's an error in the document, but the user agent was either
            // able to partially parse it or opted not to throw an error.
            console.error("[PAM- Loader]", "Failed to load XML- markup error");
            console.error(errorDoc);
            throw new Error("PAM: ParserError");
        }
        // Return the root element.
        return this.instantiateWidgetForNode(doc.documentElement);
    }

    private instantiateWidgetForNode(node: Element): Widget {
        const name = node.tagName;
        const widget = this.factory.createWidget(name);
        for (const attr of node.getAttributeNames()) {
            // assumption: non-null, since it was returned by getAttributeNames 
            const attrValue = node.getAttribute(attr)!;

            // if the attribute name begins with an uppercase letter, it's an
            // attached property
            if (attr[0].toLocaleUpperCase() === attr[0]) {
                const property = this.factory.getProperty(attr);
                // TODO: JS types need to be figured out.
                property.set(widget, attrValue);
            } else {
                widget.node.setAttribute(attr, attrValue);
            }
        }
        // This iterates through _all_ nodes, including text and comment nodes
        for (const childNode of node.childNodes) {
            // If it's a text node or a comment node, insert it directly into
            // the DOM.
            if (childNode instanceof Text || childNode instanceof Comment) {
                widget.node.appendChild(childNode);
                continue;
            }
            if (!(childNode instanceof Element)) {
                // TODO: Unsupported node- it's neither a comment nor text, but
                // it isn't an element either.
                // For security reasons, it's best not to copy unfamiliar things
                // though since this is an alpha, log it to the console for
                // later inspection
                console.warn("[PAM- Loader]", "Unsupported element enountered");
                console.log(childNode);
                console.log("This node will not be copied to HTML");
                continue;
            }
            // else it's a full node, process it
            try {
                const childWidget = this.instantiateWidgetForNode(childNode);
                // Message the widget about this new child
                const msg = new Widget.ChildMessage("child-added", childWidget);
                MessageLoop.postMessage(widget, msg);
            } catch (err) {
                // continue, but warn.
                console.warn("[PAM- Loader]", "Failed to create child node");
                console.warn(err);
            }
        }
        return widget;
    }
}
