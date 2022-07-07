/*
    Export constants from here
*/

const port = process.env.PORT || 3001;
const databaseUrl = process.env.DATABASE_HOST;
const databaseName = process.env.DATABASE_NAME;

module.exports = {
    port,
    databaseUrl,
    databaseName
};
