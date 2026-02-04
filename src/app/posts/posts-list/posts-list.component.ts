import { Component, OnInit } from '@angular/core'; // ضفنا OnInit
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.css',
})
export class PostsListComponent implements OnInit {
  posts: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postService.posts$.subscribe({
      next: (data) => {
        this.posts = data;
        this.totalItems = data.length;
      },
    });
  }

  resetToDefault() {
    if (confirm('Are you sure you want to reset all data and reload original posts?')) {
      localStorage.removeItem('my_posts');
      this.postService.refreshFromApi();
      this.currentPage = 1;
    }
  }

  get pagedPosts() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.posts.slice(startIndex, startIndex + this.pageSize);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  deletePost(id: number) {
    if (confirm('Are you sure?')) {
      this.postService.deletePost(id);
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
}
