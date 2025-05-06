import { Routes } from '@angular/router';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskDetailsComponent } from './components/task-details/task-details.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TaskListComponent } from './components/task-list/task-list.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'tasks', component: TaskListComponent },
    { path: 'create', component: TaskFormComponent },
    { path: 'edit/:id', component: TaskFormComponent },
    { path: 'tasks/:id', component: TaskDetailsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent }
];
