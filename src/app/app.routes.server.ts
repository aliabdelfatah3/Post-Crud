// src/app/app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'posts/edit/:id',
    renderMode: RenderMode.Client, // بنقول لـ Angular: المسار ده سيبيه للمتصفح (Client) مكيش دعوة بيه في الـ Build
  },
  {
    path: 'posts/:id',
    renderMode: RenderMode.Client, // نفس الكلام لصفحة التفاصيل
  },
  {
    path: '**', // أي مسار تاني (زي الـ List والـ Add)
    renderMode: RenderMode.Prerender,
  },
];
