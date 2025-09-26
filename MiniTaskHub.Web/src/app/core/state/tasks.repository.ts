import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { createStore, withProps } from '@ngneat/elf';
import { withEntities, setEntities, addEntities, updateEntities, deleteEntities, selectEntity } from '@ngneat/elf-entities';
import { select } from '@ngneat/elf';
import { TaskItem } from '../models/task.model';
import { TaskFilters } from '../../features/tasks/components/filter-sort-bar/filter-sort-bar.component';

const initialFilters: TaskFilters = {
  status: null,
  dueDate: null,
  sortBy: 'title',
  sortDirection: 'asc'
};

const tasksStore = createStore(
  { name: 'tasks' },
  withEntities<TaskItem>(),
  withProps<{ filters: TaskFilters }>({ filters: initialFilters })
);

@Injectable({ providedIn: 'root' })
export class TasksRepository {
  tasks$: Observable<TaskItem[]> = tasksStore.pipe(
    select(state => {
      const tasks = Object.values(state.entities).filter(t => t !== undefined) as TaskItem[];
      const { status, dueDate, sortBy, sortDirection } = state.filters;

      // Filtering
      let filteredTasks = tasks;

      if (status) {
        filteredTasks = filteredTasks.filter(task => task.status === status);
      }

      if (dueDate) {
        // The filter dueDate is a string in 'YYYY-MM-DD' format.
        // The task.dueDate is an ISO string. Comparing the first 10 chars is a reliable way to check if the task date is on or before the filter date.
        filteredTasks = filteredTasks.filter(task => task.dueDate && task.dueDate.substring(0, 10) <= dueDate);
      }

      // Sorting
      return [...filteredTasks].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    })
  );

  getTask(id: number) {
    return tasksStore.pipe(selectEntity(id));
  }

  setTasks(tasks: TaskItem[]) {
    tasksStore.update(setEntities(tasks));
  }

  addTask(task: TaskItem) {
    tasksStore.update(addEntities(task));
  }

  updateTask(id: number, task: Partial<TaskItem>) {
    tasksStore.update(updateEntities(id, task));
  }

  deleteTask(id: number) {
    tasksStore.update(deleteEntities(id));
  }

  updateFilters(filters: TaskFilters) {
    tasksStore.update(state => ({
      ...state,
      filters
    }));
  }
}
