/*
    Export constants from here
*/

const port = process.env.PORT || 3001;
const databaseUrl = process.env.DATABASE_HOST;
const databaseName = process.env.DATABASE_NAME;
const documentation = {
    "/": {
        type: "GET",
        description: "Displays exhaustive list of all API routes and their parameters."
    },
    "account": {
        type: "GET",
        description: "Gets all account list"
    },
    "account/create": {
        type: "POST",
        description: "Creates new account",
        parameters: {
            "firstname": "String",
            "lastname": "String",
            "avatar": "String",
            "email": "String, required",
            "password": "String, required",
            "app": "String, required"
        }
    },
    "account/:id": [
        {
            type: "PUT",
            description: "Updates account information",
            parameters: {
                "firstname": "String",
                "lastname": "String",
                "avatar": "String",
                "password": "String"
            }
        },
        {
            type: "DELETE",
            description: "Deletes account"
        }
    ]
};

module.exports = {
    port,
    databaseUrl,
    databaseName,
    documentation
};
