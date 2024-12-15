"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateAcronym(phrase) {
    return phrase
        .split(' ') // Split the phrase into words using space as delimiter
        .map(word => { var _a; return (_a = word[0]) === null || _a === void 0 ? void 0 : _a.toUpperCase(); }) // Get the first letter of each word in uppercase
        .join(''); // Join the letters together to form the acronym
}
// Function to generate a unique identifier with ETSAP/SO/acronym/randomNumbers
function generateIdentifier(phrase) {
    const acronym = generateAcronym(phrase);
    const randomNumbers = Math.floor(10000 + Math.random() * 90000); // Generate a 5-digit random number
    return `ETSAP/SO/${acronym}/${randomNumbers}`;
}
exports.default = generateIdentifier;
