// Get env
require("dotenv").config();
// Required external packages
const Express = require("express");
const cors = require("cors");
const database = require("./interfaces/mongooseInterface");
const { port } = require("./helpers/const");
// Routes
const docRoute = require("./routes/docRoute");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
// Middlewares
const jsonMiddleware = require("./middlewares/jsonMiddleware");
const { authMiddleware } = require("./middlewares/authMiddleware");

/*
    Server main entry
*/

// Setup server
const app = Express();

// Apply middlewares
app.use(cors());
app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());
app.use(jsonMiddleware);
app.use(authMiddleware);

// Setup routes
app.use(docRoute.path, docRoute.router);
app.use(userRoute.path, userRoute.router);
app.use(authRoute.path, authRoute.router);

// Connects to database
database.connect()
    .then(() => {
        // Awaiting for incoming request
        app.listen(port, () => {
            console.log(`HAuth running on port ${port}`);
        });
    })
    .catch(err => console.error(err));