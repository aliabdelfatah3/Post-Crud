import { Routes } from '@angular/router';
import { PostsListComponent } from './posts/posts-list/posts-list.component';
import { PostFormComponent } from './posts/post-form/post-form.component';
import { PostDetailsComponent } from './posts/post-details/post-details.component';

export const routes: Routes = [
  { path: 'posts', component: PostsListComponent },
  {
    path: 'posts/add',
    component: PostFormComponent,
  },
  {
    path: 'posts/edit/:id',
    component: PostFormComponent,
  },
  { path: 'posts/:id', component: PostDetailsComponent },
  {
    path: '',
    redirectTo: 'posts',
    pathMatch: 'full',
  },
];
