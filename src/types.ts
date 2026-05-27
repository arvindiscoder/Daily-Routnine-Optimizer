export interface Habit {
  id: string;
  name: string;
  category: 'Health' | 'Work' | 'Mind';
  frequency: 'daily' | 'weekly';
  streak: number;
  completedToday: boolean;
  color: string;
}

export interface Task {
  id: string;
  text: string;
  category: 'Health' | 'Work' | 'Mind';
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  pomodoros: number;
  completedPomodoros: number;
}

export interface ScheduleBlock {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: 'Health' | 'Work' | 'Mind';
  productivity: 'High' | 'Medium' | 'Low';
  desc: string;
}

export interface IdentityCheck {
  id: string;
  identityName: string; // e.g., "A Focused Developer"
  provenToday: boolean;
  color: string;
}

export interface RoutineTemplate {
  id: string;
  name: string;
  desc: string;
  category: string;
  blocks: Omit<ScheduleBlock, 'id'>[];
}

export type TabType = 'dashboard' | 'optimizer' | 'habits' | 'tasks' | 'analytics' | 'library' | 'chat';
