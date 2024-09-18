import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Event } from '../Models/Event/event'; 
import { EventService } from '../services/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-event-listAdmin',
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./event-list.component .scss']
})
export class EventListComponentAdmin implements OnInit {
  events!: Observable<Event[]>;
  searchTerm: string = '';
  eventInfo: string = '';
  indiceRentabilite: number = 0;
  indiceRentabilites: { [key: number]: number } = {}; 
  

  constructor(private eventService: EventService, private router: Router, private activated: ActivatedRoute) { 
    // Initialiser indiceRentabilites pour éviter les erreurs
    this.indiceRentabilites = {};
  }

  ngOnInit(): void {
    this.reloadData();
  }

  exportDataToExcel(): void {
    // Exporter les événements vers Excel
    this.events.subscribe(data => {
      this.exportToExcel(data, 'events');
    });
  }

  getIndiceRentabilite(eventId: number) {
    this.eventService.calculIndiceRentabilite(eventId).subscribe(
      (indice: number) => {
        console.log('Indice de rentabilité pour l\'événement ' + eventId + ':', indice);
        this.indiceRentabilites[eventId] = indice; // Stocker l'indice de rentabilité dans la map
      },
      (error: any) => {
        console.error('Error fetching indice:', error);
      }
    );
  }

  reloadData(): void {
    this.getEvents();
  }

  private getEvents(): void {
    this.events = this.eventService.getEventsList();
    // Récupérer les indices de rentabilité pour chaque événement
    this.events.subscribe(events => {
      events.forEach(event => {
        this.getIndiceRentabilite(event.idEvent);
      });
    });
  }

  exportToExcel(data: any[], filename: string): void {
    // Ajouter une colonne pour l'indice de rentabilité
    const dataWithRentability = data.map(event => {
      const indiceRentabilite = this.getIndiceRentabiliteForEvent(event.idEvent);
      return { ...event, indiceRentabilite };
    });
  
    // Calculer et ajouter l'indice de rentabilité pour chaque événement
    dataWithRentability.forEach(event => {
      // Calculer l'indice de rentabilité pour cet événement
      const indiceRentabilite = this.getIndiceRentabiliteForEvent(event.idEvent);
      event['indiceRentabilite'] = indiceRentabilite;

      // Formater l'indice de rentabilité avec une virgule
      event['indiceRentabilite'] = indiceRentabilite.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    });
  
    // Créer une feuille de calcul
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataWithRentability);
  
    // Créer un classeur
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  
    // Convertir le classeur en un tableau d'octets
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // Enregistrer le fichier Excel
    this.saveExcelFile(excelBuffer, filename);
}

    
      private saveExcelFile(buffer: any, filename: string): void {
        // Convertir le tableau d'octets en un objet Blob
        const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    
        // Créer une URL pour le Blob
        const url: string = window.URL.createObjectURL(data);
    
        // Créer un élément <a> pour le téléchargement du fichier
        const a: HTMLAnchorElement = document.createElement('a');
        a.href = url;
        a.download = filename + '.xlsx';
    
        // Ajouter l'élément <a> au document
        document.body.appendChild(a);
    
        // Déclencher le téléchargement du fichier
        a.click();
    
        // Supprimer l'élément <a> du document
        document.body.removeChild(a);
    
        // Révoquer l'URL pour libérer les ressources
        window.URL.revokeObjectURL(url);
      }
     getIndiceRentabiliteForEvent(eventId: number): number {
    return this.indiceRentabilites[eventId] || 0;
  }
  eventDetails(id: number){
    this.router.navigate(['detailsEvent', id]);
  }

  AddEvent(){
    this.router.navigate(['AddEvent']);
  }

  searchEvent(): void {
    if (!this.searchTerm.trim()) {
      this.reloadData();
      return;
    }
    this.eventService.searchEventByNameEvent(this.searchTerm).subscribe(
      filteredEvent => this.events = of(filteredEvent),
      error => console.error(error)
    );
  }

  updateEvent(idEvent: number): void {
    this.router.navigate(['UpdateEvent', idEvent]);
  }

  deleteEvent(idEvent: number): void {
    this.eventService.deleteEvent(idEvent).subscribe({
      next: data => {
        console.log(data);
        this.reloadData();
      },
      error: error => console.log(error)
    });
  }

  BacktoAdminDashboard(): void {
    this.router.navigate(['side']);
  }
}
