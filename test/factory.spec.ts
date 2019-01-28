import { WidgetFactory } from "../src/factory";
import { Widget } from "@phosphor/widgets";
import { AttachedProperty } from "@phosphor/properties";

class DummyWidget extends Widget {}

describe("WidgetFactory", () => {
    let factory: WidgetFactory;

    beforeEach(() => {
        factory = new WidgetFactory();
    });

    test("should have a global factory already instantiated", () => {
        expect(WidgetFactory.global).toBeDefined();
    });

    test("Should be constructable without errors", () => {
        expect(factory).toBeDefined();
    });

    test("Should register and instantiate Widgets", () => {
        factory.registerWidget("Foo", DummyWidget);
        const instance = factory.createWidget("Foo");
        expect(instance).toBeDefined();
        expect(instance).toBeInstanceOf(DummyWidget);
    });

    test("Should not allow registering a widget twice", () => {
        factory.registerWidget("Foo", DummyWidget);
        expect(() => {
            factory.registerWidget("Foo", DummyWidget);
        }).toThrow(/already registered/);
    });

    test("Should error on retrieving unknown widgets", () => {
        expect(() => {
            factory.createWidget("test");
        }).toThrow(/not recognized/);
    })

    test("Should register and retrieve Attached Properties", () => {
        const prop = new AttachedProperty({
            name: "foo",
            create: () => null as any,
        });
        factory.registerProperty("Foo", prop);
        const retrievedProp = factory.getProperty("Foo");
        expect(retrievedProp).toBeDefined();
        expect(retrievedProp).toBe(prop); // strict
    });

    test("Should not allow properties with lowercase names", () => {
        expect(() => {
            factory.registerProperty("foo", null as any);
        }).toThrow(/uppercase letter/);
    });

    test("Should allow IAttachedProperties", () => {
        const notReallyAProp = {
            get: (owner: Widget) => "foo",
            set: (owner: Widget, value: string) => void 0
        };
        factory.registerProperty("Test", notReallyAProp);
        expect(factory.getProperty("Test")).toBe(notReallyAProp);
    })
});