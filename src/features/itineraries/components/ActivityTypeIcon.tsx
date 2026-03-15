import {
  MapPin,
  Plane,
  Hotel,
  Train,
  UtensilsCrossed,
  Sparkles,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';

import type { ItineraryItemType } from '@/features/itineraries/types/itinerary';

interface ActivityTypeIconProps {
  type: ItineraryItemType;
  className?: string;
}

const iconMap: Record<ItineraryItemType, LucideIcon> = {
  attraction: MapPin,
  restaurant: UtensilsCrossed,
  hotel: Hotel,
  transport: Train,
  flight: Plane,
  activity: Sparkles,
  other: HelpCircle,
};

export default function ActivityTypeIcon({
  type,
  className,
}: ActivityTypeIconProps) {
  const Icon = iconMap[type] ?? HelpCircle;
  return <Icon className={className} />;
}
