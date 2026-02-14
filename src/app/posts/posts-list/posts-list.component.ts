import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../pagination/pagination.component';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PaginationComponent],
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css'],
})
export class PostsListComponent {
  isLoading = true;

  Math = Math;

  // pagination
  private currentPageSubject = new BehaviorSubject<number>(1);
  currentPage$ = this.currentPageSubject.asObservable();
  private pageSizeSubject = new BehaviorSubject<number>(10);
  pageSize$ = this.pageSizeSubject.asObservable();

  pageSize = 10;
  totalItems = 0;

  // paged posts observable
  pagedPosts$!: Observable<Post[]>;

  constructor(private postService: PostService) {
    this.pagedPosts$ = combineLatest([
      this.postService.posts$,
      this.currentPage$,
      this.pageSize$,
    ]).pipe(
      tap(([posts]) => (this.totalItems = posts.length)),
      map(([posts, page, size]) => {
        const start = (page - 1) * size;
        return posts.slice(start, start + size);
      }),
    );

    this.postService.posts$.pipe(take(2)).subscribe(() => {
      this.isLoading = false;
    });
  }

  /** Pagination helpers */
  changePage(page: number) {
    const totalPages = Math.max(1, Math.ceil(this.totalItems / this.pageSize));
    const safePage = Math.min(Math.max(page, 1), totalPages);
    this.currentPageSubject.next(safePage);
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.pageSizeSubject.next(size);
    this.currentPageSubject.next(1);
  }

  /** Delete a post reactively */
  deletePost(id: number) {
    if (confirm('Are you sure?')) {
      this.postService.deletePost(id).subscribe();
    }
  }

  /** Reset data */
  resetToDefault() {
    if (confirm('Are you sure you want to reset all data and reload original posts?')) {
      this.postService.resetPosts().subscribe();
      this.currentPageSubject.next(1);
    }
  }
}
