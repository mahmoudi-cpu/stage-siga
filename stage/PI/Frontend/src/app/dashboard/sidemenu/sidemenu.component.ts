import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { TokenStorageServiceService } from 'src/app/services/token-storage-service.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css']
})
export class SidemenuComponent implements OnInit {
  userEmail: string | null = null;
  decodedJwtData: any = null;

  constructor(
    private authService: AuthServiceService,
    private tokenStorageService: TokenStorageServiceService // Inject TokenStorageService
  ) {}

  ngOnInit(): void {
    this.loadUserData(); // Charger les données utilisateur lors de l'initialisation
  }

  loadUserData(): void {
    // Utiliser le TokenStorageService pour récupérer le JWT
    const jwt = this.tokenStorageService.getToken();
    console.log('JWT from TokenStorageService:', jwt); // Debug log

    if (jwt) {
      try {
        const jwtData = jwt.split('.')[1]; // Extraire la partie utile du JWT
        const decodedJwtJsonData = window.atob(jwtData); // Décoder le JWT
        const decodedJwtData = JSON.parse(decodedJwtJsonData); // Parse JSON

        console.log('Decoded JWT Data:', decodedJwtData); // Vérification du contenu du JWT
        this.userEmail = decodedJwtData.sub; // Assurez-vous que 'sub' contient l'email

        // Sauvegarder les données décodées si besoin
        this.decodedJwtData = decodedJwtData;

      } catch (error) {
        console.error('Failed to decode JWT:', error); // Gestion d'erreur de décodage
      }
    } else {
      console.warn('JWT not found in TokenStorageService'); // Le JWT est manquant
    }
  }

  logout(): void {
    this.authService.logout().subscribe(
      (response) => {
        console.log('Logout successful');
        this.tokenStorageService.removeToken(); // Suppression du JWT lors de la déconnexion
      },
      (error) => {
        console.error('Logout error:', error);
      }
    );
  }
}
