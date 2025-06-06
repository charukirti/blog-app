import { Account, Client, Databases, Storage } from "appwrite";

const client = new Client();
client
  .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)
  .setDevKey(import.meta.env.VITE_APPWRITE_DEV_KEY);

export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);

export default client;

export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

export const COLLECTIONS = {
  BLOGS: import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
  COMMENTS: import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID,
  LIKES: import.meta.env.VITE_APPWRITE_LIKES_COLLECTION_ID,
};


export const bucketID = import.meta.env.VITE_APPWRITE_BUCKET_ID