/**
{
    "api": 1,
    "name": "Regex Tester",
    "description": "Tests a regex against the supplied text",
    "author": "Kent Anderson",
    "Icon": "rectangle, and. text .magnifyingglass",
    "tags": "regex"
}
**/

// Run this script (Cmd-B) on an empty buffer and it will print a sample for you.
// Edit whatever you need in the template, then re-run the script (Shift-Cd-B).

const SAMPLE_TOKEN = "// Sample Text";
const REGEX_TOKEN = "// Regex";
const RESULT_TOKEN = "// Result";

function main(state) {
    if (state.fullText.trim() == "") {
        state.fullText = rebuildOriginalInput(
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit,\n"
            + "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            "/\\w+/g"
        );
        return;
    }

    var sampleText = extractSampleText(state.fullText);
    var regexText = extractRegexText(state.fullText);

    var resultText;
    try {
        resultText = processRegex(sampleText, regexText);
    } catch (error) {
        resultText = error;
    }

    state.fullText = `${rebuildOriginalInput(sampleText, regexText)}\n\n${RESULT_TOKEN}\n${resultText}\n`;
}

function extractInputs(fullText) {
    return {
        sampleText: extractSampleText(fullText),
        regexText: extractRegexText(fullText)
    };
}

function rebuildOriginalInput(sampleText, regexText) {
    return `${SAMPLE_TOKEN}\n${sampleText}\n\n${REGEX_TOKEN}\n${regexText || "/Place regex here/"}`;
}

function extractSampleText(fullText) {
    var regexIndex = fullText.lastIndexOf(REGEX_TOKEN);
    var sampleText = fullText.slice(0, regexIndex);
    return sampleText.replace(SAMPLE_TOKEN, "").trim();
}

function extractRegexText(fullText) {
    var regexIndex = fullText.lastIndexOf(REGEX_TOKEN);
    var resultIndex = fullText.lastIndexOf(RESULT_TOKEN);

    if (regexIndex < 0) {
        return null;
    }

    if (resultIndex < 0) {
        resultIndex = fullText.length;
    }

    var regexText = fullText.slice(regexIndex, resultIndex);
    return regexText.replace(REGEX_TOKEN, "").trim();
}

function processRegex(sampleText, regexText) {
    if (!regexText) {
        return "Error: No regular expression provided";
    }

    var results = [];

    var parts = extractRegexParts(regexText);

    var regex = new RegExp(parts.regexText, parts.flags);
    var matchCount = 0;
    var match;

    while ((match = regex.exec(sampleText)) !== null) {
        matchCount += 1;
        results.push(
            `Match ${matchCount}: "${match[0]}" [${match.index}..${match.index + match[0].length - 1}]`
        );

        for (var group = 1; group < match.length; group++) {
            results.push(`Group ${group}: "${match[group]}"`);
        }

        if (match.groups) {
            for (var name in match.groups) {
                results.push(`Group[${name}]: "${match.groups[name]}"`);
            }
        }

        if (match.length > 1 || match.groups) {
            results.push("");
        }

        if (!regex.global) {
            break;
        }
    }

    if (results.length == 0) {
        return "No matches found";
    }

    return results.join("\n").trim();
}

function extractRegexParts(regexText) {
    var lastSlashIndex = regexText.lastIndexOf("/");
    var regex = regexText;
    var flags = "";

    if (lastSlashIndex > 0){
        regex = regexText.slice(0, lastSlashIndex).substring(1);
        flags = regexText.substring(lastSlashIndex+1).trim();
    }

    return { regexText: regex, flags: flags };
}

