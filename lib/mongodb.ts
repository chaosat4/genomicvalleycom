import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import { getEnv } from "./env";

const uri = getEnv("MONGODB_URI");

const options = {
  maxPoolSize: Number(process.env.MONGODB_MAX_POOL_SIZE || 20),
  minPoolSize: Number(process.env.MONGODB_MIN_POOL_SIZE || 5),
  maxIdleTimeMS: Number(process.env.MONGODB_MAX_IDLE_MS || 30000),
};

// ── Raw MongoClient (used by Better Auth) ──────────────────────────────────
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise;
}

// Resolves to a Db instance — required by Better Auth's mongodbAdapter
export const dbPromise = clientPromise.then((c) => c.db());

// ── Mongoose connection (used by all Mongoose models) ──────────────────────
const globalWithMongoose = global as typeof globalThis & {
  _mongooseConnPromise?: Promise<typeof mongoose>;
};

export async function connectDB(): Promise<void> {
  // Already connected
  if (mongoose.connection.readyState === 1) return;

  // Connection in progress — reuse the promise
  if (globalWithMongoose._mongooseConnPromise) {
    await globalWithMongoose._mongooseConnPromise;
    return;
  }

  globalWithMongoose._mongooseConnPromise = mongoose.connect(uri, {
    maxPoolSize: Number(process.env.MONGODB_MAX_POOL_SIZE || 20),
    minPoolSize: Number(process.env.MONGODB_MIN_POOL_SIZE || 5),
    maxIdleTimeMS: Number(process.env.MONGODB_MAX_IDLE_MS || 30000),
    bufferCommands: false,
  });

  try {
    await globalWithMongoose._mongooseConnPromise;
  } catch (err) {
    // Reset so the next request can retry
    globalWithMongoose._mongooseConnPromise = undefined;
    throw err;
  }
}
