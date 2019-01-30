import { readFileSync } from "fs";
import { MarkupLoader } from "../src";
import { MessageLoop } from "@phosphor/messaging";

describe("Integration test", () => {
    let file: string;

    beforeAll(() => {
        file = readFileSync("./examples/testdoc.xml", {encoding: "utf8"});
    })

    test("Should render the HelloWorld example", () => {
        let loader = new MarkupLoader();
        const out = loader.loadXml(file);
        MessageLoop.flush();
        expect(out.node.outerHTML).toMatchSnapshot();
    })
})