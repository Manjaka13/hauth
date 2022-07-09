const mongoose = require("mongoose");
const { name, schema } = require("../schemas/account");

/*
    Model for the account collection
*/

module.exports = mongoose.model(name, new mongoose.Schema(schema, { timestamps: true }));
