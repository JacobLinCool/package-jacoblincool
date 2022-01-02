function box(content) {
    const console_width = process.stdout.columns;
    const line_width = console_width - 4;

    const lines = content.split("\n");

    let output = "#".repeat(console_width) + "\n";
    for (let line of lines) {
        const splitted = split_line(line, line_width);
        for (let i = 0; i < splitted.length; i++) {
            output += `# ${splitted[i] + " ".repeat(line_width - print_width(splitted[i]))} #\n`;
        }
    }
    output += "#".repeat(console_width);

    return output;
}

function left(str, width = process.stdout.columns - 4) {
    return str + " ".repeat(width - print_width(str));
}

function right(str, width = process.stdout.columns - 4) {
    return " ".repeat(width - print_width(str)) + str;
}

function center(str, width = process.stdout.columns - 4) {
    const pad_left = Math.floor((width - print_width(str)) / 2);
    const pad_right = width - print_width(str) - pad_left;
    return " ".repeat(pad_left) + str + " ".repeat(pad_right);
}

function sides(str1, str2, width = process.stdout.columns - 4, fallback = right) {
    if (print_width(str1) + print_width(str2) + 1 > width) {
        return fallback(str1, width) + fallback(str2, width);
    } else {
        return str1 + " ".repeat(width - print_width(str1) - print_width(str2)) + str2;
    }
}

function line(percent = 100, width = process.stdout.columns - 4) {
    return center("-".repeat(Math.floor((percent / 100) * width)));
}

function remove_ansi(str) {
    return str.replace(/\u001B\[[0-9;]*m/g, "");
}

function print_width(str) {
    str = remove_ansi(str);

    let double = 0;
    for (let i = 0; i < str.length; i++) {
        if (str.codePointAt(i) > 255) {
            double++;
        }
    }
    return str.length + double;
}

function split_line(str, width = process.stdout.columns) {
    const lines = [];

    let count = 0,
        last_escape = "";
    for (let i = 0; i < str.length; i++) {
        const matches = [...str.substring(i).matchAll(/\u001B\[[0-9;]*m/g)];

        if (lines[Math.floor(count / width)] === undefined) {
            lines[Math.floor(count / width)] = last_escape + "";
        }

        if (matches.length && matches[0].index === 0) {
            last_escape = str.substring(i, i + matches[0][0].length);
            lines[Math.floor(count / width)] += last_escape;
            i += last_escape.length - 1;
        } else {
            const char = str.substring(i, i + 1);
            lines[Math.floor(count / width)] += char;
            count += char.codePointAt(0) > 255 ? 2 : 1;
        }

        if (count > 0 && count % width === 0) {
            lines[Math.floor((count - 1) / width)] += "\u001B[0m";
        }
    }

    if (lines[lines.length - 1] && print_width(lines[lines.length - 1]) === 0) {
        lines.pop();
    }

    return lines;
}

module.exports = { box, left, right, center, sides, line, remove_ansi, split_line };
