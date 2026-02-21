import { Client, Account, Databases, Storage } from 'appwrite';

// Helper to ensure variables are grabbed regardless of environment
const getEnv = (key: string) => {
    return import.meta.env?.[key] || process.env[key] || "";
};

export const appwriteConfig = {
    endpointUrl: getEnv('VITE_APPWRITE_API_ENDPOINT'),
    projectId: getEnv('VITE_APPWRITE_PROJECT_ID'),
    databaseId: getEnv('VITE_APPWRITE_DATABASE_ID'),
    userCollectionId: getEnv('VITE_APPWRITE_USERS_COLLECTION_ID'),
    tripCollectionId: getEnv('VITE_APPWRITE_TRIPS_COLLECTION_ID'),
};

// This log will appear in your terminal if variables are missing
if (!appwriteConfig.databaseId) {
    console.error("❌ CONFIG ERROR: .env variables are not loading on the server!");
}

const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const database = new Databases(client);
export const storage = new Storage(client);