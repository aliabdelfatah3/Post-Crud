import { Routes } from '@angular/router';

export const POSTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./posts-list/posts-list.component').then((m) => m.PostsListComponent),
  },
  {
    path: 'add',
    loadComponent: () => import('./post-form/post-form.component').then((m) => m.PostFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./post-form/post-form.component').then((m) => m.PostFormComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./post-details/post-details.component').then((m) => m.PostDetailsComponent),
  },
];
