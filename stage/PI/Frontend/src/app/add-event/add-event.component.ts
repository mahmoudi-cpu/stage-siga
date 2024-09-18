import { Component, OnInit } from '@angular/core';
import { Event } from "./../Models/Event/event";
import { EventService } from "./../services/event.service";
import { Router } from '@angular/router';
import { EventStatus } from "./../Models/Event/EventStatus";
import { TypeEvent } from "./../Models/Event/TypeEvent";
@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {
  submitted = false;
  event: Event = new Event();
  
  // Utiliser Object.keys pour obtenir seulement les noms des énumérations
  eventTypes = Object.keys(TypeEvent).filter(key => isNaN(Number(key)));
  eventStatuses = Object.keys(EventStatus).filter(key => isNaN(Number(key)));

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    console.log(this.eventTypes); // Vérifiez que les valeurs sont correctes
    console.log(this.eventStatuses);
  }

  save() {
    this.eventService.addEvent(this.event).subscribe(
      data => {
        console.log(data);
        this.event = new Event();
      },
      error => console.log(error)
    );
  }

  onSubmit() {
    this.submitted = true;
    this.save();
  }

  BacktoAdminDashboard() {
    this.router.navigate(['AdminDashbord']);
  }
}
