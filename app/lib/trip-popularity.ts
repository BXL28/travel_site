import { parseTripData } from "~/lib/utils";

export type PopularityRow = { label: string; count: number };

export type TripPopularityStats = {
    countries: PopularityRow[];
    travelStyles: PopularityRow[];
    interests: PopularityRow[];
};

function bump(map: Map<string, number>, raw: string) {
    const key = raw.trim() || "Unknown";
    map.set(key, (map.get(key) ?? 0) + 1);
}

function toTopN(map: Map<string, number>, n: number): PopularityRow[] {
    return [...map.entries()]
        .filter(([label]) => label.length > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, n)
        .map(([label, count]) => ({ label, count }));
}

/**
 * Aggregates country, travelStyle, and interests from trip documents (Appwrite rows).
 */
export function aggregateTripPopularity(
    documents: { tripDetail?: string }[]
): TripPopularityStats {
    const countries = new Map<string, number>();
    const travelStyles = new Map<string, number>();
    const interests = new Map<string, number>();

    for (const doc of documents) {
        const parsed = parseTripData(doc.tripDetail);
        if (!parsed) continue;

        if (parsed.country != null && String(parsed.country).trim()) {
            bump(countries, String(parsed.country));
        }

        if (parsed.travelStyle != null && String(parsed.travelStyle).trim()) {
            bump(travelStyles, String(parsed.travelStyle));
        }

        const int = parsed.interests;
        if (int == null) continue;
        if (Array.isArray(int)) {
            for (const item of int) {
                if (item != null && String(item).trim()) {
                    bump(interests, String(item));
                }
            }
        } else if (String(int).trim()) {
            bump(interests, String(int));
        }
    }

    return {
        countries: toTopN(countries, 8),
        travelStyles: toTopN(travelStyles, 8),
        interests: toTopN(interests, 8),
    };
}
