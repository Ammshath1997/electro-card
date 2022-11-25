import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { UserService } from 'src/app/services/user.service';
import { switchMap } from 'rxjs';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordsDontMatch: true };
    } else {
      return null;
    };
  }
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {

  signupForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  }, { validators: passwordMatchValidator() })

  constructor(private authService: AuthenticationService,
    private router: Router,
    private toast: HotToastService,
    private userService: UserService) { }

  ngOnInit(): void {
  }

  get name() {
    return this.signupForm.get('name')
  }
  get email() {
    return this.signupForm.get('email')
  }
  get password() {
    return this.signupForm.get('password')
  }
  get confirmPassword() {
    return this.signupForm.get('confirmPassword')
  }

  submit() {
    if (!this.signupForm.valid) {
      return;
    }

    const { name, email, password } = this.signupForm.value;
    this.authService.signUp(email, password).pipe(
      switchMap(({ user: { uid } }) => this.userService.addUser({ uid, email, displayName: name })),
      this.toast.observe({
        success: "User created sucessfully",
        loading: "Creating user...",
        error: ({ message }) => `${message}`
      })
    ).subscribe((response) => {
      this.router.navigate(['/verification']);
    })
  }

}
