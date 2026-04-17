function calculatePrice(startTime, endTime, pricePerHour) {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const durationMs = end - start;

    if (durationMs <= 0) {
        throw new Error("Invalid time range");
    }

    const durationHours = durationMs / (1000 * 60 * 60);

    const roundedDuration = Math.round(durationHours * 100) / 100;

    const totalPrice = Math.round(roundedDuration * pricePerHour * 100) / 100;

    return {
        duration: roundedDuration,
        totalPrice
    };
}

module.exports = calculatePrice;