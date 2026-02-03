import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

template: `
  <nav>
    <button routerLink="/posts">Go to Posts</button>
  </nav>
  <router-outlet></router-outlet>
`;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected readonly title = signal('Posts-Crud');
}
