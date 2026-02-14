import { Routes } from '@angular/router';
import { POSTS_ROUTES } from './posts/posts.routes';

export const routes: Routes = [
  {
    path: 'posts',
    loadChildren: () => import('./posts/posts.routes').then((m) => m.POSTS_ROUTES),
  },
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
  { path: '**', redirectTo: 'posts' },
];
