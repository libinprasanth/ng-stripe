import { NgModule } from '@angular/core';
import { NgStripeComponent } from './ng-stripe.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser'; 
import { CreditCardDirectivesModule } from 'angular-cc-library';

@NgModule({
  declarations: [
    NgStripeComponent
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserModule,
		CreditCardDirectivesModule
  ],
  providers: [],
  exports: [NgStripeComponent]
})
export class NgStripeModule { }