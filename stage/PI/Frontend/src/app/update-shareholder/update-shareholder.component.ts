import { Component, OnInit } from '@angular/core';
import { Shareholder, TypeShareholder} from '../Models/Shareholder/shareholder';
import { ActivatedRoute, Router } from '@angular/router';
import { ShareholderService } from '../services/shareholder.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-update-shareholder',
  templateUrl: './update-shareholder.component.html',
  styleUrls: ['./update-shareholder.component.css']
})
export class UpdateShareholderComponent implements OnInit {
  submitted = false;
  id !: number;
  shareholder!: Shareholder;
  shareholders!: Observable<Shareholder[]>;
  shareholderTypeOptions: string[] = Object.values(TypeShareholder);

  constructor(private route: ActivatedRoute, private router: Router, private shareholderService: ShareholderService) { }

  ngOnInit(): void {
    this.shareholder = new Shareholder();
    
    this.id = +this.route.snapshot.params['id']; 

    this.shareholderService.getShareholder(this.id)
      .subscribe({
        next: (data: Shareholder) => {
          console.log(data);
          this.shareholder = data;
        },
        error: error => console.log(error)
      });
  }

  updateShareholder(): void {
    this.shareholderService.updateShareholder(this.id, this.shareholder)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.shareholder = data as Shareholder; 
        }
      }); 
  }

  onSubmit(): void {
    this.updateShareholder();
  }

  BacktoAdminDashboard(){
    this.router.navigate(['ShareholderAdmin']);
  }
}
