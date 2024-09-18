import { Component, OnInit } from '@angular/core';
import { OfferLoan } from '../Models/Loan/offer-loan';
import { OfferLoanService } from '../services/offer-loan.service';

@Component({
  selector: 'app-display-offer',
  templateUrl: './display-offer.component.html',
  styleUrls: ['./display-offer.component.css']
})
export class DisplayOfferComponent implements OnInit{

  
  offers: OfferLoan[]= [];

  constructor(private offerService:OfferLoanService){}
  
  ngOnInit(): void {
    this.offerService.retrieveAllOfferLoans().subscribe(
      data => {
        this.offers = data;
        console.log('Offers:', this.offers);
      },
      error => {
        console.error('Error fetching offers:', error);
      }
    );
  }




}
