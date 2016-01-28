import "./res/index.less";

import Application from "./app/application";

const app = new Application();
window.app = app;

$(() => {
    app.placeAt(document.body);
    app.run();
});
