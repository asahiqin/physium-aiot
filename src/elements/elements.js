/**
 * periodic-table
 *
 * @author Shangzhen Yang
 * https://github.com/shangzhenyang/periodic-table
 * 
 * 注:作者AsahiQin更改了部分代码,使其适配vela的js解释器
 */

import elementsOriginalData from "./elements.json";

// interface ErrorResult {
//     error;
//     message;
// }

// interface ElementResult {
//     mass: number;
//     mole: number;
//     name;
//     name_chs;
//     name_cht;
//     number: number;
//     symbol;
// }

// interface CompoundResult {
//     mass: number;
//     symbol;
// }

// type AllResult = ErrorResult | ElementResult | CompoundResult;
const elementsData = elementsOriginalData.data

const PREFIXES = {
    "mono": 1,
    "di": 2,
    "tri": 3,
    "tetra": 4,
    "penta": 5,
    "hexa": 6,
    "hepta": 7,
    "octa": 8,
    "nona": 9,
    "deca": 10,
    "undeca": 11,
    "dodeca": 12,
    "一": 1,
    "二": 2,
    "三": 3,
    "四": 4,
    "五": 5,
    "六": 6,
    "七": 7,
    "八": 8,
    "九": 9,
    "十": 10
};

// To avoid representation exposure, do not use this in the internal code.
const elements = elementsData.map((element, index) => {
    return {
        ...element,
        number: index + 1
    };
});

function getElement(searchTerm) {
    searchTerm = searchTerm.toLowerCase().trim();
    let mole = 1;
    for (let i = 0; i < elementsData.length; i++) {
        const element = {
            ...elementsData[i],
            number: i + 1
        };
        for (const prefix in PREFIXES) {
            if (searchTerm.startsWith(prefix)) {
                mole = PREFIXES[prefix];
                searchTerm = searchTerm.replace(prefix, "");
                break;
            }
        }
        const numRegExp = /\d+/;
        if (numRegExp.test(searchTerm)) {
            const num = parseInt(numRegExp.exec(searchTerm)?.[0] || "0");
            if (num !== parseInt(searchTerm)) {
                mole = num;
                searchTerm = searchTerm.replace(mole.toString(), "");
            }
        }
        if (
            (searchTerm.length <= 2 &&
                element.symbol.toLowerCase() === searchTerm) ||
            (searchTerm.length > 2 &&
                element.name.toLowerCase().includes(searchTerm)) ||
            element.name_chs === searchTerm ||
            element.name_cht === searchTerm ||
            element.number === parseInt(searchTerm) ||
            Math.round(element.mass) === Math.round(parseInt(searchTerm))
        ) {
            return {
                mass: element.mass * mole,
                mole: mole,
                name: element.name,
                name_chs: element.name_chs,
                name_cht: element.name_cht,
                number: element.number,
                symbol: element.symbol
            } ;
        }
    }
    return {
        error: "notFound",
        message: "Element not found."
    } ;
}

function getCompound(searchTerm, multipler = 1) {
    const records = [];
    if (searchTerm) {
        searchTerm = searchTerm
            .replaceAll("（", "(")
            .replaceAll("）", ")")
            .trim();
        if (searchTerm.split("(").length > 2) {
            return {
                error: "tooManyParentheses",
                message: "Only one pair of parentheses is allowed."
            } ;
        }
        if (searchTerm.includes("(")) {
            const inParenthesisResults = /\(.*\)/.exec(searchTerm);
            let inParenthesis;
            if (inParenthesisResults?.[0]) {
                inParenthesis = inParenthesisResults[0]
                    .substring(1, inParenthesisResults[0].length - 1);
            } else {
                return {
                    error: "parenthesesError",
                    message: "Errors encountered when parsing parentheses."
                } ;
            }
            const parenthesisNumResults = /\)\d+/.exec(searchTerm);
            let parenthesisNum;
            if (parenthesisNumResults?.[0]) {
                parenthesisNum = parseInt(
                    parenthesisNumResults[0].substring(1)
                );
            } else {
                parenthesisNum = 1;
            }
            const expanded = getCompound(inParenthesis, parenthesisNum);
            if (!isErrorResult(expanded)) {
                searchTerm = searchTerm.replace(/\(.*\)\d+/, expanded.symbol);
            }
        }
        const letters = searchTerm.split("");
        const uppercaseRegExp = /[A-Z]+/;
        if (searchTerm.includes(" ") || uppercaseRegExp.test(searchTerm)) {
            let elementName = "";
            const tempRecords = [];
            for (let i = 0; i < letters.length; i++) {
                elementName += letters[i];
                const result = getElement(elementName.toLowerCase());
                if (!isErrorResult(result)) {
                    tempRecords.push([
                        {
                            symbol: result.symbol,
                            mole: result.mole * multipler,
                            mass: result.mass * multipler
                        }
                    ]);
                }
                if (
                    letters[i] === " " ||
                    uppercaseRegExp.test(letters[i + 1])
                ) {
                    records.push(tempRecords[tempRecords.length-1]);
                    tempRecords.length = 0;
                    elementName = "";
                }
            }
            records.push(tempRecords[tempRecords.length-1]);
        } else if (searchTerm.includes("化")) {
            const characters = searchTerm.split("化");
            const resultA = getElement(characters[1]);
            if (!isErrorResult(resultA)) {
                records.push([
                    {
                        symbol: resultA.symbol,
                        mole: resultA.mole,
                        mass: resultA.mass
                    }
                ]);
            }
            const resultB = getElement(characters[0]);
            if (!isErrorResult(resultB)) {
                records.push([
                    {
                        symbol: resultB.symbol,
                        mole: resultB.mole,
                        mass: resultB.mass
                    }
                ]);
            }
        } else {
            const result = getElement(searchTerm);
            if (isErrorResult(result)) {
                const zhRegExp = /[\u4e00-\u9fa5]+/;
                if (zhRegExp.test(searchTerm)) {
                    return {
                        error: "incorrectFormat",
                        message: "Please follow the format of \"几啥化几啥\"."
                    } ;
                } else {
                    return {
                        error: "notFount",
                        message: "The queried compound was not found."
                    } ;
                }
            }
            return result ;
        }
        let mass = 0;
        let symbol = "";
        for (const record of records) {
            if (record) {
                symbol += record[0].symbol;
                if (record[0].mole > 1) {
                    symbol += record[0].mole;
                }
                mass += record[0].mass;
            }
        }
        if (mass > 0 && symbol) {
            return {
                mass: mass,
                symbol: symbol
            };
        }
    }
    return {
        error: "notFound",
        message: "Compound not found."
    } ;
}

function isErrorResult(result){
    return !!(result ).error;
}

export { elements, getCompound, getElement, isErrorResult };