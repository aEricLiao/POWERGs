module.exports = {
  mode: "development",
  target: "node",
  entry: { helloMessage: './lambda/helloMessage/index.js' },
  output: {
    filename: 'indexBundle.js',
    path: __dirname + '/lambda/helloMessage',
    libraryTarget: 'commonjs2',
  },
  devtool: 'inline-source-map',
}
