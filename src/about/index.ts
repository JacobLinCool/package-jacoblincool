import type { Chalk } from "chalk";
import { yellowBright, blueBright, greenBright, magentaBright, cyanBright } from "chalk";
import { format_kv, shuffle, typing } from "../utils";
import { box, line, center, sides } from "../format";
import basics from "./basics";
import social from "./social";
import skills from "./skills";
import education from "./education";

function* colorGenerator(): Generator<Chalk> {
    const colors = shuffle([yellowBright, blueBright, greenBright, magentaBright, cyanBright]);
    let i = 0;
    while (true) {
        yield colors[i++ % colors.length];
    }
}

const color = colorGenerator();

export default async function (delay: number): Promise<void> {
    console.log();
    await typing(
        box(
            [
                center(`Hello, I am ${yellowBright(basics.name)} (${basics.alias.map((a) => yellowBright(a)).join(", ")})!`),
                sides("Email: " + yellowBright(basics.email), "Website: " + yellowBright(basics.website)),
                line(100),
                "You Can Find Me On",
                ...format_kv(social, " | ").map((s) => `    ${color.next().value(s)}`),
                line(100),
                `I mainly create programs in ${
                    skills.programming_languages
                        .slice(0, -1)
                        .map((l) => color.next().value(l))
                        .join(", ") +
                    ", and " +
                    color.next().value(skills.programming_languages.slice(-1))
                }.`,
                line(100),
                `I have experience in developing applications using: `,
                ...format_kv(skills.tools, "\n        - ").map((s) => `    ${color.next().value(s)}`),
                line(100),
                `My Educations `,
                ...education
                    .sort((a, b) => b.since - a.since)
                    .map((edu) => {
                        const { name, since, graduation, note } = edu;
                        let str = color.next().value(`    ${name} (${since} - ${graduation || "Present"})`);
                        if (note) {
                            str += `\n        - ${note}`;
                        }
                        return str;
                    }),
            ].join("\n"),
        ),
        delay,
    );
    console.log("\n");
}
