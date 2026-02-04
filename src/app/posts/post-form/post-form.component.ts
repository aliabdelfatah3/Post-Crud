import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PostService } from './../../services/post.service';

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
    this.postId = this.route.snapshot.params['id'];
    if (this.postId) {
      this.isEditMode = true;
      this.loadPostData(this.postId);
    }
  }
  loadPostData(id: number) {
    this.postService.getPost(id).subscribe((post: any) => {
      this.postForm.patchValue(post);
    });
  }
  onSubmit() {
    if (this.postForm.valid) {
      if (this.isEditMode) {
        this.postService.updatePost(this.postId!, this.postForm.value).subscribe(() => {
          alert('Post updated successfully');
          this.router.navigate(['/posts']);
        });
      } else {
        this.postService.createPost(this.postForm.value).subscribe(() => {
          alert('Post created successfully');
          this.router.navigate(['/posts']);
        });
      }
    }
  }
}
