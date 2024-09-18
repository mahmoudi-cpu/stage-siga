import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OfferLoan } from 'src/app/Models/Loan/offer-loan';
import { User } from 'src/app/Models/user/user';
import { OfferLoanService } from 'src/app/services/offer-loan.service';

@Component({
  selector: 'app-list-offer',
  templateUrl: './list-offer.component.html',
  styleUrls: ['./list-offer.component.css']
})
export class ListOfferComponent implements OnInit {
  offers: OfferLoan[] = [];
  loading: boolean = true;
  error: string | null = null;
  tmmValue: number = 7;
  offerForm!: FormGroup;
  submitted = false;
  user= User;
  status: string[] = ['AVAILABLE', 'NOT AVAILABLE'];
  typeLoans: string[] = ['STUDENT', 'FARMER', 'HOMEMAKER', 'PROJECT'];

  constructor(private formBuilder: FormBuilder, private offerServ: OfferLoanService) {}

  ngOnInit(): void {
    this.offerServ.retrieveAllOfferLoans().subscribe(
      (data: OfferLoan[]) => {
        this.offers = data;
        this.loading = false;
      },
      (error: any) => {
        this.error = 'Error fetching offers: ' + error.message;
        this.loading = false;
      }
    );

    this.offerServ.fetchLastTmmValue().subscribe(
      (tmmValue: number) => {
        this.offerForm.patchValue({ tmm: tmmValue });
      },
      (error: any) => {
        console.error('Error fetching tmm:', error);
      }
    );

    this.offerForm = this.formBuilder.group({
      status: ['AVAILABLE', Validators.required],
      typeLoan: ['', Validators.required],
      maxAmnt: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      minAmnt: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      minRepaymentPer: ['', [Validators.required, Validators.min(2)]],
      tmm: [''],
      intRate: ['', Validators.required],
      offrDate: [this.getCurrentDate(), Validators.required],
    });
  }

  addOffer() {
    if (this.offerForm.valid) {
      console.log('Form submitted:', this.offerForm.value);
      this.offerForm.reset();
    } else {
      Object.keys(this.offerForm.controls).forEach(field => {
        const control = this.offerForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }

  loadOffers(): void {
    this.offerServ.retrieveAllOfferLoans().subscribe(
      (data: OfferLoan[]) => {
        this.offers = data;
      },
      (error: any) => {
        console.error('Error fetching offers: ' + error.message);
      }
    );
  }

  changeStatus(event: any, offer: OfferLoan): void {
    offer.status = event.target.checked ? 'UNAVAILABLE' : 'AVAILABLE';
    this.offerServ.modifyOfferLoan(offer).subscribe(
      () => {
        console.log('Status updated successfully');
      },
      (error: any) => {
        console.error('Error updating status: ', error);
      }
    );
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().substring(0, 10); 
    return formattedDate;
  }
}
