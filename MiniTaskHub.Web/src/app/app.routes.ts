import { Routes } from '@angular/router';
import { TaskFormComponent } from './features/tasks/components/task-form/task-form.component';
import { TaskDetailsComponent } from './features/tasks/components/task-details/task-details.component';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { TaskListComponent } from './features/tasks/components/task-list/task-list.component';
import { authGuard } from './features/auth/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'tasks', component: TaskListComponent, canActivate: [authGuard] },
    { path: 'create', component: TaskFormComponent, canActivate: [authGuard] },
    { path: 'edit/:id', component: TaskFormComponent,canActivate: [authGuard] },
    { path: 'tasks/:id', component: TaskDetailsComponent, canActivate: [authGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent }
];
