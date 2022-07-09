const { email, password, name } = require("../../src/services/validation");

describe("services/validation.js", () => {

    test("email", () => {
        const data0 = "test@test.com";
        const data1 = "a@a.a";
        const data2 = "a@a.co";
        const data3 = "";
        const data4 = 1231;
        const data5 = null;
        const data6 = "test@test.";

        expect(email(data0)).toBeTruthy();
        expect(email(data1)).not.toBeTruthy();
        expect(email(data2)).toBeTruthy();
        expect(email(data3)).not.toBeTruthy();
        expect(email(data4)).not.toBeTruthy();
        expect(email(data5)).not.toBeTruthy();
        expect(email(data6)).not.toBeTruthy();
    });

    test("password", () => {
        const data0 = null;
        const data1 = "";
        const data2 = "a";
        const data3 = "ab";
        const data4 = "abc";
        const data5 = 231;
        expect(password(data0)).not.toBeTruthy();
        expect(password(data1)).not.toBeTruthy();
        expect(password(data2)).not.toBeTruthy();
        expect(password(data3)).not.toBeTruthy();
        expect(password(data4)).toBeTruthy();
        expect(password(data5)).not.toBeTruthy();
    });

    test("name", () => {
        const data0 = null;
        const data1 = "";
        const data2 = 123;
        const data3 = "ab";
        const data4 = "ab1";
        const data5 = "he@llo";
        const data6 = "hello you";
        const data7 = "hello";
        expect(name(data0)).not.toBeTruthy();
        expect(name(data1)).not.toBeTruthy();
        expect(name(data2)).not.toBeTruthy();
        expect(name(data3)).not.toBeTruthy();
        expect(name(data4)).not.toBeTruthy();
        expect(name(data5)).not.toBeTruthy();
        expect(name(data6)).not.toBeTruthy();
        expect(name(data7)).toBeTruthy();
    })

});
