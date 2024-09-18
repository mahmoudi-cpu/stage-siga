import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import Chart from 'chart.js/auto';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { Event } from '../Models/Event/event'; 
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-event-statistics',
  templateUrl: './event-statistics.component.html',
 
})
export class EventStatisticsComponent implements OnInit {
    events!: Observable<Event[]>;

constructor(private eventService: EventService, private router: Router) { }

ngOnInit(): void {
  this.loadEventsData();
}

loadEventsData(): void {
  this.eventService.getEventsList().subscribe(
    (events: Event[]) => {
      this.events = of(events);
      this.renderChart();
    },
    (error: any) => {
      console.error('Error loading events data:', error);
      // Gérer l'erreur ici, par exemple en affichant un message à l'utilisateur
    }
  );
}
BacktoAdminDashboard(): void {
  this.router.navigate(['side']);
}

renderChart(): void {
    // Vérifier d'abord si les données des événements sont disponibles
    this.events.subscribe(
      (events: Event[]) => {
        // Extraire les noms, likes et dislikes des événements
        const eventNames = events.map(event => event.nameEvent);
        const likes = events.map(event => event.likes);
        const dislikes = events.map(event => event.dislikes);
  
        // Récupérer l'élément canvas du graphique
      
  
        // Vérifier si l'élément canvas existe
        const ctx = document.getElementById('eventChart') as HTMLCanvasElement; // Assertion de type
        if (ctx) {
          // Créer le graphique avec Chart.js
          new Chart(ctx, {
            type: 'bar',
            data: {
              labels: eventNames,
              datasets: [
                {
                  label: 'Likes',
                  data: likes,
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1
                },
                {
                  label: 'Dislikes',
                  data: dislikes,
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 1
                }
              ]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          });
        }
      },
      (error: any) => {
        console.error('Error loading events data:', error);
        // Gérer l'erreur ici, par exemple en affichant un message à l'utilisateur
      }
    );
  }
}  