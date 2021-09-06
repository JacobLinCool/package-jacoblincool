import JacobLinCool from "./index.js";

say();

async function say() {
    const msg = JacobLinCool.hello();
    const sentences = msg.split("\n");
    for (const sentence of sentences) {
        console.log(sentence);
        await new Promise((r) => setTimeout(r, 50 * sentence.length));
    }
}
