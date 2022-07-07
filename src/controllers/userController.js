const { success, failure } = require("../utils");
const userInterface = require("../interfaces/userInterface");

/*
    Controllers for user module
*/

const userController = {
    create: (req, res) => {
        const user = req.body;
        userInterface.create(user)
            .then((newUser) => res.json(success("User created", newUser)))
            .catch(err => res.json(failure(err)));
    },
    get: (req, res) => {
        userInterface.get()
            .then((accountList) => res.json(success("User list", accountList)))
            .catch(err => res.json(failure(err)));
    },
    update(req, res) {
        const { id } = req.params;
        const user = req.body;
        userInterface.update(id, user)
            .then(() => res.json(success("User information updated")))
            .catch(err => res.json(failure(err)));
    },
    delete(req, res) {
        const { id } = req.params;
        userInterface.delete(id)
            .then(() => res.json(success("User deleted")))
            .catch(err => res.json(failure(err)));
    }
};

module.exports = userController;
