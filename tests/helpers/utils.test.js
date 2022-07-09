const {
    success
} = require("../../src/helpers/utils");

/*
    Setup helpers/utils.js tests
*/

describe("helpers/utils.js", () => {
    test("success", () => {
        expect(success("success")).toEqual({ caption: "success", status: 1 });
        expect(success()).toEqual({ status: 1 });
        expect(success(undefined, { payload: "something" })).toEqual({ payload: { payload: "something" }, status: 1 });
    });
});
