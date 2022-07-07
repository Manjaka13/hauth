/*
    Export constants from here
*/

const port = process.env.PORT || 3001;
const databaseUrl = process.env.DATABASE_HOST;
const databaseName = process.env.DATABASE_NAME;
const master = process.env.MASTER || "manjaka.rajaonson@gmail.com";
const documentation = {
    "/": {
        type: "GET",
        description: "Displays exhaustive list of all API routes and their parameters."
    },
    "user": {
        type: "GET",
        description: "Gets all user list"
    },
    "user/create": {
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
    "user/:id": [
        {
            type: "PUT",
            description: "Updates user information",
            parameters: {
                "firstname": "String",
                "lastname": "String",
                "avatar": "String",
                "password": "String"
            }
        },
        {
            type: "DELETE",
            description: "Deletes user"
        }
    ]
};

module.exports = {
    master,
    port,
    databaseUrl,
    databaseName,
    documentation
};
