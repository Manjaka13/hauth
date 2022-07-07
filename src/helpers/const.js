/*
    Export constants from here
*/

const port = process.env.PORT || 3001;
const databaseUrl = process.env.DATABASE_HOST;
const databaseName = process.env.DATABASE_NAME;
const master = process.env.MASTER || "manjaka.rajaonson@gmail.com";
const tokenSecret = process.env.TOKEN_SECRET;
const refreshSecret = process.env.REFRESH_SECRET;
const documentation = {
    "/": {
        access: "public",
        type: "GET",
        description: "Displays exhaustive list of all API routes and their parameters."
    },
    "user/get": {
        access: "master",
        type: "GET",
        description: "Gets all user list"
    },
    "user/create": {
        level: "public",
        type: "POST",
        description: "Creates new user",
        parameters: {
            "firstname": "String",
            "lastname": "String",
            "avatar": "String",
            "email": "String, required",
            "password": "String, required",
            "app": "String, required"
        }
    },
    "user/update": {
        level: "public",
        type: "PUT",
        description: "Updates user information",
        parameters: {
            "firstname": "String",
            "lastname": "String",
            "avatar": "String",
            "password": "String"
        },
        note: "The account id to be updated is extracted from provided token in authorization header"
    },
    "user/delete/:id": {
        level: "master",
        type: "DELETE",
        description: "Deletes user"
    }
};

module.exports = {
    master,
    port,
    databaseUrl,
    databaseName,
    documentation,
    tokenSecret,
    refreshSecret
};
