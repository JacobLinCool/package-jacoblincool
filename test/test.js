import fetch from "node-fetch";
import JacobLinCool from "../index";

// test
describe("Check Links", () => {
    const { basics } = JacobLinCool;
    test("website", async () => {
        const code = await fetch(basics.website).then((res) => res.status);
        expect(code).toBe(200);
    });
    test("facebook", async () => {
        const code = await fetch(basics.social.facebook).then((res) => res.status);
        expect(code).toBe(200);
    });
    test("instagram", async () => {
        const code = await fetch(basics.social.instagram).then((res) => res.status);
        expect(code).toBe(200);
    });
    test("twitter", async () => {
        const code = await fetch(basics.social.twitter).then((res) => res.status);
        expect(code).toBe(200);
    });
    test("github", async () => {
        const code = await fetch(basics.social.github).then((res) => res.status);
        expect(code).toBe(200);
    });
    test("telegram", async () => {
        const code = await fetch(basics.social.telegram).then((res) => res.status);
        expect(code).toBe(200);
    });
});
