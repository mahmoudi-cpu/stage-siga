import { Component, OnInit } from '@angular/core';
import { Event } from '../Models/Event/event';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../services/event.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.component.html',
  styleUrls: ['./update-event.component.css']
})
export class UpdateEventComponent implements OnInit {
  submitted = false;
  idEvent!: number;
  event!: Event;
  events!: Observable<Event[]>;
  constructor(private route: ActivatedRoute, private router: Router, private eventService: EventService) { }

  ngOnInit(): void {
    this.event = new Event();
    this.idEvent = +this.route.snapshot.params['idEvent']; 

    this.eventService.getEvent(this.idEvent)
      .subscribe({
        next: (data: Event) => {
          console.log(data);
          this.event = data;
        },
        error: error => console.log(error)
      });
  }

  updateEvent(): void {
    this.eventService.updateEvent(this.idEvent, this.event)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.event = data as Event; 
        }
      }); 
  }

  onSubmit(): void {
    this.updateEvent();
  }

  BacktoAdminDashboard(){
    this.router.navigate(['AdminDashbord']);
  }
}
