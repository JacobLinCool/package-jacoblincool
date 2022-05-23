import type { Chalk } from "chalk";
import type { TemplateType } from "../types";
import { tmpdir } from "os";
import { copyFileSync, existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, writeFileSync, mkdtempSync } from "fs";
import { resolve } from "path";
import { execSync } from "child_process";
import prompts from "prompts";
import chalk from "chalk";
import { clear_write, merge_object } from "../utils";

const template_dir = resolve(__dirname, "../templates");
const template_types: TemplateType[] = ["lib", "cli", "vue", "react"];

const template_colors: {
    [key in TemplateType]: Chalk;
} = {
    lib: chalk.cyanBright,
    cli: chalk.yellowBright,
    vue: chalk.greenBright,
    react: chalk.blueBright,
};

const actions: {
    [key in TemplateType]: () => Promise<void>;
} = {
    lib: async () => {
        clear_write(chalk`{cyanBright Initialing...}`);
        execSync(`pnpm init`);

        clear_write(chalk`{cyanBright Copying Files...}`);
        const template = resolve(template_dir, "lib");
        copy_dir(template, process.cwd(), ["package.json"]);

        clear_write(chalk`{cyanBright Merging package.json...}`);
        const merged = merge_object(
            JSON.parse(readFileSync(resolve(process.cwd(), "package.json"), "utf8")),
            JSON.parse(readFileSync(resolve(template, "package.json"), "utf8")),
        );
        writeFileSync(resolve(process.cwd(), "package.json"), JSON.stringify(merged, null, 4));

        clear_write(chalk`{cyanBright Installing Dependencies...}`);
        execSync(`pnpm i`);

        clear_write(chalk`{cyanBright Done!}`);
    },
    cli: async () => {
        console.log(chalk`{redBright Not Implemented, Fallback to lib template}`);
        return await actions.lib();
        clear_write(chalk`{cyanBright Initialing...}`);
        execSync(`pnpm init -y`);

        clear_write(chalk`{cyanBright Copying Files...}`);
        const template = resolve(template_dir, "cli");
        copy_dir(template, process.cwd(), ["package.json"]);

        clear_write(chalk`{cyanBright Merging package.json...}`);
        const merged = merge_object(
            JSON.parse(readFileSync(resolve(process.cwd(), "package.json"), "utf8")),
            JSON.parse(readFileSync(resolve(template, "package.json"), "utf8")),
        );
        writeFileSync(resolve(process.cwd(), "package.json"), JSON.stringify(merged, null, 4));

        clear_write(chalk`{cyanBright Installing Dependencies...}`);
        execSync(`pnpm i`);

        clear_write(chalk`{cyanBright Done!}`);
    },
    vue: async () => {
        console.log(chalk`{redBright Not Implemented, Fallback to lib template}`);
        return await actions.lib();
        clear_write(chalk`{cyanBright Initialing...}`);
        execSync(`pnpm init -y`);
        const temp = mkdtempSync(resolve(tmpdir(), "jacob-new-"));
        console.log("temp", temp);
        execSync(`pnpx -y degit antfu/vitesse . -f`, { cwd: temp });
        copy_dir(temp, process.cwd());

        clear_write(chalk`{cyanBright Overwriting Settings...}`);
        const pkg = JSON.parse(readFileSync(resolve(process.cwd(), "package.json"), "utf8"));
        const vitesse = JSON.parse(readFileSync(resolve(temp, "package.json"), "utf8"));
        delete pkg.scripts;
        delete vitesse.private;
        vitesse.scripts.format = `prettier --write '**/*.{js,ts,jsx,tsx,json,yml,yaml,md,html,vue}' '!dist'`;

        // clear_write(chalk`{cyanBright Merging package.json...}`);
        // const merged = merge_object(
        //     JSON.parse(readFileSync(resolve(process.cwd(), "package.json"), "utf8")),
        //     JSON.parse(readFileSync(resolve(template, "package.json"), "utf8")),
        // );
        // writeFileSync(resolve(process.cwd(), "package.json"), JSON.stringify(merged, null, 4));

        clear_write(chalk`{cyanBright Installing Dependencies...}`);
        execSync(`pnpm i`);

        clear_write(chalk`{cyanBright Done!}`);
    },
    react: async () => {
        console.log(chalk`{redBright Not Implemented, Fallback to lib template}`);
        return await actions.lib();
        clear_write(chalk`{cyanBright Initialing...}`);
        execSync(`pnpm init -y`);
        clear_write(chalk`{cyanBright Copying Files...}`);
        const template = resolve(template_dir, "react");
        copy_dir(template, process.cwd(), ["package.json"]);
        clear_write(chalk`{cyanBright Merging package.json...}`);
        const merged = merge_object(
            JSON.parse(readFileSync(resolve(process.cwd(), "package.json"), "utf8")),
            JSON.parse(readFileSync(resolve(template, "package.json"), "utf8")),
        );
        writeFileSync(resolve(process.cwd(), "package.json"), JSON.stringify(merged, null, 4));
        clear_write(chalk`{cyanBright Installing Dependencies...}`);
        execSync(`pnpm i`);
        clear_write(chalk`{cyanBright Done!}`);
    },
};

export default async function (pre_type?: string): Promise<void> {
    let project_type: TemplateType;
    if (pre_type) {
        project_type = pre_type as TemplateType;
    } else {
        const { type } = (await prompts([
            {
                type: "select",
                name: "type",
                message: "Select a project type",
                choices: template_types.map((type) => ({ title: template_colors[type](type), value: type })),
            },
        ])) as { type: TemplateType };
        project_type = type;
    }

    if (project_type in actions) {
        console.log(`Initializing a new ${template_colors[project_type](project_type)} project...`);
        await actions[project_type]();
        console.log(chalk`\n{greenBright Setup Successful!}`);
        console.log("Installed Dependencies:");
        execSync("pnpm ls", { stdio: "inherit" });
        console.log(chalk`\n{cyanBright scripts:}`);
        const pkg = JSON.parse(readFileSync(resolve(process.cwd(), "package.json"), "utf8"));
        for (const script of Object.entries(pkg.scripts as { [key: string]: string })) {
            console.log(chalk`    {yellowBright ${script[0]}}: ${script[1]}`);
        }
    } else {
        console.log(`Unknown template type: ${project_type}`);
    }
}

function copy_dir(src: string, dest: string, ignores: string[] = []): void {
    src = resolve(process.cwd(), src);
    dest = resolve(process.cwd(), dest);

    if (!existsSync(dest)) {
        mkdirSync(dest);
    }

    const files = readdirSync(src);
    for (const file of files) {
        if (ignores.includes(file)) {
            continue;
        }
        const src_file = resolve(src, file);
        const dest_file = resolve(dest, file);

        if (lstatSync(src_file).isDirectory()) {
            copy_dir(src_file, dest_file);
        } else {
            if (existsSync(dest_file)) {
                continue;
            }
            copyFileSync(src_file, dest_file);
        }
    }
}
