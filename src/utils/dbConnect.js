import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    console.log('\n=================================');
    console.log('\x1b[32m%s\x1b[0m', '✅ MongoDB Database Connection Status:');
    console.log('\x1b[32m%s\x1b[0m', '✅ Connected successfully to MongoDB!');
    console.log('\x1b[32m%s\x1b[0m', `✅ Database URL: ${MONGODB_URI.split('@')[1]}`);
    console.log('=================================\n');
  } catch (e) {
    cached.promise = null;
    console.log('\n=================================');
    console.error('\x1b[31m%s\x1b[0m', '❌ MongoDB Connection Error:');
    console.error('\x1b[31m%s\x1b[0m', e);
    console.log('=================================\n');
    throw e;
  }

  return cached.conn;
}

export default dbConnect;