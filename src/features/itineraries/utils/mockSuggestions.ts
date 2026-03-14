import type { ItineraryItemType } from '@/features/itineraries/types/itinerary';

export interface SuggestedActivity {
  title: string;
  type: ItineraryItemType;
  description?: string;
  location?: string;
  cost?: number;
}

export function getMockSuggestions(destination: string): SuggestedActivity[] {
  const normalized = destination.toLowerCase();

  if (normalized.includes('paris')) {
    return [
      {
        title: 'Visit the Louvre Museum',
        type: 'attraction',
        description: 'Explore one of the world’s most famous art museums.',
        location: 'Rue de Rivoli, Paris',
        cost: 25,
      },
      {
        title: 'Seine River Cruise',
        type: 'activity',
        description:
          'Take an evening sightseeing cruise through central Paris.',
        location: 'Seine River',
        cost: 30,
      },
      {
        title: 'Dinner in Le Marais',
        type: 'restaurant',
        description:
          'Enjoy dinner in one of Paris’s most vibrant neighborhoods.',
        location: 'Le Marais, Paris',
        cost: 55,
      },
    ];
  }

  if (normalized.includes('tokyo')) {
    return [
      {
        title: 'Shibuya Crossing Walk',
        type: 'activity',
        description: 'Experience one of Tokyo’s most iconic intersections.',
        location: 'Shibuya, Tokyo',
        cost: 0,
      },
      {
        title: 'Senso-ji Temple Visit',
        type: 'attraction',
        description: 'Visit Tokyo’s famous historic temple.',
        location: 'Asakusa, Tokyo',
        cost: 0,
      },
      {
        title: 'Sushi Dinner',
        type: 'restaurant',
        description: 'Try a local sushi spot for dinner.',
        location: 'Tokyo',
        cost: 40,
      },
    ];
  }

  return [
    {
      title: 'Explore the city center',
      type: 'activity',
      description: 'Walk the main districts and discover local highlights.',
      location: destination,
      cost: 0,
    },
    {
      title: 'Try a local restaurant',
      type: 'restaurant',
      description: 'Find a highly rated local spot for a meal.',
      location: destination,
      cost: 35,
    },
    {
      title: 'Visit a major attraction',
      type: 'attraction',
      description: 'Add one signature landmark or museum to the day.',
      location: destination,
      cost: 20,
    },
  ];
}
