function generateAcronym(phrase: string): string {
    return phrase
        .split(' ') // Split the phrase into words using space as delimiter
        .map(word => word[0]?.toUpperCase()) // Get the first letter of each word in uppercase
        .join(''); // Join the letters together to form the acronym
}

// Function to generate a unique identifier with ETSAP/SO/acronym/randomNumbers
function generateIdentifier(phrase: string): string {
    const acronym = generateAcronym(phrase);
    const randomNumbers = Math.floor(10000 + Math.random() * 90000); // Generate a 5-digit random number
    return `ETSAP/SO/${acronym}/${randomNumbers}`;
}

export default generateIdentifier