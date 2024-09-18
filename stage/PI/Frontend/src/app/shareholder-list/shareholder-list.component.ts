
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Shareholder } from '../Models/Shareholder/shareholder';
import { ShareholderService } from '../services/shareholder.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Component({
  selector: 'app-shareholder-list',
  templateUrl: './shareholder-list.component.html',
  styleUrls: ['./shareholder-list.component.scss']
})
export class ShareholderListComponent implements OnInit {
  shareholders !: Observable<Shareholder[]>;

  constructor(private shareholderservice: ShareholderService, private router: Router) { }

  ngOnInit(): void {
    this.reloadData();
  }

  reloadData(): void {
    this.getShareholder();
  }
  
  private getShareholder(): void {
    this.shareholders = this.shareholderservice.getShareholderList();
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
    this.shareholderservice.deleteShareholder(id).subscribe({
      next: data => {
        console.log(data);
        this.reloadData();
      },
      error: error => console.log(error)
    });
  }
}
