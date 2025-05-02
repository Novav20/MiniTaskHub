export enum TaskStatus {
    Pending = 'Pending',
    InProgress = 'InProgress',
    Done = 'Done'
}

export const TaskStatusLabels: Record<TaskStatus, string> = {
    [TaskStatus.Pending]: 'Pending',
    [TaskStatus.InProgress]: 'In Progress',
    [TaskStatus.Done]: 'Done'
}