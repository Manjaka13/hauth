const {
    success,
    failure,
    hash,
    compare,
    isValidEmail,
    isValidPassword,
    isValidAppName,
    mongooseFormat,
    removeProtectedFields,
    isAdmin
} = require("../../src/helpers/utils");
const bcrypt = require("bcrypt");

/*
    Setup helpers/utils.js tests
*/

describe("helpers/utils.js", () => {

    test("success", () => {
        expect(success("succeeded")).toEqual({ caption: "succeeded", status: 1 });
        expect(success()).toEqual({ status: 1 });
        expect(success(undefined, { payload: "something" })).toEqual({ payload: { payload: "something" }, status: 1 });
    });

    test("failure", () => {
        expect(failure("fail")).toEqual({ caption: "fail", status: 0 });
        expect(failure()).toEqual({ caption: "An error occured", status: 0 });
        expect(failure(123)).toEqual({ caption: "An error occured", status: 0 });
    });

    test("hash", () => {
        const str = "123";
        let hashed = "";
        hash(str)
            .then((hashedStr) => {
                hashed = hashedStr;
                return bcrypt.hash(str);
            })
            .then((hashedStr) => {
                expect(hashed).toBe(hashedStr);
            });
        hash(str)
            .then((hashedStr) => {
                hashed = hashedStr;
                return bcrypt.hash(str + "4");
            })
            .then((hashedStr) => {
                expect(hashed).not.toBe(hashedStr);
            });
        hash()
            .catch((err) => {
                expect(err).toBe("Please provide a string to hash");
            });
    });

    test("compare", () => {
        const originalStr = "123";
        const hashed = "";
        hash(originalStr)
            .then((hashedStr) => {
                hashed = hashedStr;
                return compare(originalStr, hashed);
            })
            .then((same) => {
                expect(same).toBe(true);
            })
    });

    test("isValidEmail", () => {
        expect(isValidEmail("test@gmail.com")).toBeTruthy();
        expect(isValidEmail("a@a.co")).toBeTruthy();
        expect(isValidEmail("a@a.c")).not.toBeTruthy();
        expect(isValidEmail("aaa.c")).not.toBeTruthy();
        expect(isValidEmail("test@test")).not.toBeTruthy();
        expect(isValidEmail()).not.toBeTruthy();
        expect(isValidEmail(123)).not.toBeTruthy();
        expect(isValidEmail({ test: "123" })).not.toBeTruthy();
        expect(isValidEmail([])).not.toBeTruthy();
        expect(isValidEmail(false)).not.toBeTruthy();
    });

    test("isValidPassword", () => {
        expect(isValidPassword()).not.toBeTruthy();
        expect(isValidPassword(123)).not.toBeTruthy();
        expect(isValidPassword({ test: "123" })).not.toBeTruthy();
        expect(isValidPassword([])).not.toBeTruthy();
        expect(isValidPassword("")).not.toBeTruthy();
        expect(isValidPassword("az")).not.toBeTruthy();
        expect(isValidPassword("test")).toBeTruthy();
    });

    test("isValidAppName", () => {
        expect(isValidAppName()).not.toBeTruthy();
        expect(isValidAppName(123)).not.toBeTruthy();
        expect(isValidAppName({ test: "123" })).not.toBeTruthy();
        expect(isValidAppName([])).not.toBeTruthy();
        expect(isValidAppName("")).not.toBeTruthy();
        expect(isValidAppName("az")).not.toBeTruthy();
        expect(isValidAppName("test")).toBeTruthy();
    });

    test("mongooseFormat", () => {
        expect(mongooseFormat()).toBeNull();
        expect(mongooseFormat([])).toBeNull();
        expect(mongooseFormat("fsfsd")).toBeNull();
        expect(mongooseFormat({
            _doc: {
                _id: "zer",
                firstname: "test",
                password: "dfgfdfgd",
                confirmationId: "dfgkldf"
            }
        })).toEqual({
            id: "zer",
            firstname: "test",
            password: "dfgfdfgd",
            confirmationId: "dfgkldf"
        });
        expect(mongooseFormat({
            id: "zaeaz",
            firstname: "test",
            password: "dfgfdfgd",
            confirmationId: "dfgkldf"
        })).toEqual({
            id: "zaeaz",
            firstname: "test",
            password: "dfgfdfgd",
            confirmationId: "dfgkldf"
        });
    });

    test("removeProtectedFields", () => {
        expect(removeProtectedFields({
            id: "asdf",
            confirmationId: "dsflml",
            password: "fdsdf"
        })).toEqual({
            id: "asdf"
        });
        expect(removeProtectedFields([])).toBeNull();
        expect(removeProtectedFields(123)).toBeNull();
        expect(removeProtectedFields({})).toEqual({});
    });

    test("isAdmin", () => {
        expect(isAdmin()).not.toBeTruthy();
        expect(isAdmin(0)).not.toBeTruthy();
        expect(isAdmin({ level: 0 })).toBeTruthy();
        expect(isAdmin({ level: 1 })).toBeTruthy();
        expect(isAdmin({ level: 2 })).not.toBeTruthy();
        expect(isAdmin({ level: -7 })).not.toBeTruthy();
        expect(isAdmin({ test: "sersr" })).not.toBeTruthy();
    });
});
