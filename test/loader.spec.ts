import { MarkupLoader } from "../src/loader";
import { WidgetFactory } from "../src/factory";
import { Widget, Panel } from "@phosphor/widgets";
import { AttachedProperty } from "@phosphor/properties";
import { MessageLoop } from "@phosphor/messaging";

class DummyWidget extends Widget {
}

const DummyProp = new AttachedProperty({
    create: () => "42", // Note: for now, the only type we support are strings
    name: "Somebody Else's Problem",
})

describe("MarkupLoader", () => {
    let loader: MarkupLoader;
    let factory: WidgetFactory;

    beforeAll(() => {
        // add some test things into the factory
        factory = new WidgetFactory();
        factory.registerProperty("UltimateAnswer", DummyProp);
        factory.registerWidget("Dummy", DummyWidget);
        factory.registerWidget("Panel", Panel); // has children
    });

    beforeEach(() => {
        loader = new MarkupLoader(factory);
    })

    test("Should be constructable without errors", () => {
        expect(loader).toBeDefined();
    })

    test("Should load a simple markup", () => {
        const res = loader.loadXml("<Dummy />");
        expect(res).toBeDefined();
        expect(res).toBeInstanceOf(DummyWidget);
    });

    test("Should load a markup with attached properties", () => {
        const res = loader.loadXml('<Dummy UltimateAnswer="56" />');
        expect(res).toBeDefined();
        expect(DummyProp.get(res)).toEqual("56");
    });

    test("Should set HTML attributes from markup", () => {
        const res = loader.loadXml('<Dummy data-foo="I\'m real!" />');
        expect(res).toBeDefined();
        expect(res.dataset["foo"]).toEqual("I'm real!");
    });

    test("Should load a markup with text", () => {
        const res = loader.loadXml("<Dummy>Hello, world!</Dummy>");
        expect(res).toBeDefined();
        expect(res.node.textContent).toEqual("Hello, world!");
    });

    test("Should load a markup with children", () => {
        const res = loader.loadXml("<Panel><Dummy /></Panel>");
        MessageLoop.flush();
        expect(res).toBeDefined();
        expect(res).toBeInstanceOf(Panel);
        expect((res as Panel).widgets[0]).toBeInstanceOf(DummyWidget);
    });
})