import { WidgetFactory } from "./factory";
import { RegisterDefaults } from "./builtin";
import { MarkupLoader } from "./loader";

RegisterDefaults(WidgetFactory.global);

export {
    WidgetFactory,
    MarkupLoader,
    RegisterDefaults
};
