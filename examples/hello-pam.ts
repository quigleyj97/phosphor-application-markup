/**
 * This is a cutesy hello world example to show off the API
 */

import * as doc from "./testdoc.xml";
import { MarkupLoader } from "../lib";
import { Widget } from "@phosphor/widgets";

// import css
import "@phosphor/widgets/style/index.css";
// only available on dev builds
import "@phosphor/default-theme/style/index.css";

const loader = new MarkupLoader();

fetch(doc as any as string)
.then(res => res.text())
.then(str => {
    const widget = loader.loadXml(str as any as string);
    widget.update();
    widget.node.style.width = "600px";
    widget.node.style.height = "600px";
    Widget.attach(widget, document.body);
})

