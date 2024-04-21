//#region Require statements 
const express = require('express');
const path = require('path');
const custom_bs = require('./utils/browserSync')
//#endregion

const app = express();
custom_bs.initialiseBrowserSync();

//#region Adding static files to app
app.use("/css", express.static('./public/css'));
app.use("/js", express.static('./public/js'));
app.use("/img", express.static('./public/img'));
app.use("/bootstrap", express.static('./node_modules/bootstrap/dist'));
//#endregion

//#region Configuring the app routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
//#endregion

app.listen(5050, () =>{
    console.log('App is listening on port 5050');
});