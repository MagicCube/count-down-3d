var devMode = (process.env.NODE_ENV !== "production");
if (devMode)
{
    const arg = process.argv[process.argv.length - 1];
    if (arg && arg.trim() === "-p")
    {
        devMode = false;
    }
}

const fs = require("fs");
const path = require("path");

const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// NOTE: All the paths defined in plugins are related to output.path.
const plugins = [
    new webpack.ProvidePlugin({
        "$": "jquery",
        "jQuery": "jquery",
        "THREE": "three",
        "mx": "mx6"
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: "vendor",
        filename: "./vendor/vendor.js",
        minChunks: Infinity
    }),
    new ExtractTextPlugin("./[name]/res/[name].css")
];


if (!devMode)
{
    plugins.push(function() {
        this.plugin("done", function(stats) {
            fs.writeFileSync(
                path.join(__dirname, "./server/public/assets/build.json"),
                JSON.stringify({
                    hash: stats.hash,
                    time: new Date().toString(),
                    timestamp: new Date() * 1
                })
            );
        });
    });
}


module.exports = {
    // This is the root of client source codes.
    context: path.join(__dirname, "./client"),
    entry: {
        vendor: [
            "jquery",
            "three",
            "mx6"
        ],
        cd: "./cd"
    },
    output: {
        // webpack-dev-server will server output.path as output.publicPath
        path: path.join(__dirname, "./server/public/assets/"),
        publicPath: "/assets/",
        filename: "[name]/[name].js",
        chunkFilename: "[id]/[id].js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
            },
            {
                test: /\.(png|jpg)$/,
                loader: "url-loader?limit=10240"
            },
            {
                test: /\.(ttf|eot|svg|woff)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader"
            }
        ]
    },
    plugins: plugins
};
