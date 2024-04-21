const bs = require("browser-sync");

exports.initialiseBrowserSync = () => {
  bs.init({
    proxy: "localhost:5050",
    files: [
        "./public/**/*.{css,js}", 
        "./views/**/*.{ejs,html}"
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
