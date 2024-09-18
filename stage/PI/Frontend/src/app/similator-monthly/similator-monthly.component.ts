import { Component } from '@angular/core';
import { OfferLoanService } from '../services/offer-loan.service';

@Component({
  selector: 'app-similator-monthly',
  templateUrl: './similator-monthly.component.html',
  styleUrls: ['./similator-monthly.component.css']
})
export class SimilatorMonthlyComponent {

  constructor(private offerServ:OfferLoanService){}

  calculateMonthlyRepayment(idOffer: number, loanAmnt: number, nbrMonth: number): void {
    this.offerServ.simulationCalMonthlyRepaymentAmount(idOffer, loanAmnt, nbrMonth)
      .subscribe(
        monthlyRepaymentAmount => {
          console.log('Monthly Repayment Amount:', monthlyRepaymentAmount);
          // Handle the response as needed
        },
        error => {
          console.error('Error:', error);
          // Handle error
        }
      );
}

calculateYearlyRepayment(idOffer: number, loanAmnt: number, nbrYears: number, typeAmort: string): void {
  this.offerServ.simulationCalYearlyRepaymentAmount(idOffer, loanAmnt, nbrYears, typeAmort)
    .subscribe(
      yearlyRepaymentAmount => {
        console.log('Yearly Repayment Amount:', yearlyRepaymentAmount);
      },
      error => {
        console.error('Error:', error);
      }
    )
}

getCountRequestLoans(idOffer: number): void {
  this.offerServ.countRequestLoansByOfferId(idOffer)
    .subscribe(
      count => {
        console.log('Count of Request Loans:', count);
        // Handle the count as needed
      },
      error => {
        console.error('Error:', error);
        // Handle error
      }
    );
}

countAvailableOffers(): void {
  this.offerServ.countAvailableOffers()
    .subscribe(
      count => {
        console.log('Count of Available Offers:', count);
        // Handle the count as needed
      },
      error => {
        console.error('Error:', error);
        // Handle error
      }
    );
}

searchOffersByMinAmount(searchedAmount: number): void {
  this.offerServ.searchOffersByMinAmount(searchedAmount)
    .subscribe(
      response => {
        console.log('Search Result:', response);
        // Handle the response as needed
      },
      error => {
        console.error('Error:', error);
        // Handle error
      }
    );
}









}