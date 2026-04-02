export function slugify(input: string): string {
    const normalized = input
        .normalize("NFKD")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .toLowerCase()
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return normalized || "seed-shop";
}

export function parseMoneyToCents(value: string): bigint {
    const normalized = value.trim();

    if (!/^[-+]?\d+(\.\d{1,2})?$/.test(normalized)) {
        throw new Error(`Invalid money value: ${value}`);
    }

    const negative = normalized.startsWith("-");
    const absolute = normalized.replace(/^[-+]/, "");
    const [wholePart, fractionPart = ""] = absolute.split(".");
    const cents = BigInt(`${wholePart}${fractionPart.padEnd(2, "0")}`);

    return negative ? -cents : cents;
}

export function formatCents(cents: bigint): string {
    const negative = cents < 0n;
    const absolute = negative ? -cents : cents;
    const whole = absolute / 100n;
    const fraction = absolute % 100n;

    return `${negative ? "-" : ""}${whole.toString()}.${fraction.toString().padStart(2, "0")}`;
}

export function calculateLineTotal(price: string, quantity: number): string {
    const totalCents = parseMoneyToCents(price) * BigInt(quantity);

    return formatCents(totalCents);
}

export function uniquePhone(index: number): string {
    return `+8491${String(index).padStart(7, "0")}`;
}
