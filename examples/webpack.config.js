const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./hello-pam.js",
    mode: process.env.NODE_ENV || "development",
    output: {
        path: resolve(__dirname, "..", "docs"),
        filename: "demo.bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" }
                ]
            },
            {
                test: /\.(xml|png|jpg)$/,
                loader: "file-loader"
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "demo.html"
        })
    ]
}
