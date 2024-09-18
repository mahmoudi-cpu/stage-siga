import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../services/auth-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup | any;
  showPassword: boolean = false; // Flag to track password visibility

  constructor(
    private service: AuthServiceService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role: ['CUSTOMER', [Validators.required]] // Default role set to 'CUSTOMER'
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  submitForm() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      this.service.register(this.registerForm.value).subscribe(
        (response) => {
          if (response.id != null) {
            alert("Hello " + response.firstname + ", your account has been created as a " + response.role);
          }
        },
        (error) => {
          console.error('Error during registration:', error);
        }
      );
    } else {
      alert("Please fill all required fields correctly.");
    }
  }
}
