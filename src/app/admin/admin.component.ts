import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminAuthService } from '../services/admin-auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{

  loginForm: FormGroup;
  
constructor(
  private fb: FormBuilder,
  private adminAuthService: AdminAuthService,
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
    this.adminAuthService.login(email, password).subscribe(
      (response) => {
        // If the authentication succeeds, redirect the user to the home page
        this.router.navigate(['/home']);
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

  this.adminAuthService.login(email, password).subscribe(
    (response) => {
      // If the authentication succeeds, redirect the user to the user page 
      this.router.navigate(['/userpage']);
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
