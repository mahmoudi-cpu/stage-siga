import { Event } from 'src/app/Models/Event/event';
import { Component, OnInit, Input } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { EventListComponent } from 'src/app//event-list/event-list.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details-event',
  templateUrl: './details-event.component.html',
  styleUrls: ['./details-event.component.css']
})
export class DetailsEventComponent implements OnInit {

    idEvent!: number;
    event!: Event;

    constructor(private route: ActivatedRoute,private router: Router,
                private eventService: EventService) { }

    ngOnInit() {
        this.event = new Event();

        this.idEvent = this.route.snapshot.params['idEvent'];

        this.eventService.getEvent(this.idEvent)
                .subscribe(data => {
                console.log(data)
                this.event = data;
      }, error => console.log(error));
    }

    list(){
        this.router.navigate(['Event']);
    }
    BacktoAdminDashboard(){
      this.router.navigate(['AdminDashbord']);
    }
}
