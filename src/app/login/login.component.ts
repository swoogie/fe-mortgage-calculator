import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


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
  private authService: AuthService,
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
    this.authService.login(email, password).subscribe(
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
}

}
// emailFormControl = new FormControl('', [
//   Validators.required,
//   Validators.email,
// ]);
// passwordFormControl = new FormControl('', [
//   Validators.required,
// ]);
  
// onLogin() {
//   if (this.emailFormControl.valid && this.passwordFormControl.valid) {
//     // Do login logic here
//       const email = this.emailFormControl.value;
//       const password = this.passwordFormControl.value;
  
//       // Call your authentication service to authenticate the user
//       this.authService.login(email, password).subscribe(
//         (response) => {
//           // If the authentication succeeds, redirect the user to the home page
//           this.router.navigate(['/home']);
//         },
//         (error) => {
//           // If the authentication fails, show an error message to the user
//           this.snackBar.open('Invalid email or password', 'Dismiss', {
//             duration: 5000,
//             horizontalPosition: 'center',
//             verticalPosition: 'bottom',
//           });
//         }
//       );
//   }
// }

