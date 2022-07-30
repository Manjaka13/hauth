// Get env
require("dotenv").config();
const Express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const database = require("./services/mongoose");
const jwt = require("./services/jwt");
const { port } = require("./helpers/const");
const accountRoute = require("./routes/account");
const jsonCheck = require("./middlewares/jsonCheck");
const notFoundCheck = require("./middlewares/notFoundCheck");
const { getLoggedAccount, checkBannedAccount } = require("./middlewares/auth")(jwt);

/*
    Server main entry
*/

// Setup server
const app = Express();

// Apply middlewares
app.use(cors());
app.use(cookieParser());
app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());
app.use(jsonCheck);
app.use(getLoggedAccount);
app.use(checkBannedAccount);

// Setup routes
app.use(accountRoute.path, accountRoute.router);
app.use(notFoundCheck);

// Connects to database
database.connect()
    .then(() => {
        // Awaiting for incoming request
        app.listen(port, () => {
            console.log(`HAuth running on port ${port}`);
        });
    })
    .catch(err => console.error(err));