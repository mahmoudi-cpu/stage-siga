import { Component, OnInit } from '@angular/core';
import { RequestLoan } from 'src/app/Models/Loan/request-loan';
import { RequestLoanService } from 'src/app/services/request-loan.service';

@Component({
  selector: 'app-list-requests',
  templateUrl: './list-requests.component.html',
  styleUrls: ['./list-requests.component.css']
})
export class ListRequestsComponent implements OnInit{
  requests: RequestLoan[]= [];

  constructor(private requestService:RequestLoanService){}
  
  ngOnInit(): void {
    this.retrieveAllLoans();
  }

  retrieveAllLoans(): void {
    this.requestService.retrieveAllLoans()
      .subscribe(
        loans => {
          this.requests = loans;
        },
        error => {
          console.error('Error:', error);
        }
      );
  }


}
