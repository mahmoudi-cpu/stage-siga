import { Component } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { TokenStorageServiceService } from 'src/app/services/token-storage-service.service'; // Inject TokenStorageService

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  userConnected: any;
  decodedJwtData: any;

  constructor(
    private authService: AuthServiceService,
    private tokenStorageService: TokenStorageServiceService // Utiliser TokenStorageService
  ) {
    this.loadUserData();
  }

  loadUserData() {
    // Utiliser TokenStorageService pour accéder au JWT
    this.userConnected = this.tokenStorageService.getToken();
    if (this.userConnected) {
      let jwt = this.userConnected;
      let jwtData = jwt.split('.')[1];
      let decodedJwtJsonData = window.atob(jwtData);
      this.decodedJwtData = JSON.parse(decodedJwtJsonData);
      console.log('user ::::::::', this.decodedJwtData.sub);
    }
  }

  logout() {
    this.authService.logout().subscribe(
      (response) => {
        console.log('Logout successful');
        this.tokenStorageService.removeToken(); // Supprimer le token lors de la déconnexion
      },
      (error) => {
        console.error('Logout error:', error);
      }
    );
  }
}
