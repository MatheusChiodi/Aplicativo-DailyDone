export interface Task {
  title: string;
  description: string;
  tag: string;
  frequency: string;
  date: string;
  daysWeek: any;
  startTime: string;
  endTime: string;
  dateRealized: any;
  status: string;
  id: string;
}

export interface TaskSectionProps {
  mtActiveTasks: number;
  colorScheme: any;
  tasks: Task[];
  setActiveLoadedTasks: (value: boolean) => void;
  dateCurrent: string;
}

export interface MissedTasksProps {
  isVisible: boolean;
  onToggle: () => void;
  colorScheme: any;
  tasks: Task[];
  setActiveLoadedTasks: (value: boolean) => void;
  dateCurrent: string;
}
