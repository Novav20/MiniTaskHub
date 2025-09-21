import { Routes } from '@angular/router';
import { TaskListComponent } from './pages/task-list/task-list.component';
import { TaskFormComponent } from './pages/task-form/task-form.component';

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
    // This will be for TaskDetailsComponent later
    // For now, it can redirect or show a placeholder
    redirectTo: '', // Redirect to task list for now
    pathMatch: 'full'
  }
];
