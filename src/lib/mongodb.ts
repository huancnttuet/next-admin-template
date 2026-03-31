import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const fallbackUri = process.env.MONGODB_URI_LOCAL;

if (!uri) {
  throw new Error('MONGODB_URI is not defined');
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
  mongoFallbackClientPromise?: Promise<MongoClient>;
};

const client = new MongoClient(uri);

const fallbackClient = fallbackUri ? new MongoClient(fallbackUri) : null;

export const mongoClientPromise =
  globalForMongo.mongoClientPromise ?? client.connect();

const mongoFallbackClientPromise = fallbackClient
  ? (globalForMongo.mongoFallbackClientPromise ?? fallbackClient.connect())
  : null;

if (process.env.NODE_ENV !== 'production') {
  globalForMongo.mongoClientPromise = mongoClientPromise;
  globalForMongo.mongoFallbackClientPromise =
    mongoFallbackClientPromise ?? undefined;
}

export async function getMongoDb() {
  try {
    const mongoClient = await mongoClientPromise;
    return mongoClient.db();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes('ENOTFOUND') && mongoFallbackClientPromise) {
      const localClient = await mongoFallbackClientPromise;
      return localClient.db();
    }

    if (message.includes('ENOTFOUND')) {
      throw new Error(
        'Cannot resolve MongoDB host. If you use MongoDB Atlas, ensure MONGODB_URI starts with mongodb+srv:// and check DNS/VPN/network access. You can set MONGODB_URI_LOCAL for local fallback.',
      );
    }

    throw error;
  }
}
