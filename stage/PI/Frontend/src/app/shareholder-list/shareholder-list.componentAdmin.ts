import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Import map operator
import { Shareholder,TypeShareholder } from '../Models/Shareholder/shareholder'; // Import Hardware and HardwareStatus
import { ShareholderService } from '../services/shareholder.service'; 
import { Router } from '@angular/router';
import { of } from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {Subscription} from "rxjs";
import {GoogleChartInterface, GoogleChartType} from "ng2-google-charts";
import {Chart} from "chart.js";
import {keyframes} from "@angular/animations";
//import { navItems } from '../layouts/full/sidebar/sidebar-data';
import swal from "sweetalert";
type double =number;

@Component({
  selector: 'app-shareholder-list-admin',
  templateUrl: './shareholder-list.componentAdmin.html', 
  styleUrls: ['./shareholder-list.component.scss'] 
})

export class ShareholderListComponentAdmin implements OnInit {
  shareholders!: Observable<Shareholder[]>; 
  searchTerm: string = '';
  availabilityFilter: string = 'ALL'; // Define availabilityFilter property
  shareholder!: Shareholder;
  id:any
    x1: any;
    x: any
    x2: any;
  
    Shareholder: any = [];
    searchText: any;
    http!: HttpClient;
   
    
    y!: Subscription
    i!: number
    countShareholder: any;
    currentShareholder!:Shareholder;
    investmentAmount: double = 0;
    selectedType: TypeShareholder | undefined;
    types: TypeShareholder[] = [TypeShareholder.SUPPLIER, TypeShareholder.ASSOCIATION, TypeShareholder.BANK];
    interestRate: double | undefined;
    @Input() listShareholder!: Shareholder[];
    @Output() deleteEvent = new EventEmitter<Shareholder>();
  @Output() updateEvent = new EventEmitter<Shareholder>();

  constructor(private shareholderService: ShareholderService, private router: Router) { }
 // navItems = navItems;

 
 calculateInterestRate(): void {
  if (this.selectedType && this.investmentAmount > 0) {
    this.shareholderService.getInterestRateForShareholder(this.selectedType, this.investmentAmount)
      .subscribe(
        (rate: double)=> this.interestRate = rate,
        (error: any)=> console.log('Une erreur est survenue lors du calcul du taux d\'intérêt :', error)
      );
  }
}
pLikes:any
pUnlikes:any
countL:any
Unlikes:any
Likes:any
 generateChart (){

   this.shareholderService.CountLikes().subscribe(
     // @ts-ignore
     (data: number) => {
       this.x1 = data
       localStorage.setItem('withLike', this.x1);
       console.log(this.x1)
     }
   )
 }

 ngOnInit(): void {
  this.reloadData();
  this.generateChart();
  this.countL = Number(localStorage.getItem('countLikes'));
  console.log("Nombre de Likes: " + this.countL);

  this.Likes = localStorage.getItem('withLikes');
  console.log("Nombre de evenement avec : " + this.Likes);

  this.Unlikes = this.countL - Number(this.Likes);
  console.log("Nombre de evenement sans: " + this.Unlikes);

  // Vérifier si countsh est supérieur à zéro avant de calculer les pourcentages
  if (this.countL > 0) {
    // Calculer les pourcentages avec des valeurs potentiellement négatives
    this.pUnlikes = Math.abs((this.Unlikes / this.countL) * 100);
    this.pLikes = Math.abs(100 - this.pUnlikes);

    // Afficher les valeurs dans la console
    console.log("Unlikes:", this.Unlikes);
    console.log("Likes:", this.Likes);
    console.log("pUnlikes:", this.pUnlikes);
    console.log("pLikes:", this.pLikes);

    // Créer l'interface du diagramme avec les pourcentages
    this.GoogleChartInterface = {
      chartType: GoogleChartType.PieChart,
      dataTable: [
        ['Pourcentage sans actionnaire', 'Pourcentage avec actionnaire'],
        ['Avec actionnaire', this.pLikes],
        ['Sans actionnaire', this.pUnlikes]
      ],
      options: { 'title': 'Avec actionnaire' },
    };
  } else {
    console.error("Le nombre total d'actionnaires est zéro ou négatif. Impossible de calculer les pourcentages.");
  }
}

  GoogleChartInterface: any;
  delete(shareholder:Shareholder) {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this delivery!",
      icon: "warning",
      buttons: ["Cancel","Confirm"],
      dangerMode: true,
    })
      .then((willDelete) => {

        if (willDelete) {
          let i =this.Shareholder.indexOf(shareholder)

          // @ts-ignore
          this.shareholderService.deleteShareholder(shareholder.idShareholder).subscribe(
            ()=>this.Shareholder.splice(i,1)
          )
          ;
          swal("Shareholder has been deleted!", {
            icon: "success",
          });
        } else {
          swal("Shareholder is safe!");
        }
      });
      this.reloadData();

  }
  reloadData(): void {
    this.getShareholder();
  }
  
  private getShareholder(): void {
    this.shareholders = this.shareholderService.getShareholderList();
  }

  shareholderDetails(id: number){
    this.router.navigate(['detailsShareholder', id]);
  }
  addShareholder(){
    this.router.navigate(['AddShareholder']);
  }
  updateShareholder(id: number){ 
    this.router.navigate(['updateShareholder',id]); 
  }

  deleteShareholder(id: number) {
    this.shareholderService.deleteShareholder(id).subscribe({
      next: data => {
        console.log(data);
        this.reloadData();
      },
      error: error => console.log(error)
    });
  }

  generatePDFForHardware(id: number): void {
    this.shareholderService.generatePDFForShareholder(id).subscribe(
      response => console.log(response),
      error => console.error(error)
    );
  }

  generatePDFForAllHardware(): void {
    this.shareholderService.generatePDFForAllShareholder().subscribe(
      response => console.log(response),
      error => console.error(error)
    );
  }

  searchShareholder(): void {
    if (!this.searchTerm.trim()) {
      // If the search term is empty, reload all hardware
      this.reloadData();
      return;
    }
    this.shareholderService.searchShareholderByName(this.searchTerm).subscribe(
      filteredShareholders => this.shareholders = of(filteredShareholders),
      error => console.error(error)
    );
  }

  BacktoAdminDashboard() {
    this.router.navigate(['side']);
  }

  // Define getHardwareByStatus method
  /*getHardwareByStatus(partner: string): void {
    this.shareholderService.retrieveShareholderByType(partner).subscribe(
      (response) => {
        // Handle the response here
        console.log(response);
      },
      (error) => {
        // Handle errors here
        console.error(error);
      }
    );
  }*/

 /* searchHardwareByAvailability(): void {
    if (this.availabilityFilter === 'ALL') {
      // If filter is set to 'ALL', reload all hardware
      this.reloadData();
      return;
    }
  
    // Filter the hardware items based on availability
    this.hardwares = this.hardwareService.getHardwareList().pipe(
      map((hardwares: Hardware[]) => hardwares.filter((hardware: Hardware) => {
        if (this.availabilityFilter === 'AVAILABLE') {
          return hardware.status === HardwareStatus.Available; // Compare with enum value
        } else {
          return hardware.status !== HardwareStatus.Available; // Compare with enum value
        }
      }))
    );
  }*/
}
