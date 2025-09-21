import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // Import RouterLink
import { AuthService } from '../../../../core/services/auth.service';
import { RegisterDto } from '../../../../core/models/auth.model';

// Custom validator for password matching
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink], // Add RouterLink here
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordMatchValidator }); // Add custom validator here
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const registerDto: RegisterDto = this.registerForm.value;
      this.authService.register(registerDto).subscribe({
        next: () => {
          console.log('Registration successful!'); // Add this line
          this.router.navigate(['/auth/login']); // Redirect to login page after successful registration
        },
        error: (err) => {
          console.error('Registration failed', err);
          // Here you can show an error message to the user
        }
      });
    }
  }
}
