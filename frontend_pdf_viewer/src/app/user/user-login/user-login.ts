import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-login',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './user-login.html',
  styleUrl: './user-login.scss',
})
export class UserLogin {
loginForm:FormGroup;
  constructor(private fb:FormBuilder) {
    this.loginForm=this.fb.group({
      username:['', [Validators.required, Validators.email]],
      password:['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login() {
    if(this.loginForm.valid) {
      // Perform login action
      console.log('Logging in with', this.loginForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
