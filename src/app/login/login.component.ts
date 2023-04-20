import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';


const fb = new FormBuilder();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
loginForm: FormGroup;


constructor(
  private fb: FormBuilder,
  private userAuthService: UserAuthService,
  private router: Router,
  private snackBar: MatSnackBar
) {
  
}

ngOnInit(): void {
  this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });


  if (this.loginForm.valid) {
    // Do login logic here
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    // Call your authentication service to authenticate the user
    this.userAuthService.login(email, password).subscribe(
      (response) => {
        // If the authentication succeeds, redirect the user to the user page
        this.router.navigate(['/user-page']);
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

}

onSubmit() {
  console.log(this.loginForm.value);

  const email = this.loginForm.get('email').value;
  const password = this.loginForm.get('password').value;

  this.userAuthService.login(email, password).subscribe(
    (response) => {
      // If the authentication succeeds, redirect the user to the user page 
      this.router.navigate(['/user-page']);
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

}
