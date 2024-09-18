import { Component, OnInit } from '@angular/core';
import { Shareholder } from "./../Models/Shareholder/shareholder";
import { ShareholderService } from "../services/shareholder.service";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-shareholder',
  templateUrl: './add-shareholder.component.html',
  styleUrls: ['./add-shareholder.component.scss']
})
export class AddshareholderComponent implements OnInit {
  submitted = false;
  shareholder: Shareholder = new Shareholder();
  selectedIdEvent: string | undefined; // ID de l'événement sélectionné
  idShareholder: number | undefined; // ID du shareholder nouvellement créé

  constructor(private shareholderService: ShareholderService,
              private router: Router, 
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
  }

  save() {
    this.shareholderService.addShareholder(this.shareholder).subscribe(
      (shareholder: any) => {
        console.log(shareholder);
        // Stockez l'ID du shareholder nouvellement créé
        this.idShareholder = shareholder.idShareholder;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  assignShareholderToEvent() {
    // Assurez-vous que l'ID du shareholder et de l'événement sont définis
    if (this.idShareholder && this.selectedIdEvent) {
      const shareholderIdString: string = this.idShareholder.toString(); // Convertir en string
      const eventIdString: string = this.selectedIdEvent.toString(); // Convertir en string
      
      this.shareholderService.assignShareholderToEvent(shareholderIdString, eventIdString).subscribe(
        (response: any) => {
          console.log(response);
          this.router.navigate(['/events']);
        },
        (error: any) => {
          console.error(error);
        }
      );
    } else {
      console.error('Veuillez sélectionner un événement.');
    }
  }

  onSubmit() {
    this.submitted = true;
    this.save();
  }

  BacktoAdminDashboard(){
    this.router.navigate(['AdminDashboard']);
  }
}
