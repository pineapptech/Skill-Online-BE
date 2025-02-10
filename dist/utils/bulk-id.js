"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBulkId = void 0;
const generateBulkId = (location) => {
    // Convert location to uppercase and split into words
    const words = location.includes('-') ? location.toUpperCase().split('-') : location.toUpperCase().split(' ');
    // Get first letter of each word and join them
    const locationCode = words.map((word) => word.charAt(0)).join('');
    // Generate a random 6-digit number
    const randomNum = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, '0');
    return `BULK/${locationCode}/${randomNum}`;
};
exports.generateBulkId = generateBulkId;
