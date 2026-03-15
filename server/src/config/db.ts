import mongoose from 'mongoose';

export async function connectToDatabase(uri: string) {
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
}
