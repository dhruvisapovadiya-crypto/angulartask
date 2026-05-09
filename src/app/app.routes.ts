import { Routes } from '@angular/router';
import { Login } from './login/login';
import { UserList } from './user-list/user-list';
import { AddUser } from './add-user/add-user';

export const routes: Routes = [
    { path: '', component: Login },
    { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard) },
    { path: 'add-user', component: AddUser },
    { path: 'user-list', component: UserList },
];
