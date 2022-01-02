const fetch = require("node-fetch");
const basics = require("../about/basics");
const social = require("../about/social");

describe("Check Links", () => {
    jest.setTimeout(10_000);

    it("website", async () => {
        const code = await fetch(basics.website).then((res) => res.status);
        expect(code).toBe(200);
    });
    it("github", async () => {
        const code = await fetch(social.GitHub).then((res) => res.status);
        expect(code).toBe(200);
    });
    it.skip("linkedin", async () => {
        const code = await fetch(social.LinkedIn).then((res) => res.status);
        expect(code).toBe(200); // always 999
    });
    it("facebook", async () => {
        const code = await fetch(social.Facebook).then((res) => res.status);
        expect(code).toBe(200);
    });
    it("instagram", async () => {
        const code = await fetch(social.Instagram).then((res) => res.status);
        expect(code).toBe(200);
    });
    it("twitter", async () => {
        const code = await fetch(social.Twitter).then((res) => res.status);
        expect(code).toBe(200);
    });
    it("telegram", async () => {
        const code = await fetch(social.Telegram).then((res) => res.status);
        expect(code).toBe(200);
    });
});
