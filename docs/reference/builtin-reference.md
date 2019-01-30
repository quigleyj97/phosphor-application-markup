# Built-in Reference

For convenience, PAM supports some Phosphor widgets and properties out of the
box.

## Widgets

### `Panel`

A simple container widget that doesn't do any layout. You will need to use CSS
to arrange the children of a `Panel`.

### `BoxPanel`

A concrete container that lays out it's children using the Box Layout. Children
can be arranged using exact pixel sizes, or stretched to fit. See the
[`BoxLayout` properties](###BoxLayout) below for details.

### `SplitPanel`

A simple container with user-draggable splitters that appear between widgets.
This panel uses a simplified form of layout that only allows for relative sizes.

### `StackedPanel`

A container that displays all of it's children on top of one another. This is
useful for overlays.

### `TabPanel`

A container that uses tabs to show one child at a time.

## Properties

### Layout

Some properties are common to all layouts. This doesn't mean that all layouts
respect them.

#### `Layout.HorizontalAlignment`

How the widget should be aligned if it's smaller than it's container width. Can
be "left", "center", or "right".

See [the Phosphor docs](http://phosphorjs.github.io/phosphor/api/widgets/classes/layout.html#horizontalalignment)
for details.

#### `Layout.VerticalAlignment`

Ditto, but for the container height. Can be "top", "center", or "bottom".

See [the Phosphor docs](http://phosphorjs.github.io/phosphor/api/widgets/classes/layout.html#verticalalignment)
for details.

### BoxLayout

BoxLayout includes 2 attached properties:

#### `BoxLayout.SizeBasis`

A constant size in pixels for the child it's specified on.

#### `BoxLayout.Stretch`

How much this widget should stretch to fill available space.

### SplitLayout

SplitLayout defines a single attached property for relative stretch between
widgets, `SplitLayout.Stretch`.
