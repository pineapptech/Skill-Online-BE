const generatePromoCode = (): string => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return `ETSAP/PROMO/${randomNumber}`;
};

export default generatePromoCode;
