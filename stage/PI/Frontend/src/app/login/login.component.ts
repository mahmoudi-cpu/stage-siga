import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';
import { TokenStorageServiceService } from 'src/app/services/token-storage-service.service'; // Make sure the path is correct

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup | any;

  constructor(
    private authService: AuthServiceService,
    private tokenStorageService: TokenStorageServiceService, // Add TokenStorageService here
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  submitForm() {
    this.authService.login(this.loginForm.value).subscribe((response) => {
      console.log(response);
      if (response.access_token) {
        console.log('JWT Token:', response.access_token);
        const jwtToken = response.access_token;
        this.tokenStorageService.saveToken(jwtToken); // Stocker le token
        this.tokenStorageService.saveUser(response.user); // Stocker l'utilisateur
        this.router.navigateByUrl('/home');
      }
    }, (error) => {
      console.error('Login Error:', error);
    });
  }
  

  isLoggedIn(): boolean {
    return localStorage.getItem('jwt') !== null;
  }
}
