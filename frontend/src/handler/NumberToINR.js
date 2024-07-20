const covertNumberToINR = (numberValue) => {
    const value = isNaN(numberValue) ? "Invalid number" : numberValue.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

    return value;
}

export default covertNumberToINR;