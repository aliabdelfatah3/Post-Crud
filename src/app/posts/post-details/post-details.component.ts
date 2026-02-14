import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { take } from 'rxjs';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './post-details.component.html',
})
export class PostDetailsComponent implements OnInit {
  post?: Post;

  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.params['id'];
    const id = idParam ? Number(idParam) : null;

    if (id === null) {
      this.isLoading = false;
      return;
    }

    this.postService
      .getPost(id)
      .pipe(take(1))
      .subscribe((data) => {
        this.post = data;
        this.isLoading = false;
      });
  }
}
