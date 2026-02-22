import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('spaceX.app');

  constructor(private authService: AuthService, private router: Router) {
    const token = this.authService.getToken();
    const currentPath = window.location.pathname;
    if (token && (currentPath === '/' || currentPath === '')) {
      this.router.navigate(['/dashboard']);
    } 
    else if (!token && currentPath !== '/' && currentPath !== '/sign-up') {
      this.router.navigate(['/']);
    }
  }
}
