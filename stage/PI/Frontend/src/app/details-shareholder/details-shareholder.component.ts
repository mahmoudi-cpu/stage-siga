import { Shareholder } from '../Models/Shareholder/shareholder';
import { Component, OnInit, Input } from '@angular/core';
import { ShareholderService } from '../services/shareholder.service';
import { ShareholderListComponent } from '../shareholder-list/shareholder-list.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details-Shareholder',
  templateUrl: './details-Shareholder.component.html',
  styleUrls: ['./details-Shareholder.component.css']
})
export class DetailsShareholderComponent implements OnInit {

    id!: number;
    shareholder!: Shareholder;

    constructor(private route: ActivatedRoute,private router: Router,
                private shareholderService: ShareholderService) { }

                ngOnInit() {
                  this.id = this.route.snapshot.params['id'];
              
                  this.shareholderService.getShareholder(this.id)
                      .subscribe(
                          data=> {
                              console.log(data);
                              this.shareholder = data;
                          },
                          error => console.log(error)
                      );
              }

              BacktoAdminDashboard(){
                this.router.navigate(['AdminDashbord']);
              }
}
