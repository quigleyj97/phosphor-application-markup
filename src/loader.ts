import { WidgetFactory } from "./factory";
import { Widget, PanelLayout } from "@phosphor/widgets";

/**
 * Class for loading PAM markup and transforming it into a Phosphor widget.
 * 
 * PAM markup is relatively straight-forward, and is written in XML. A simple
 * view might look like this:
 * 
 * ```xml
 *  <BoxPanel>
 *      <Label BoxLayout.SizeBasis="10">Hello, world!</Label>
 *      <Image href="https://placekitten.com/g/300/300" />
 *  </BoxPanel>
 * ```
 * 
 * This creates a [`BoxPanel`](http://phosphorjs.github.io/phosphor/api/widgets/classes/boxpanel.html)
 * with a Label and an Image. The Label has an "Attached Property" specified-
 * `BoxLayout.SizeBasis` tells BoxLayout how big (in pixels) to make a
 * particular widget.
 * 
 * Element attributes in lowercase (such as data attributes and HTML attrs) get
 * copied to the DOM, so the `img` element of the `Image` widget above gets it's
 * `src` set.
 * 
 * See [the Builtin Reference](/phosphor-application-markup/reference/builtin-reference) for details on
 * what is included with base PAM
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
                // don't import the subtree if there is one
                const newNode = document.importNode(childNode, false);
                widget.node.appendChild(newNode);
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
            // TODO: What to do about DockLayout, GridLayout, SingletonLayout?
            // They don't follow this API and need some other behavior. Further,
            // since Phosphor provides no uniform way of adding a new child
            // (aside from implementing a common superclass, like PanelLayout),
            // there's no guarantee that third party widgets will play nice with
            // this assumption
            if ((node.children.length > 0) 
                && !(widget.layout instanceof PanelLayout))
            {
                console.info("[PAM- Loader]", "Skipping any children of node");
                console.info(node);
                console.info("Widget does not support PanelLayout");
            }
            try {
                const childWidget = this.instantiateWidgetForNode(childNode);
                (widget.layout! as PanelLayout).addWidget(childWidget);
            } catch (err) {
                // continue, but warn.
                console.warn("[PAM- Loader]", "Failed to create child node");
                console.warn(err);
            }
        }
        return widget;
    }
}
