export enum TaskItemStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Done = 'Done',
}

export interface TaskDto {
  title: string;
  description?: string;
  status: TaskItemStatus;
  dueDate: string; // ISO 8601 date string
}

export interface TaskItem extends TaskDto {
  id: number;
  applicationUserId: string;
}
