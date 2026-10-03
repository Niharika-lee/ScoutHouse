export type PropertyType = 'PG' | '1BHK' | 'Shared Room' | 'Studio';
export type FurnishedStatus = 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
export type GenderPreference = 'Any' | 'Male' | 'Female';
export type Availability = 'Available Now' | 'Available Soon';
export type DataSource = 'Estimated' | 'User-reported' | 'Owner-stated';

export interface TenantReview {
  initials: string;
  rating: number;
  stayDuration: string;
  comment: string;
}

export interface HouseRules {
  visitors: string;
  curfew: string;
  smokingAlcohol: string;
  pets: string;
  cooking: string;
  guestStay: string;
}

export interface AgreementTerms {
  noticePeriod: string;
  lockInPeriod: string;
  agreementType: string;
}

export interface Property {
  id: string;
  title: string;
  area: string;
  city: string;
  type: PropertyType;
  rent: number;
  deposit: number;
  maintenance: number;
  furnished: FurnishedStatus;
  distanceKm: number;
  nearestCollege: string;
  nearbyTransport: string[];
  amenities: string[];
  furnitureIncluded: string[];
  genderPreference: GenderPreference;
  availability: Availability;
  lastUpdated: string;
  description: string;
  images: string[];
  // Rental Reality Check fields
  electricityEstimate: number;
  waterEstimate: number;
  internetCost: number;
  foodCost: number;
  brokerage: number;
  travelTimeEstimate: string;
  photosLastUpdated: string;
  houseRules: HouseRules;
  agreementTerms: AgreementTerms;
  tenantReviews: TenantReview[];
  similarPropertyIds: string[];
  isOwnerPosted?: boolean;
  ownerEmail?: string;
  ownerId?: string;
}

export type UserRole = 'Tenant' | 'Owner';

export interface User {
  name: string;
  email: string;
  role: UserRole;
}

export type SortOption = 'price-low' | 'price-high' | 'nearest';

export interface Filters {
  budgetMax: number;
  types: PropertyType[];
  furnished: FurnishedStatus[];
  maxDistance: number;
  gender: GenderPreference | 'Any';
  availability: Availability | 'Any';
}
