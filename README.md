# Phosphor Application Markup

[![docs](https://img.shields.io/badge/docs-PAM-green.svg?style=flat-square)](https://quigleyj97.github.io/phosphor-application-markup/api)
[![license](https://img.shields.io/github/license/quigleyj97/phosphor-application-markup.svg?style=flat-square)](https://github.com/quigleyj97/phosphor-application-markup/blob/master/LICENSE.md)

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

The equivalent JS code is long, and distracting. With PAM, you can focus on the
interactions behind the view, and use straight-forward, idomatic XAML for the
layout and components.

## Getting Started

To write PAM, use the widget names as tags. Each child will get added to widgets
with layouts, each upper-case attribute will be treated as an AttachedProperty,
and each lower-case attribute will get copied to the widget node.

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
const myWidget = loader.loadXml("<Panel />");
```

You can register custom properties and widgets using `WidgetFactory`. There's
a global factory pre-instantiated for convenience:

```ts
WidgetFactory.global.registerWidget("MyFancyWidget", MyFancyWidget);

WidgetFactory.global.registerProperty("MyProperty", MyAttachedProperty);
```

## Building

Building PAM is easy:

```bash
yarn
yarn build
yarn test
```

To build the kitchen sink example, follow these steps:

```bash
cd ./examples
yarn
yarn tsc
yarn webpack
```

You should now see the compiled output in /docs/example.