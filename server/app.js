const devMode = (process.env.NODE_ENV !== "production");

import express from "express";
import Path from "path";


// Express
const app = express();


// Client assets
let assetsPath = "/assets";
app.use(express.static("server/public", { maxAge: "365 days" }));
if (!devMode)
{
    // Production mode
    const assets = require("./public/assets/build.json");
    assetsPath = "/assets/" + assets.hash;
    app.use(assetsPath, express.static("server/public/assets", { maxAge: "365 days" }));
}
else
{
    // Development mode
    const webpack = require("webpack");
    const webpackDevMiddleware = require("webpack-dev-middleware");
    const webpackConfig = require("../webpack.config");
    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath
    }));
}
app.set("assets path", assetsPath);


// View engine setup
app.set("view engine", "jade");
app.set("views", Path.join(__dirname, "view"));

app.get("/", (req, res) => {
    res.render("index", { app, request: req });
});


// Exports
export default app;
