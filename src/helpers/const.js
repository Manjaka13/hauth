/*
    Export constants from here
*/

const port = process.env.PORT || 3001;
const databaseUrl = process.env.DATABASE_HOST;
const databaseName = process.env.DATABASE_NAME;
const master = process.env.MASTER || "manjaka.rajaonson@gmail.com";
const tokenSecret = process.env.TOKEN_SECRET;
const documentation = {
    "/": {
        access: "public, no login",
        type: "GET",
        description: "The current API documentation."
    },
    "user/get": {
        access: "master, needs login",
        type: "GET",
        description: "Gets all accounts in master's app"
    },
    "user/create": {
        access: "public, no login",
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
        access: "public, needs login",
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
        access: "master, needs login",
        type: "DELETE",
        description: "Deletes user",
        node: "Can not self delete"
    },
    "user/confirm/:id": {
        access: "public, needs password",
        type: "POST",
        description: "Confirms user account",
        parameters: {
            "app": "String, required",
            "password": "String, required"
        },
    },
    "login": {
        access: "public, no login",
        type: "POST",
        description: "Logs user in, returns user with token",
        parameters: {
            "email": "String, required",
            "password": "String, required",
            "app": "String, required"
        },
    },
    "verify": {
        access: "public, no login",
        type: "POST",
        description: "Verifies given token (in Authorization bearer or body)",
        parameters: {
            "token": "String, required"
        }
    }
};

module.exports = {
    master,
    port,
    databaseUrl,
    databaseName,
    documentation,
    tokenSecret
};
