import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

const fb = new FormBuilder().nonNullable;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    // Handle form submission
    if (this.form.invalid) {
      return;
    }
  
    // Get the form values
    const firstName = this.form.get('firstname').value;
    const lastName = this.form.get('lastname').value;
    const email = this.form.get('email').value;
    const password = this.form.get('password').value;
  
    // Do something with the form values (e.g. send an HTTP request)
    console.log('Form submitted!');
    console.log(`First Name: ${firstName}`);
    console.log(`Last Name: ${lastName}`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  }
}

export class FirstNameValidator {
  static validate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value && value.trim().length > 0) {
        return null;
      } else {
        return { 'firstname': true };
      }
    };
  }
}

export class LastNameValidator {
  static validate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value && value.trim().length > 0) {
        return null;
      } else {
        return { 'lastname': true };
      }
    };
  }
}
