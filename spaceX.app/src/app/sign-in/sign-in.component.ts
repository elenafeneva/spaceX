import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';


@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, 
    ReactiveFormsModule, 
    RouterLink, 
    InputGroupModule, 
    InputGroupAddonModule, 
    InputTextModule, 
    ButtonModule,
    CardModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;
  errorMessage: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (!this.signInForm.valid) return;
    const credentials = {
      email: this.signInForm.get('email')!.value,
      password: this.signInForm.get('password')!.value,
    };
    this.loading = true;
    this.authService.signIn(credentials).subscribe({
      next: (token) => {
        this.loading = false;
        this.signInForm.get('password')?.reset();
        this.authService.setToken(token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.message ?? 'Sign in failed. Please try again.';
      },
    });
  }
}
