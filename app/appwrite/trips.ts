import {appwriteConfig, database} from "~/appwrite/client";
import {Query} from "appwrite";
import { ID } from "appwrite";
export const getAllTrips = async (limit: number, offset: number) => {
    const allTrips = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.tripCollectionId,
        [Query.limit(limit), Query.offset(offset), Query.orderDesc('createdAt')]
    )

    if(allTrips.total === 0) {
        console.error('No trips found');
        return { allTrips: [], total: 0 }
    }

    return {
        allTrips: allTrips.documents,
        total: allTrips.total,
    }
}

export const getTripById = async (tripId: string) => {
    const trip = await database.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.tripCollectionId,
        tripId
    );

    if(!trip.$id) {
        console.log('Trip not found')
        return null;
    }

    return trip;
}



export const createTrip = async (tripData: any) => {
    // 1. THE GUARD: This stops the 'create' ID error
    if (!appwriteConfig.tripCollectionId || appwriteConfig.tripCollectionId === "undefined") {
        console.error("❌ Error: Trip Collection ID is undefined. Check your .env file!");
        return;
    }

    try {
        const response = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.tripCollectionId,
            ID.unique(), // Generates a valid unique ID so Appwrite doesn't look for 'create'
            {
                title: tripData.title,
                destination: tripData.destination,
                startDate: tripData.startDate,
                endDate: tripData.endDate,
                budget: tripData.budget,
                // Ensure itinerary is a string for Appwrite 'string' attributes
                itinerary: typeof tripData.itinerary === 'string'
                    ? tripData.itinerary
                    : JSON.stringify(tripData.itinerary),
                createdBy: tripData.userId,
                createdAt: new Date().toISOString(),
            }
        );
        return response;
    } catch (error: any) {
        // This will tell you if you have a naming mismatch in your attributes
        console.error("❌ Appwrite Create Error:", error.response || error.message);
        throw error;
    }
};