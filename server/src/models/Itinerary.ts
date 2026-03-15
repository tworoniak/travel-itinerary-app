import { Schema, model } from 'mongoose';

const itineraryItemSchema = new Schema(
  {
    id: { type: String, required: true },
    itineraryId: { type: String, required: true },
    dayNumber: { type: Number, required: true },
    date: { type: String },
    time: { type: String },
    title: { type: String, required: true },
    description: { type: String },
    type: {
      type: String,
      enum: [
        'attraction',
        'restaurant',
        'hotel',
        'transport',
        'flight',
        'activity',
        'other',
      ],
      required: true,
    },
    location: { type: String },
    reservationNumber: { type: String },
    cost: { type: Number },
    notes: { type: String },
    orderIndex: { type: Number },
  },
  { _id: false },
);

const itinerarySchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    destination: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    coverImage: { type: String },
    notes: { type: String },
    status: {
      type: String,
      enum: ['planning', 'confirmed', 'in_progress', 'completed'],
      default: 'planning',
    },
    travelers: { type: Number, default: 1 },
    budget: { type: Number },
    currency: { type: String, default: 'USD' },
    items: { type: [itineraryItemSchema], default: [] },
  },
  {
    timestamps: true,
  },
);

export const ItineraryModel = model('Itinerary', itinerarySchema);
