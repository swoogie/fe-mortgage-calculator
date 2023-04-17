import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})




export class LoginComponent {
login: FormGroup<any>;
form: any;


emailFormControl = new FormControl('', [
  Validators.required,
  Validators.email,
]);
passwordFormControl = new FormControl('', [
  Validators.required,
]);
  snackBar: any;
  router: any;


onLogin() {
  if (this.emailFormControl.valid && this.passwordFormControl.valid) {
    // Do login logic here
      const email = this.emailFormControl.value;
      const password = this.passwordFormControl.value;
  
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
constructor(private authService : AuthService){
  
}

}


