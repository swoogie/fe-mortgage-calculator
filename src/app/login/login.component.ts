import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../services/auth.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';
import jwtDecode from 'jwt-decode';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from '../services/api.service';

const fb = new FormBuilder();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  showLogin: boolean = true;
  isEmailAvailable: boolean;
  emailNotAvailableMessage: string;

  constructor(
    private fb: FormBuilder,
    private userAuthService: UserAuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private apiService: ApiService
  ) {}

  toggleView() {
    this.showLogin = !this.showLogin;
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: ['', [Validators.required]],
    });

    this.registerForm = this.fb.group({
      email: [
        '',
        {
          validators: [
            Validators.required,
            Validators.email,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
          asyncValidators: [this.emailAvailabilityValidator()],
          updateOn: 'blur',
        },
      ],
      password: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
    });
  }

  emailAvailabilityValidator() {
    return (control: FormControl) => {
      const email = control.value;
      return this.apiService.checkEmail(email).pipe(
        map((response: any) => {
          this.isEmailAvailable = true;
          return response.available ? null : { emailNotAvailable: true };
        }),
        catchError((error) => {
          if (error.status === 409) {
            return [{ emailNotAvailable: true }];
          } else {
            console.error('An unexpected error occurred:', error);
            return [];
          }
        })
      );
    };
  }

  onSubmit() {
    if (this.loginForm.valid && this.showLogin) {
      const email = this.loginForm.get('email').value;
      const password = this.loginForm.get('password').value;

      this.userAuthService.login(email, password).subscribe({
        next: (res: any) => {
          const token = res.access_token;
          const decodedToken: any = jwtDecode(token);
          this.userAuthService.setEmail(decodedToken.sub);

          this.userAuthService
            .getUserRole(decodedToken.sub)
            .subscribe((response) => {
              this.userAuthService.userRole = response.toString();
              if (this.userAuthService.userRole == 'ADMIN') {
                localStorage.setItem('adminToken', res.access_token);
                this.userAuthService.loginState();
                this.router.navigate(['/admin/applications']);
              } else {
                localStorage.setItem('userToken', res.access_token);
                this.userAuthService.loginState();
                this.router.navigate(['/']);
              }
            });
        },
        error: (error) => {
          console.log(error);
          this.snackBar.open('Invalid email or password', 'Dismiss', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        },
      });
    } else if (this.showLogin) {
      this.loginForm.markAllAsTouched();
    }

    if (this.registerForm.valid && !this.showLogin) {
      const email = this.registerForm.get('email').value;
      const password = this.registerForm.get('password').value;
      const firstName = this.registerForm.get('firstName').value;
      const lastName = this.registerForm.get('lastName').value;

      this.userAuthService
        .register(firstName, lastName, email, password)
        .subscribe((response: any) => {
          console.log('registered', response);
          this.snackBar.open(
            'Register successful, you can now login ✅',
            'Dismiss',
            {
              duration: 10000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            }
          );
          this.toggleView();
        });
    } else if (!this.showLogin) {
      this.registerForm.markAllAsTouched();
    }
  }
}
