import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-sign-in',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
})
export class SignIn {
  signInForm: FormGroup;
  errorMessage: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (!this.signInForm.valid) return;
    this.loading = true;
    this.authService.signIn(this.signInForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        // TODO: store token (e.g. in a service or localStorage), then navigate
        console.log('Signed in', res);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.message ?? 'Sign in failed. Please try again.';
      },
    });
  }
}
