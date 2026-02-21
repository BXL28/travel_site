import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string): string => {
    return dayjs(dateString).format("MMMM DD, YYYY");
};

/**
 * AI-Proof JSON Parsing
 * Handles raw JSON, Markdown-wrapped JSON, and JSON with leading/trailing text.
 */
export function parseTripData(input: string | any): any | null {
    if (!input) return null;

    // If it's already an object (e.g. Appwrite already parsed it), return it
    if (typeof input === 'object') return input;

    try {
        // 1. Try direct parse (fastest)
        return JSON.parse(input);
    } catch (e) {
        // 2. Try to find JSON inside backticks or general text
        // This regex looks for anything between the first { and the last }
        const start = input.indexOf('{');
        const end = input.lastIndexOf('}') + 1;

        if (start !== -1 && end !== -1) {
            const potentialJson = input.substring(start, end);
            try {
                return JSON.parse(potentialJson);
            } catch (innerError) {
                console.error("AI returned malformed JSON structure:", innerError);
                return null;
            }
        }
    }

    console.error("No valid JSON structure found in AI response.");
    return null;
}

// Keep this for backward compatibility if needed, but use parseTripData for everything now
export function parseMarkdownToJson(markdownText: string): any | null {
    return parseTripData(markdownText);
}

export function getFirstWord(input: string = ""): string {
    // If input is an array (AI sometimes sends interests as an array), handle it
    if (Array.isArray(input)) return input[0] || "";
    return String(input).trim().split(/\s+/)[0] || "";
}

export const calculateTrendPercentage = (
    countOfThisMonth: number,
    countOfLastMonth: number
): { trend: string; percentage: number } => {
    if (countOfLastMonth === 0) {
        return countOfThisMonth === 0
            ? { trend: "no change", percentage: 0 }
            : { trend: "increment", percentage: 100 };
    }

    const change = countOfThisMonth - countOfLastMonth;
    const percentage = Math.abs((change / countOfLastMonth) * 100);

    if (change > 0) return { trend: "increment", percentage };
    if (change < 0) return { trend: "decrement", percentage };
    return { trend: "no change", percentage: 0 };
};

export const formatKey = (key: string) => {
    return key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
};