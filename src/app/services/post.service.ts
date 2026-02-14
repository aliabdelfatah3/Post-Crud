import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { env } from '../../env/env';
import { Post } from './../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = env.apiUrl + '/posts';
  private postsSubject = new BehaviorSubject<Post[]>([]);
  posts$ = this.postsSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    this.initData();
  }

  private initData() {
    const loadFromApi = () => {
      this.refreshFromApi().pipe(take(1)).subscribe();
    };

    if (isPlatformBrowser(this.platformId)) {
      const localData = localStorage.getItem('my_posts');

      if (localData) {
        try {
          this.postsSubject.next(JSON.parse(localData));
        } catch {
          localStorage.removeItem('my_posts');
          loadFromApi();
        }
      } else {
        loadFromApi();
      }
    } else {
      loadFromApi();
    }
  }
  refreshFromApi(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl).pipe(
      map((data) => data.slice(0, 20)),
      tap((data) => this.updateStorage(data)),
      catchError((err) => {
        console.error('[refreshFromApi] ERROR:', err);

        // fallback: read from localStorage if available
        if (isPlatformBrowser(this.platformId)) {
          const localData = localStorage.getItem('my_posts');
          if (localData) {
            try {
              const parsed = JSON.parse(localData) as Post[];
              this.postsSubject.next(parsed);
              return of(parsed);
            } catch {
              // if localStorage is corrupted, remove it
              localStorage.removeItem('my_posts');
            }
          }
        }

        // final fallback
        return of([] as Post[]);
      }),
    );
  }

  getPost(id: number | string): Observable<Post | undefined> {
    return this.posts$.pipe(
      map((posts) => posts.find((p) => p.id == id)),
      take(1),
    );
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post).pipe(
      map((apiPost) => ({ ...post, ...apiPost, id: apiPost?.id ?? Date.now() })),
      tap((created) => {
        const updated = [created, ...this.postsSubject.value];
        this.updateStorage(updated);
      }),
      catchError(() => {
        const fallback = { ...post, id: Date.now() };
        const updated = [fallback, ...this.postsSubject.value];
        this.updateStorage(updated);
        return of(fallback);
      }),
    );
  }

  updatePost(id: number, updatedPost: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${id}`, updatedPost).pipe(
      map((apiPost) => ({ ...updatedPost, ...apiPost, id })),
      tap((finalPost) => {
        const posts = this.postsSubject.value.map((p) => (p.id === id ? finalPost : p));
        this.updateStorage(posts);
      }),
      catchError(() => {
        const posts = this.postsSubject.value.map((p) =>
          p.id === id ? { ...p, ...updatedPost, id } : p,
        );
        this.updateStorage(posts);
        return of({ ...updatedPost, id });
      }),
    );
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const posts = this.postsSubject.value.filter((p) => p.id !== id);
        this.updateStorage(posts);
      }),
      catchError(() => {
        const posts = this.postsSubject.value.filter((p) => p.id !== id);
        this.updateStorage(posts);
        return of(void 0);
      }),
    );
  }

  resetPosts(): Observable<Post[]> {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('my_posts');
    }

    return this.refreshFromApi();
  }

  private updateStorage(posts: Post[]) {
    // console.log('[updateStorage] posts =', posts.length);
    // console.log('[updateStorage] isBrowser =', isPlatformBrowser(this.platformId));

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('my_posts', JSON.stringify(posts));
      // console.log('[updateStorage] saved to localStorage ✅');
    }
    this.postsSubject.next(posts);
  }

  getPosts(): Observable<Post[]> {
    return this.posts$;
  }
}
