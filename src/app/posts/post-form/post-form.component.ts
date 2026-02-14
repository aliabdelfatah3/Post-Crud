import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PostService } from './../../services/post.service';
import { Observable, take } from 'rxjs';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css',
})
export class PostFormComponent implements OnInit {
  postForm: FormGroup;
  isEditMode: boolean = false;
  postId: number | null = null;

  constructor(
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.postForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(5)]),
      body: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.postId = idParam ? Number(idParam) : null;
    if (this.postId) {
      this.isEditMode = true;
      this.loadPostData(this.postId);
    }
  }
  loadPostData(id: number) {
    this.postService
      .getPost(id)
      .pipe(take(1))
      .subscribe((post) => {
        if (!post) return;
        this.postForm.patchValue(post);
      });
  }

  onSubmit() {
    if (this.postForm.invalid) return;

    const post = {
      title: this.postForm.value.title ?? '',
      body: this.postForm.value.body ?? '',
    } as Post;

    const action$: Observable<Post> =
      this.isEditMode && this.postId !== null
        ? this.postService.updatePost(this.postId, post)
        : this.postService.createPost(post);

    action$.pipe(take(1)).subscribe({
      next: () => {
        alert(`Post ${this.isEditMode ? 'updated' : 'created'} successfully!`);
        this.router.navigate(['/posts']);
      },
      error: () => {
        alert('Something went wrong, please try again.');
      },
    });
  }
}
