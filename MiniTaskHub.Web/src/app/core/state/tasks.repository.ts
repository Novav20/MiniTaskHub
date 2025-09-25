import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { createStore, withProps } from '@ngneat/elf';
import { withEntities, setEntities, addEntities, updateEntities, deleteEntities, selectEntity } from '@ngneat/elf-entities';
import { select } from '@ngneat/elf';
import { TaskItem } from '../models/task.model';

const tasksStore = createStore({ name: 'tasks' }, withEntities<TaskItem>());

@Injectable({ providedIn: 'root' })
export class TasksRepository {
  tasks$: Observable<TaskItem[]> = tasksStore.pipe(select(state => Object.values(state.entities) as TaskItem[]));

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
}
