import {FormControl} from "@angular/forms";
import {catchError, map} from "rxjs/operators";
import { ApiService } from '../services/api.service';

export function emailAvailabilityValidator(apiService: ApiService) {
  return (control: FormControl) => {
    const email = control.value;
    return apiService.checkEmail(email).pipe(
      map((response: any) => {
        // this.isEmailAvailable = true;
        //  control.updateValueAndValidity();
        return response.available ? { emailAvailable: true } : { emailNotAvailable: true };
      }),
      catchError((error) => {
        if (error.status === 409) {
          this.isEmailAvailable = false;
          this.emailNotAvailableMessage = error.error?.message || error.error;
          return [{emailNotAvailable: true}];
        } else {
          console.error('An unexpected error occurred:', error);
          return [];
        }
      })
    );
  };
}
