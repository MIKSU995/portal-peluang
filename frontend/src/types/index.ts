// frontend/src/types/index.ts

export type OpportunityCategory = 
  | 'MAGANG' 
  | 'BEASISWA' 
  | 'LOMBA' 
  | 'KOMPETISI' 
  | 'MBKM';

export type ApplicationStatus = 'saved' | 'preparing' | 'applied' | 'interview' | 'accepted' | 'rejected';

export interface UserProfile {
  major: string;
  semester: number;
  interests: string[];
}

export interface UserApplication {
  opportunityId: string;
  status: ApplicationStatus;
  updatedAt: string;
  notes?: string;
}

export interface Opportunity {
  id: string;
  slug: string;
  title: string;
  organizer: string;
  category: OpportunityCategory;
  isOfficial?: boolean;
  isVerified: boolean;
  isBookmarked: boolean;
  reward?: string;
  stipendOrPrize?: string;
  description: string;
  location: string;
  requirements: string[];
  majors: string[];
  deadline: string;
  link: string;
  sourceUrl: string;
  viewsCount: number;
  createdAt: string;
  matchScore?: number;
}

export interface AppNotification {
  id: string;
  type: 'DEADLINE' | 'NEW' | 'UPDATE' | 'REMINDER' | 'INFO'; // <-- Tambahkan 'INFO' di sini
  isRead: boolean;
  title: string;
  message: string;
  opportunityId?: string;
  timestamp: string;
}

export interface FilterState {
  q: string;
  category: string;
  major: string;
  sort: string;
  isVerifiedOnly: boolean;
  onlyBookmarked: boolean;
}

export type Theme = 'light' | 'dark';

export interface TeamPost {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  leaderName: string;
  leaderMajor: string;
  neededRoles: string[];
  description: string;
  contactChannel: 'whatsapp' | 'telegram' | 'linkedin';
  contactValue: string;
  createdAt: string;
}