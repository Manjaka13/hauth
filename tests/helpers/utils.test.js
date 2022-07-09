const {
    formatData,
    formatDataList,
    protectData,
    isAdmin
} = require("../../src/helpers/utils");

describe("helpers/utils.js", () => {

    test("formatData", () => {
        const data1 = { id: 123 };
        const data2 = { _doc: { id: 123 } };
        const data3 = { _doc: { _id: 123 } };
        expect(formatData(data1)).toEqual(data1);
        expect(formatData(data2)).toEqual(data1);
        expect(formatData(data3)).toEqual({ _id: 123, ...data1 });
    });

    test("formatDataList", () => {
        const data1 = { id: 123 };
        const data2 = { _doc: { id: 123 } };
        const data3 = { _doc: { _id: 123 } };
        expect(formatDataList([data1, data1])).toEqual([data1, data1]);
        expect(formatDataList([data2, data2])).toEqual([data1, data1]);
        expect(formatDataList([data3, data3])).toEqual([{ _id: 123, ...data1 }, { _id: 123, ...data1 }]);
    });

    test("protectData", () => {
        const data0 = { app: "test" };
        const data1 = { ...data0, _id: 123 };
        const data2 = { ...data1, __v: 0 };
        const data3 = { ...data2, password: "fds" };
        const data4 = { ...data3, confirmationId: "dsf" };
        const data5 = { ...data4, createdAt: "dsf" };
        const data6 = { ...data5, updatedAt: "dsf" };
        const data7 = null;
        expect(protectData(data0)).toEqual(data0);
        expect(protectData(data1)).toEqual(data0);
        expect(protectData(data2)).toEqual(data0);
        expect(protectData(data3)).toEqual(data0);
        expect(protectData(data4)).toEqual(data0);
        expect(protectData(data5)).toEqual(data0);
        expect(protectData(data6)).toEqual(data0);
        expect(protectData(data7)).toBeNull();
    });

    test("isAdmin", () => {
        const data0 = { level: 0 };
        const data1 = { level: 1 };
        const data2 = { level: 2 };
        const data3 = { level: 3 };
        const data4 = { level: -7 };
        const data5 = {};
        const data6 = null;
        const data7 = "test";
        expect(isAdmin(data0)).toBeTruthy();
        expect(isAdmin(data1)).toBeTruthy();
        expect(isAdmin(data2)).not.toBeTruthy();
        expect(isAdmin(data3)).not.toBeTruthy();
        expect(isAdmin(data4)).not.toBeTruthy();
        expect(isAdmin(data5)).not.toBeTruthy();
        expect(isAdmin(data6)).not.toBeTruthy();
        expect(isAdmin(data7)).not.toBeTruthy();
    });
});