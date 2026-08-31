export function formatRate(
rate: number
) {

return new Intl.NumberFormat(
    undefined,
    {
        style: "currency",
        currency: "USD",
    }
).format(rate);

}

export function getRateTypeLabel(
rateType: number
) {

switch (rateType) {

    case 1:
        return "hour";

    case 2:
        return "day";

    case 3:
        return "fixed";

    default:
        return "rate";

}

}
