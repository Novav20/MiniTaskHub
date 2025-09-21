import { Routes } from '@angular/router';
import { TaskListComponent } from './pages/task-list/task-list.component';
import { TaskFormComponent } from './pages/task-form/task-form.component';
import { TaskDetailsComponent } from './pages/task-details/task-details.component';

export const TASKS_ROUTES: Routes = [
  {
    path: '',
    component: TaskListComponent
  },
  {
    path: 'new',
    component: TaskFormComponent
  },
  {
    path: 'edit/:id',
    component: TaskFormComponent
  },
  {
    path: ':id',
    component: TaskDetailsComponent
  }
];
