export type CourseStatus = 'draft' | 'published' | 'archived';
export type CourseCategory =
  | 'programming'
  | 'design'
  | 'business'
  | 'marketing'
  | 'science';

export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  instructor: string;
  status: CourseStatus;
  enrollments: number;
  rating: number;
  isFree: boolean;
  createdAt: string; // ISO date string yyyy-MM-dd
}
