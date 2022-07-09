const { answer, failure, success } = require("../../src/services/response");

describe("services/response.js", () => {

    test("answer", () => {
        const data = {
            caption: "test",
            payload: { data: "ssdfsdf" },
            status: 1
        };
        expect(answer(data.caption, data.payload, data.status)).toEqual(data);
        expect(answer(data.caption, data.payload, 0)).toEqual({ ...data, status: 0 });
        expect(answer(data.caption, data.payload)).toEqual({ ...data, status: 0 });
        expect(answer(data.caption)).toEqual({ ...data, payload: undefined, status: 0 });
        expect(answer()).toEqual({ caption: undefined, payload: undefined, status: 0 });
    });

    test("failure", () => {
        const data = {
            caption: "failed",
            status: 0,
            payload: undefined
        };
        expect(failure("failed")).toEqual(data);
        expect(failure("failed", { data: "dsfds" })).toEqual({ ...data, payload: { data: "dsfds" } });
        expect(failure()).toEqual({ caption: "An error occured", payload: undefined, status: 0 });
    });

    test("success", () => {
        const data = {
            caption: "success",
            status: 1,
            payload: undefined
        };
        expect(success("success")).toEqual(data);
        expect(success("success", { data: "dsfds" })).toEqual({ ...data, payload: { data: "dsfds" } });
        expect(success()).toEqual({ caption: undefined, payload: undefined, status: 1 });
    });

});