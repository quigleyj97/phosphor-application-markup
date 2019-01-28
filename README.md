# Phosphor Application Markup

PAM is an experimental framework for writing Phosphor widgets as XML markup.
This lets developers easily create complex components without needing to rely
on direct HTML manipulation or a VDOM library.

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