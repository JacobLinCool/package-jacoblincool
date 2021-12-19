const { yellowBright, blueBright, greenBright, magentaBright, cyanBright } = require("chalk");
const basics = require("./basics");
const social = require("./social");
const skills = require("./skills");
const education = require("./education");

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function* colorGenerator() {
    const colors = shuffle([yellowBright, blueBright, greenBright, magentaBright, cyanBright]);
    let i = 0;
    while (true) {
        yield colors[i++ % colors.length];
    }
}

const color = colorGenerator();

module.exports = function () {
    console.log();
    console.log(
        [
            `Hello, I am ${yellowBright(basics.name)} (${basics.alias.map((a) => yellowBright(a)).join(", ")})! `,
            `Contact me at ${yellowBright(basics.email)}, or check out my website at ${yellowBright(basics.website)}.`,
            "You can also find me on these platforms:",
            ...Object.entries(social).map(([key, value]) => `    ${key}: ${color.next().value(value)}`),
            `I know how to program in ${skills.programming_languages.map((l) => color.next().value(l)).join(", ")}.`,
            `I have experience of developing using ${skills.tools.map((t) => color.next().value(t)).join(", ")}.`,
        ].join("\n")
    );
    console.log();
};
