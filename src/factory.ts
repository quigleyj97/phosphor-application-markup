import { AttachedProperty } from "@phosphor/properties";
import { Widget } from "@phosphor/widgets";

/**
 * A widget factory for PAM applications.
 */
export class WidgetFactory {
    private readonly ctorRegistry = new Map<string, WidgetFactory.Constructor>();
    private readonly propRegistry = new Map<string, WidgetFactory.IAttachedProperty>();

    /**
     * Register a new widget into the factory.
     *
     * @param name What name this widget will be referenced by in the markup.
     * @param ctor The constructor for the widget being registered.
     * 
     * #### Notes
     *
     * The constructor should take no arguments.
     *
     * TODO: Should we add additional props for things like attribute validation
     * and has-children?
     * 
     * TODO: Should we perform normalization? HTML (and SGML in general) is
     * generally case insensitive, whereas XML is generally case sensitive. This
     * may cause problems, either in user understanding or interfacing with the
     * HTML DOM.
     */
    public registerWidget(name: string, ctor: WidgetFactory.Constructor) {
        if (this.ctorRegistry.has(name)) {
            throw Error("Widget " + name + " is already registered");
        }
        this.ctorRegistry.set(name, ctor);
    }

    /**
     * Register an attached property into the factory.
     * 
     * @param name What name this property will be referenced by.
     * @param prop The AttachedProperty being registered.
     * 
     * #### Notes
     * 
     * Attached property names **must** begin with an uppercase letter! This
     * allows the loader to differentiate between HTML attributes and attached
     * properties.
     * They must also be valid XML attribute names, but this function won't
     * check for that. Of note; attribute names _may_ include a dot.
     */
    public registerProperty(
        name: string,
        prop: WidgetFactory.IAttachedProperty)
    {
        if (this.propRegistry.has(name)) {
            throw Error("Property " + name + " is already registered");
        }
        // TODO: Is there a better way to check for upper-case-ness?
        if (name[0].toLocaleUpperCase() !== name[0]) {
            throw Error("Property name must begin with an uppercase letter");
        }
        this.propRegistry.set(name, prop);
    }

    /**
     * Instantiate a new widget from the factory.
     *
     * @param name The registered name of the widget to create
     */
    public createWidget(name: string): Widget {
        if (!this.ctorRegistry.has(name)) {
            throw Error("Widget " + name + " not recognized!");
        }
        return new (this.ctorRegistry.get(name)!)();
    }

    /**
     * Get an attached property from the factory.
     * 
     * @param name The registered name of the property
     */
    public getProperty(name: string): WidgetFactory.IAttachedProperty {
        if (!this.propRegistry.has(name)) {
            throw Error("Property " + name + " not recognized!");
        }
        return this.propRegistry.get(name)!;
    }
}
export namespace WidgetFactory {
    /** A default global factory for PAM */
    export const global = new WidgetFactory();

    /** A restricted interface for attached properties.
     *
     * This is necessary to work around the fact that many Phosphor framework
     * properties are not directly exposed- things like BoxLayout.Stretch are
     * implemented using this restricted interface.
    */
    export interface IAttachedProperty<T = unknown, U = unknown> {
        get(owner: T): U;
        set(owner: T, value: U): void; 
    }

    /** A convenience type to express a constructor in a covariant way */
    export type Constructor = {
        new(...args: any[]): Widget
    }
}
