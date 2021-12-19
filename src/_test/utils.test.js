const { sleep } = require("../utils");

describe("utils", () => {
    it("sleep", async () => {
        const start = Date.now();
        const val = await sleep(300, 123);
        const end = Date.now();
        expect(end - start).toBeGreaterThanOrEqual(300);
        expect(val).toBe(123);
    });
});
