import type { RequestHandler } from './$types';
import { Client, Databases } from 'node-appwrite';
import { APPWRITE_TOKEN } from '$env/static/private';

export const GET: RequestHandler = async (event) => {
    const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject('jcsinsider')
        .setSession(APPWRITE_TOKEN);

    const databases = new Databases(client);

    const result = await databases.listDocuments(
        'main',
        '<COLLECTION_ID>',
        []
    );

    return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' }
    });
};