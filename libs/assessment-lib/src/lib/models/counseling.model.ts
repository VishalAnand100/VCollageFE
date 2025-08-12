// counseling.model.ts

export interface AvailableSlotsResponse {
  freeSlots: string[];
}

export interface ScheduleRequest {
  userId: string;
  scheduledDate: string; // ISO string date
  timeSlot: string;
}
