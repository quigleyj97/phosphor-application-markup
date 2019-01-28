import { BoxPanel, Panel, SplitPanel, StackedPanel, TabPanel, Widget, BoxLayout, Layout, SplitLayout } from "@phosphor/widgets";
import { DOMWrapper } from "./wrapper";
import { WidgetFactory } from "../factory";

/**
 * Register PAM default items to a factory.
 * 
 * This is called automatically for the global factory, but will need to be
 * manually called for anything else.
 *
 * @param factory The factory to register against
 */
export function RegisterDefaults(factory: WidgetFactory) {
    //#region DOM wrappers
    factory.registerWidget("Image", DOMWrapper("img"));
    factory.registerWidget("Label", DOMWrapper("label"));
    //#endregion

    //#region Phosphor panels and attached properties
    factory.registerProperty("Layout.HorizontalAlignment", {
        get: (owner) => Layout.getHorizontalAlignment(owner),
        set: (owner, value) => Layout.setHorizontalAlignment(owner, value as Layout.HorizontalAlignment)
    });
    factory.registerProperty("Layout.VerticalAlignment", {
        get: (owner) => Layout.getVerticalAlignment(owner),
        set: (owner, value) => Layout.setVerticalAlignment(owner, value as Layout.VerticalAlignment)
    });
    factory.registerWidget("BoxPanel", BoxPanel);
    factory.registerProperty("BoxLayout.SizeBasis", {
        get: (owner) => ""+BoxLayout.getSizeBasis(owner),
        set: (owner, value) => BoxLayout.setSizeBasis(owner, +value)
    });
    factory.registerProperty("BoxLayout.Stretch", {
        get: (owner) => ""+BoxLayout.getStretch(owner),
        set: (owner, value) => BoxLayout.setStretch(owner, +value)
    });
    factory.registerWidget("Panel", Panel);
    factory.registerWidget("SplitPanel", SplitPanel);
    factory.registerProperty("SplitLayout.Stretch", {
        get: (owner) => ""+SplitLayout.getStretch(owner),
        set: (owner, value) => SplitLayout.setStretch(owner, +value)
    });
    factory.registerWidget("StackedPanel", StackedPanel);
    factory.registerWidget("TabPanel", TabPanel);
    //#endregion

    // TODO: A set of more useful defaults
}
