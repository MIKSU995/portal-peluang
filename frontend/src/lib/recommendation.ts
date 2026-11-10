// frontend/src/lib/recommendation.ts
import { Opportunity, UserProfile } from '@/types';

export function calculateMatchScore(opp: Opportunity, profile: UserProfile): number {
  let score = 0;

  if (!profile || !profile.major) return 50;

  // 1. Kecocokan Jurusan (Bobot 50%)
  const isAllMajors = opp.majors.some(m => m.toLowerCase().includes('semua jurusan'));
  const isMajorMatch = opp.majors.some(m => 
    m.toLowerCase().includes(profile.major.toLowerCase()) || 
    profile.major.toLowerCase().includes(m.toLowerCase())
  );

  if (isMajorMatch) {
    score += 50;
  } else if (isAllMajors) {
    score += 40;
  } else {
    score += 10;
  }

  // 2. Kecocokan Minat Kategori (Bobot 35%)
  const isInterestMatch = profile.interests.some(
    interest => interest.toUpperCase() === opp.category.toUpperCase()
  );
  if (isInterestMatch) {
    score += 35;
  }

  // 3. Status Keaktifan Deadline (Bobot 15%)
  const daysLeft = Math.ceil((new Date(opp.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (daysLeft > 0) {
    score += 15;
  }

  return Math.min(score, 100);
}