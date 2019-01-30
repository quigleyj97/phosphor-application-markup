import { Widget } from "@phosphor/widgets";

/**
 * A widget factory for PAM applications.
 * 
 * To add your own widgets and properties to the PAM markup, use this factory
 * to make them available to the parser.
 * 
 * For example, if you had a `PuppyWidget` that you wanted to use:
 * 
 * ```ts
 * WidgetFactory.global.registerWidget("Puppy", PuppyWidget);
 * ```
 * 
 * Now you can use your `PuppyWidget` in PAM:
 * 
 * ```xml
 *  <TabPanel>
 *      <Puppy />
 *      <Puppy />
 *  <TabPanel>
 * ```
 * 
 * You can name widgets whatever you like, as long as they are valid XML tag
 * names. That means you can have a `Dog.Puppy`, `_Puppy42`, and even `ಠ_ಠ` as
 * names!
 * 
 * #### Attached Properties
 * 
 * Attached Properties follow along the same lines as above, with one important
 * caveat: *All Attached Property names must begin with an uppercase character!*
 * This is to distinguish them from regular attributes, which are copied to the
 * HTML DOM node directly.
 * 
 * ```xml
 *  <TabPanel>
 *      <Puppy MyPuppyProp="5" /> <!--works-->
 *      <Puppy myOtherProp="3" /> <!--doesn't work-->
 *  </TabPanel>
 * ```
 * 
 * Another thing to keep in mind is that right now, AttachedProperties must be
 * strings. I hope to fix this sooner or later, but don't have a workaround
 * right now.
 */
export class WidgetFactory {
    private readonly ctorRegistry = new Map<string, WidgetFactory.ConstructorType>();
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
    public registerWidget(name: string, ctor: WidgetFactory.ConstructorType) {
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
     * 
     * TODO: Resolve value serialization
     *
     * @internal
    */
    export interface IAttachedProperty<T = Widget, U = string> {
        get(owner: T): U;
        set(owner: T, value: U): void; 
    }

    /** A convenience type to express a constructor in a covariant way.
     * 
     * @internal
     */
    export type ConstructorType = {
        new(...args: any[]): Widget
    }
}
