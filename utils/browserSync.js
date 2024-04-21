const bs = require("browser-sync");

exports.initialiseBrowserSync = () => {
  bs.init({
    proxy: "localhost:1234",
    port: 5000,
    files: [
        "./dist"
    ],
    watchOptions: {
      ignored: "./node_modules",
    },
    open: false,
    logLevel: "info",
  });
};

module.exports = {
  appName : 'browserSync: some_name_of_the_app',
  ...module.exports
};
