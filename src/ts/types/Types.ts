export type MultiselectOption = { id: number, name: string; value?: string };

export type Restaurant = {
  name: string;
  baseRecommendationScore: number;
  canBeDelivered: boolean;
  city: string;
  closed: string[];
  cuisines: string[];
  website: string;
  specials: {
    [key: string]: string;
  },
  id: string;
  timestamp?: string;
}