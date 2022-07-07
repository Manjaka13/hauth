// Get env
require("dotenv").config();
// Require packages
const Express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const docRoute = require("./routes/docRoute");
const accountRoute = require("./routes/accountRoute");
const { port, databaseUrl, databaseName } = require("./helpers/const");

/*
    Server main entry
*/

// Setup server
const app = Express();

// Middlewares
app.use(cors());
app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());
app.use(docRoute.path, docRoute.router);
app.use(accountRoute.path, accountRoute.router);

// Get MongoDB ready
const url = `${databaseUrl}/${databaseName}`;
const options = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(url, options)
    .then(() => {
        console.log("Connected to MongoDB");
        // Awaiting for incoming request
        app.listen(port, () => {
            console.log(`HAuth running on port ${port}`);
        });
    });
