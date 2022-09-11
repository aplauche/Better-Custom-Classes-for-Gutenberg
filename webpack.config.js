//WordPress config
const defaultConfig = require("@wordpress/scripts/config/webpack.config.js");

module.exports = {
  ...defaultConfig,
  entry: {
    index: "./src/index.js"
  },
};
