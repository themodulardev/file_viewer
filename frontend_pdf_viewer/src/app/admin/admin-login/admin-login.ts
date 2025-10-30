import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss',
})
export class AdminLogin {
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
