import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Event } from '../Models/Event/event'; 
import { EventService } from '../services/event.service';
import { ShareholderService } from '../services/shareholder.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { TokenStorageServiceService } from '../services/token-storage-service.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  events!: Observable<Event[]>;
  idShareholder!: number;
  selectedEvent: Event | undefined;
  userMessage: string = '';
  botResponse: string = '';
  errorMessage: string = '';
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 3; // Modifier de 4 à 3

  totalPages: number = 1;
  paginatedEvents!: Observable<Event[]>;
  filteredEvents: Event[] = [];
  userEmail: string | null = null;
  decodedJwtData: any = null;

  constructor(private eventService: EventService, private router: Router, private shareholderService: ShareholderService, private activatedRoute: ActivatedRoute,
              private tokenStorageService: TokenStorageServiceService) { }

  ngOnInit(): void {
    console.log("idShareholder:", this.idShareholder);
    this.reloadData();
    this.loadUserData(); // Charger les données utilisateur lors de l'initialisation
  }
  
  reloadData(): void {
    this.getEvents();
  }
 
  private getEvents(): void {
    this.paginatedEvents = this.eventService.getEventsList().pipe(
        map(events => {
            this.filteredEvents = events.slice();
            this.updatePagination();
            return events;
        })
    );
  }

  eventDetails(idEvent: number): void {
    this.router.navigate(['detailsEvent', idEvent]);
  }

  AddEvent(): void {
    this.router.navigate(['AddEvent']);
  }

  updatePagination(): void {
    const totalItems = this.filteredEvents.length;
    this.totalPages = Math.ceil(totalItems / this.itemsPerPage);
    this.setPaginatedEvents();
  }

  setPaginatedEvents(): void {
    const startIdx = (this.currentPage - 1) * this.itemsPerPage;
    const endIdx = startIdx + this.itemsPerPage;
    this.paginatedEvents = of(this.filteredEvents.slice(startIdx, endIdx));
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.setPaginatedEvents(); // Mettre à jour les événements paginés
    }
  }
  
  searchEvent(): void {
    if (!this.searchTerm.trim()) {
      this.getEvents();
      return;
    }
    this.eventService.searchEventByNameEvent(this.searchTerm).subscribe(
      filteredEvents => {
        this.filteredEvents = filteredEvents;
        this.updatePagination();
      },
      error => console.error(error)
    );
  }

  addAndInvest(): void {
    this.router.navigate(['assign-shareholder/:id']);
  }

  likeEvent(event: Event): void {
    this.eventService.likeEvent(event.nameEvent).subscribe(() => {
      this.reloadData();
    });
  }

  dislikeEvent(event: Event): void {
    this.eventService.dislikeEvent(event.nameEvent).subscribe(() => {
      this.reloadData();
    });
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
    this.tokenStorageService.removeToken();
    this.router.navigate(['login']); // Rediriger vers la page de connexion
  }

}