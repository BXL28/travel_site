import {type ActionFunctionArgs, data} from "react-router";
import {GoogleGenerativeAI} from "@google/generative-ai";
import {parseMarkdownToJson, parseTripData} from "~/lib/utils";
import {appwriteConfig, database} from "~/appwrite/client";
import {ID} from "appwrite";

/** Prefer scenic / place imagery; avoid obvious food & portrait results when metadata allows. */
async function fetchScenicTripPhotos(country: string, clientId: string): Promise<string[]> {
    const scenicQuery = encodeURIComponent(
        `${country} scenic landscape skyline cityscape vista aerial view travel destination landmark`
    );
    const url = `https://api.unsplash.com/search/photos?query=${scenicQuery}&orientation=landscape&per_page=24&client_id=${clientId}`;
    const imageResponse = await fetch(url);
    const json = await imageResponse.json();
    const results: any[] = json.results || [];

    const avoid =
        /\b(food|restaurant|meal|chef|cooking|dish|plate|breakfast|lunch|dinner|coffee shop|portrait|face|selfie|wedding|makeup|hair salon|gym workout|people eating|friends eating|family portrait|crowd)\b/i;

    const landscapeOk = (r: any) => {
        const w = Number(r.width);
        const h = Number(r.height);
        if (!r?.urls?.regular) return false;
        if (h > 0 && w / h < 0.95) return false;
        const text = `${r.alt_description || ""} ${r.description || ""}`;
        if (avoid.test(text)) return false;
        return true;
    };

    let picked = results.filter(landscapeOk);
    if (picked.length < 3) {
        const wider = results.filter(
            (r: any) => r?.urls?.regular && Number(r.width) >= Number(r.height) * 0.9
        );
        for (const r of wider) {
            if (picked.length >= 3) break;
            if (!picked.includes(r)) picked.push(r);
        }
    }
    if (picked.length < 3) {
        picked = [...results];
    }

    return picked
        .slice(0, 3)
        .map((r: any) => r.urls?.regular)
        .filter(Boolean);
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const body = await request.json();
    const {
        country,
        numberOfDays,
        travelStyle,
        interests,
        budget,
        groupType,
        userId: bodyUserId,
    } = body;
    const userId = typeof bodyUserId === "string" && bodyUserId.length > 0 ? bodyUserId : "anonymous";

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY!;

    try {
        const prompt = `Generate a ${numberOfDays}-day travel itinerary for ${country} based on the following user information:
        Budget: '${budget}'
        Interests: '${interests}'
        TravelStyle: '${travelStyle}'
        GroupType: '${groupType}'
        Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:
        {
        "name": "A descriptive title for the trip",
        "description": "A brief description of the trip and its highlights not exceeding 100 words",
        "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
        "duration": ${numberOfDays},
        "budget": "${budget}",
        "travelStyle": "${travelStyle}",
        "country": "${country}",
        "interests": ${interests},
        "groupType": "${groupType}",
        "bestTimeToVisit": [
          '🌸 Season (from month to month): reason to visit',
          '☀️ Season (from month to month): reason to visit',
          '🍁 Season (from month to month): reason to visit',
          '❄️ Season (from month to month): reason to visit'
        ],
        "weatherInfo": [
          '☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
          '🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
          '🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
          '❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)'
        ],
        "location": {
          "city": "name of the city or region",
          "coordinates": [latitude, longitude],
          "openStreetMap": "link to open street map"
        },
        "itinerary": [
        {
          "day": 1,
          "location": "City/Region Name",
          "activities": [
            {"time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk"},
            {"time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour"},
            {"time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine"}
          ]
        },
        ...
        ]
    }`;


        const textResult = await genAI
            .getGenerativeModel({ model: 'gemini-2.5-flash' })
            .generateContent([prompt])

        const trip = parseMarkdownToJson(textResult.response.text());

        const imageUrls = await fetchScenicTripPhotos(country, unsplashApiKey);

        const result = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.tripCollectionId,
            ID.unique(),
            {
                tripDetail: JSON.stringify(trip),
                createdAt: new Date().toISOString(),
                imageUrls,
                userId,
            }
        )
        return data({id: result.$id});



    } catch (e) {
        console.error('Error generating travel plan: ', e);
    }
}