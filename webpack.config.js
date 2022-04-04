module.exports = {
    mode: 'production',
    entry: "./build/index.js",
    output: {
        filename: "main.js",
        path: __dirname + "/dist"
    },
}