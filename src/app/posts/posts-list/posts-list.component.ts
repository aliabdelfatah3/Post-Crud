import { Component, OnInit } from '@angular/core'; // ضفنا OnInit
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-posts-list',
  standalone: true, // تأكد إنها موجودة
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
    // بدل ما ننادي loadPosts مرة واحدة، هنشترك (Subscribe) في الـ Observable
    // اللي جاي من الـ Service عشان أي تغيير في الـ LocalStorage يظهر هنا فوراً
    this.postService.posts$.subscribe({
      next: (data) => {
        this.posts = data;
        this.totalItems = data.length;
      },
    });
  }

  // الدالة دي بنستخدمها بس لو حابب تجبر الأبلكيشن يحدث من الـ API (زرار الـ Reset)
  resetToDefault() {
    if (confirm('Are you sure you want to reset all data and reload original posts?')) {
      localStorage.removeItem('my_posts'); // بنمسح المخزن
      this.postService.refreshFromApi(); // بنخلي الـ service تجيب داتا جديدة
      this.currentPage = 1; // بنرجع لأول صفحة
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
      // هنا بننادي دالة الحذف من الـ Service اللي عدلناها عشان تشيله من الـ LocalStorage
      this.postService.deletePost(id);
    }
  }

  // دالة مساعدة عشان نحسب عدد الصفحات بناءً على الـ pageSize
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
}
