# Phosphor Application Markup

PAM is an experimental framework for writing Phosphor widgets as XML markup.
This lets developers easily create complex components without needing to rely
on direct HTML manipulation or a VDOM library.

## Why?

Here's a short motivating example:

```xml
<BoxPanel>
    <Label BoxLayout.SizeBasis="50"
           BoxLayout.Stretch="0">
        Hello, world!
    </Label>
    <BoxPanel BoxLayout.Stretch="1"
              data-direction="left-to-right">
        <Image href="https://placekitten.com/g/200/300"
               alt="Kitten"/>
        <Image href="http://place-puppy.com/200x200"
               alt="Pupper"/>
    </BoxPanel>
</BoxPanel>
```

[See a live example here](https://quigleyj97.github.io/phosphor-application-markup/demo.html)

The equivalent JS code for this is cumbersome, and repetitive:

```ts
class MyWidget extends Widget {
    public layout: SingletonLayout;

    constructor() {
        const panel = new BoxPanel();
        this.layout.widget = panel;
        const label = new Widget({node: document.createElement("label")});
        label.node.textContent = "Hello, world!";
        BoxLayout.setSizeBasis(label, 50);
        BoxLayout.setStretch(label, 0);
        panel.addWidget(label);
        const panel2 = new BoxPanel({direction: "left-to-right"});
        BoxLayout.setStretch(panel2, 1);
        const img1 = new Widget({node: document.createElement("img")});
        img1.href = "https://placekitten.com/g/200/300";
        img1.alt = "Kitten";
        const img2 = new Widget({node: document.createElement("img")});
        img2.href = "http://place-puppy.com/200x200";
        img2.alt = "Pupper";
        panel2.addWidget(img1);
        panel2.addWidget(img2);
        panel.addwidget(panel2);
        // whew!
    }
}
```

In the future, this library will offer facilities for data binding, but for now
it's just a demo.

## Getting Started

To write PAM, use the widget names as tags. Each child will get added to widgets
with layouts, each upper-case attribute will be treated as an AttachedProperty,
and each lower-case attribute will get copied to the widget node.

[Detailed documentation is available here.](https://quigleyj97.github.io/phosphor-application-markup/)

```xml
<TabPanel>
    <Label data-foobar="Test!">
        Here's some content!
    </Label>
    <Label>
        Isn't this fun?
    </Label>
</TabPanel>
```

To load the XML, instantiate a `MarkupLoader` and use it:

```ts
const loader = new MarkupLoader();
const myWidget = loader.loadXml("xml-string-here");
// Use myWidget as you like
```

You can register custom properties and widgets using `WidgetFactory`. There's
a global factory pre-instantiated for convenience:

```ts
WidgetFactory.global.registerWidget("MyFancyWidget", MyFancyWidget);

WidgetFactory.global.registerProperty("MyProperty", MyAttachedProperty);
```