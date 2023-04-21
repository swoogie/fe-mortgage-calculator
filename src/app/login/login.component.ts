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
import jwtDecode, * as jwt_decode from 'jwt-decode';
import { Role } from '../interfaces/role';

const fb = new FormBuilder();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showLogin: boolean = true;

  constructor(
    private fb: FormBuilder,
    private userAuthService: UserAuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

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
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
    });
  }

  onSubmit() {
    console.log(this.loginForm.value);

    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;

    this.userAuthService.login(email, password).subscribe(
      (response) => {
        // If the authentication succeeds, extract the token and decode it to get the role
        const token = response.token;
        const decodedToken: any = jwtDecode(token);

        // Redirect the user to the appropriate page based on their role
        if (decodedToken.role === 'user') {
          this.router.navigate(['/user-page']);
        } else if (decodedToken.role === 'admin') {
          this.router.navigate(['/admin-page']);
        }
      },
      (error) => {
        // If the authentication fails, show an error message to the user
        this.snackBar.open('Invalid email or password', 'Dismiss', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
    );
  }
  toggleView() {
    this.showLogin = !this.showLogin;
  }
}
