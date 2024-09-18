import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';



















import { BlogServiceService } from './Blog/blog-service.service';







import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { DivHomeComponent } from './div-home/div-home.component';
import { SporthomeComponent } from './sporthome/sporthome.component';
import { StadehomeComponent } from './stadehome/stadehome.component';
import { BlogDetailsComponent } from './Blog/blog-details/blog-details.component';
import { NavbarconnectedComponent } from './shared/navbarconnected/navbarconnected.component';
import { LoginComponent } from './login/login.component';
import { AddCommentaireComponent } from './Commentaire/add-commentaire/add-commentaire.component';
import { HomeComponent } from './shared/home/home.component';
import { UpdateBlogComponent } from './Blog/update-blog/update-blog.component';
import { SidemenuComponent } from './dashboard/sidemenu/sidemenu.component';
import { TableComponent } from './dashboard/table/table.component';
import { CalendrierEventsComponent } from './dashboard/calendrier-events/calendrier-events.component';
import { StaticsCircleComponent } from './dashboard/statics-circle/statics-circle.component';
import { StaticsBarsVComponent } from './dashboard/statics-bars-v/statics-bars-v.component';
import { StaticsBarsHComponent } from './dashboard/statics-bars-h/statics-bars-h.component';
import { Form2Component } from './dashboard/form2/form2.component';
import { FormVerticaleComponent } from './dashboard/form-verticale/form-verticale.component';
import { FormHorizontalComponent } from './dashboard/form-horizontal/form-horizontal.component';
import { RegisterComponent } from './register/register.component';
import { ListBlogbackComponent } from './Blog/list-blogback/list-blogback.component';
import { ListBlogComponent } from './Blog/list-blog/list-blog.component';
import { AddBlogComponent } from './Blog/add-blog/add-blog.component';
import { ForgotPwdComponent } from './forgot-pwd/forgot-pwd.component';
import { DisplayOfferComponent } from './display-offer/display-offer.component';
import { ListOfferComponent } from './dashboard/list-offer/list-offer.component';
import { ListRequestsComponent } from './dashboard/list-requests/list-requests.component';
import { ListAmortizationComponent } from './dashboard/list-amortization/list-amortization.component';
import { AuthServiceService } from './services/auth-service.service';
import { TokenStorageServiceService } from './services/token-storage-service.service';
import { SimilatorMonthlyComponent } from './similator-monthly/similator-monthly.component';
import { EventService } from './services/event.service';
import { ShareholderService } from './services/shareholder.service';
import { AddEventComponent } from './add-event/add-event.component';
import { DetailsEventComponent } from './details-event/details-event.component';
import { EventListComponentAdmin } from './event-list/event-list.componentAdmin';
import {ShareholderListComponent} from './shareholder-list/shareholder-list.component';
import { ShareholderListComponentAdmin } from './shareholder-list/shareholder-list.componentAdmin';
import { DetailsShareholderComponent } from './details-shareholder/details-shareholder.component';
import { AddshareholderComponent } from './add-shareholder/add-shareholder.component';
import { CommonModule } from '@angular/common';
import { UpdateEventComponent } from './update-event/update-event.component';
import { UpdateShareholderComponent } from './update-shareholder/update-shareholder.component';
import { EventListComponent } from './event-list/event-list.component';
import { AssignShareholderComponent } from './event-list/assign-shareholder.component';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import {NgxPaginationModule} from 'ngx-pagination';
import { EventStatisticsComponent } from './event-list/EventStatisticsComponent';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    DivHomeComponent,
    SporthomeComponent,
    StadehomeComponent,
    DisplayOfferComponent,
    BlogDetailsComponent,
    NavbarconnectedComponent,
    LoginComponent,
    AddCommentaireComponent,
    HomeComponent,
    UpdateBlogComponent,
    SidemenuComponent,
    TableComponent,
    CalendrierEventsComponent,
    StaticsCircleComponent,
    StaticsBarsVComponent,
    StaticsBarsHComponent,
    Form2Component,
    FormVerticaleComponent,
    FormHorizontalComponent,
    RegisterComponent,
    ListBlogbackComponent,
    ListBlogComponent,
    AddBlogComponent,
    ForgotPwdComponent,
    ListOfferComponent,
    ListRequestsComponent,
    ListAmortizationComponent,
    SimilatorMonthlyComponent,
    AddEventComponent,
    AddshareholderComponent ,
    DetailsEventComponent,
    EventListComponentAdmin,
    ShareholderListComponent,
    ShareholderListComponentAdmin,
    DetailsShareholderComponent,
    UpdateEventComponent,
    UpdateShareholderComponent,
    EventListComponent, 
    AssignShareholderComponent,
    EventStatisticsComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    Ng2GoogleChartsModule,
    NgxPaginationModule,
    NgxPaginationModule,

  ],
  providers: [BlogServiceService,
              AuthServiceService,
              TokenStorageServiceService,
              EventService,
              ShareholderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
