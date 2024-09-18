import { Component, OnInit } from '@angular/core';
import { Amortization } from 'src/app/Models/Loan/amortization';
import { AmortizationService } from 'src/app/services/amortization.service';

@Component({
  selector: 'app-list-amortization',
  templateUrl: './list-amortization.component.html',
  styleUrls: ['./list-amortization.component.css']
})
export class ListAmortizationComponent implements OnInit {

  amortizations: Amortization[] =[];

  constructor(private amortizationService: AmortizationService) { }

  ngOnInit(): void {
    this.retrieveAllAmortization();
  }

  retrieveAllAmortization(): void {
    this.amortizationService.retrieveAllAmortization()
      .subscribe(amortizations => this.amortizations = amortizations);
  }

  
}
