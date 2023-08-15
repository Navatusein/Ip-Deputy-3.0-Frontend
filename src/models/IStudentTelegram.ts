export interface IStudentTelegram{
  id: number;
  studentId: number;
  telegramId: number;
  language: string;
  scheduleCompact: boolean;
  lastCongratulations?: string;
  lastActivity?: string;
}