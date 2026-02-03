import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';
  private postsSubject = new BehaviorSubject<any[]>([]);
  posts$ = this.postsSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.initData();
  }

  // 1. تشغيل الداتا لأول مرة
  private initData() {
    // 2. بنسأل: هل إحنا شغالين في المتصفح؟
    if (isPlatformBrowser(this.platformId)) {
      const localData = localStorage.getItem('my_posts');
      if (localData) {
        this.postsSubject.next(JSON.parse(localData));
      } else {
        this.refreshFromApi();
      }
    } else {
      // لو إحنا على السيرفر، ممكن نجيب الداتا من الـ API مباشرة
      this.refreshFromApi();
    }
  }

  // 2. جلب الداتا من الـ API (Reset)
  refreshFromApi() {
    this.http.get<any[]>(this.apiUrl).subscribe((data) => {
      const limitedData = data.slice(0, 20); // هنجيب أول 20 بس للتجربة
      this.updateStorage(limitedData);
    });
  }

  // 3. عرض بوست واحد (للتعديل أو التفاصيل)
  getPost(id: number | string): Observable<any> {
    // بندور عليه في الـ Local الأول عشان لو ضفناه جديد مش هيكون موجود في الـ API الحقيقي
    const posts = this.postsSubject.value;
    const post = posts.find((p) => p.id == id);

    // بنرجعه كـ Observable عشان الـ Component متعود على كده
    return new Observable((observer) => {
      observer.next(post);
      observer.complete();
    });
  }

  // 4. إضافة بوست جديد
  createPost(post: any): Observable<any> {
    const currentPosts = this.postsSubject.value;
    const newPost = { ...post, id: Date.now() }; // بنعمل ID وهمي
    this.updateStorage([newPost, ...currentPosts]);

    return new Observable((obs) => {
      obs.next(newPost);
      obs.complete();
    });
  }

  // 5. تعديل بوست
  updatePost(id: number, updatedPost: any): Observable<any> {
    const posts = this.postsSubject.value;
    const index = posts.findIndex((p) => p.id == id);
    if (index !== -1) {
      posts[index] = { ...posts[index], ...updatedPost };
      this.updateStorage([...posts]);
    }
    return new Observable((obs) => {
      obs.next(updatedPost);
      obs.complete();
    });
  }

  // 6. حذف بوست
  deletePost(id: number) {
    const filteredPosts = this.postsSubject.value.filter((p) => p.id !== id);
    this.updateStorage(filteredPosts);
  }

  // دالة مساعدة لتحديث الـ LocalStorage والـ Subject
  private updateStorage(posts: any[]) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('my_posts', JSON.stringify(posts));
    }
    this.postsSubject.next(posts);
  }

  // دي اللي الـ List بتناديها (عشان متطلعش Error عندك)
  getPosts() {
    return this.posts$;
  }
}
