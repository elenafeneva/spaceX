import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';

function passwordMatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}

@Component({
  selector: 'app-sign-up',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp {
  signUpForm: FormGroup;
  errorMessage: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.signUpForm = this.fb.group(
      {
        name: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator() }
    );
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (!this.signUpForm.valid) return;
    this.loading = true;
    const { confirmPassword: _, ...payload } = this.signUpForm.value;
    this.authService.signUp(payload).subscribe({
      next: (res) => {
        this.loading = false;
        // TODO: store token and navigate (e.g. to dashboard or sign-in)
        console.log('Signed up', res);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.message ?? 'Sign up failed. Please try again.';
      },
    });
  }
}
