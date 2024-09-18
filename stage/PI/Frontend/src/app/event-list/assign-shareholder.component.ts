import { Component, OnInit } from '@angular/core';
import {Shareholder} from '../Models/Shareholder/shareholder'; 
import { ShareholderService } from '../services/shareholder.service';
import {ActivatedRoute, Route, Router} from "@angular/router";

@Component({
  selector: 'app-assign-shareholder',
  templateUrl: './assign-shareholder.component.html',
 styleUrls: ['./assign-shareholder.component.css']
})
export class AssignShareholderComponent implements OnInit {
  // @ts-ignore
  shareholder: Shareholder;
  id:any
  idsh:any

  constructor(private shareholderService: ShareholderService, private router: Router,private activated:ActivatedRoute) { }

  ngOnInit(): void {
    //this.livraison=this.livraisonService.currentLivreur;
    this.shareholder =  new Shareholder();
    this.activated.paramMap.subscribe(
      (params)=> {
        this.id = params.get('idEvent');
        console.log("l'id du event est:"+this.id)

      }
    )
    
  }
  isEmailValid(email: string): boolean {
    // Expression régulière pour vérifier le format de l'adresse e-mail
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}


  save() {
    if (this.id) {
      this.shareholderService.assign(this.shareholder, this.id).subscribe(
        () => this.router.navigate(['/Event'])
      );
    } else {
      console.error("ID de l'événement non défini.");
      // Gérer le cas où l'ID de l'événement n'est pas défini
    }
  }
  
}
