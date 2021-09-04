import basics from "./src/basics.js";
import background from "./src/background.js";
import skills from "./src/skills.js";

function hello() {
    let message = "";
    // 年紀有可能會因月份而與實際年齡有差異
    const age = new Date().getFullYear() - +basics.birth;
    message += `嗨，我是來自 ${basics.hometown} 的${basics.name}，今年 ${age} 歲！︁ \n`;

    const graduated = background.education.filter((school) => school.graduation).map((school) => school.name);
    const studying = background.education.find((school) => !school.graduation);
    const hsnu = background.education.find((x) => x.name.includes("附屬高級中學"));
    message += `我畢業於${listArray(graduated)}，從 ${studying.since} 年開始於${studying.name}就讀。 \n`;
    message += `順帶一提，我是 ${hsnu.details.class} 班的。 \n`;

    const favorite_lang = skills.programming_languages[0];
    const other_langs = skills.programming_languages.slice(1);
    const level = (l) => (l === "basics" ? "基礎" : "廢物");
    message += `我最喜歡的程式語言是 ${favorite_lang.name} ，程度大概是${level(favorite_lang.level)}程度。`;
    message += `另外，我也多少用過 ${listArray(other_langs.map((lang) => `${lang.name} (${level(lang.level)})`))}。 \n`;

    message += `高中的時候打過競技程式，不過當時沒花時間在競程上，所以只是廢物一個，希望大學能參與一些競程的活動。 \n`;
    message += `我對寫應用程式很有興趣，如果有有趣的專案徵求合作夥伴或缺人手的歡迎來找我！︁！︁ \n`;
    message += `最常用的通訊軟體是 Messenger ，再來應該是 Telegram 和 Line。\n`;

    message += "\n";
    for (const platform in basics.social) {
        message += `${platform.toUpperCase()}: ${basics.social[platform]} \n`;
    }

    return message;
}

function listArray(arr) {
    if (arr.length === 0) return "";
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return `${arr[0]}和${arr[1]}`;
    if (arr.length >= 3) {
        const other = arr.slice(0, -1);
        const last = arr[arr.length - 1];
        return `${other.join("、")}${Math.random() > 0.2 ? "以及" : "和"}${last}`;
    }
}

export default { basics, background, skills, hello };
