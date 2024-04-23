const bs = require("browser-sync");

exports.initialiseBrowserSync = () => {
  bs.init({
    proxy: "localhost:5050",
    port : 3333,
    files: [
        "./views/**/*.ejs",
        "./public/**/*.{css,js}"
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
