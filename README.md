# NgStripe

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.2.4.
This is a simple stripe payment gateway libray. We have not used styles, you can change the card layout as your own. [Demo](https://angular-3c4fd.web.app/stripe)

# Features!

  - Easy to use 
  - Card validation 
  - less code to get response json 

### Installation
```sh
$ npm i ng-stripe 
```

Import NgStripeModule in your `module.ts` file ( app.module.ts file )

```javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgStripeModule } from 'ng-stripe';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgStripeModule
  ],
  providers: [
	  
	],
  bootstrap: [AppComponent]
})
export class AppModule { } 
```
### Configuration
Add below code in your `.html` file
```html
<lib-ng-stripe apiKey="pk_test_Pj5AIAyJnj8lafRKnF1gC5wY" apiSecret="sk_test_hj06rZIyHdrs9etIqk7pSVax" totalAmount="10" currency="USD" stripeBtnText="pay" stripeBtnLoading="Loading.." orderId="25"  email="user@example.com"  (apiResponse)="paymentChange($event)"></lib-ng-stripe>
```
Add below code in your `.component.ts` file
```javascript
paymentChange(data) {
  console.log(data); // you can receive both success and resposonse data here 
}
```

### Available Options 

| Options | Description |
| ------ | ------ |
| apiKey | Stripe Publishable key |
| apiSecret | Stripe Secret key |
| totalAmount | Final Amount |
| currency | Supported currencies [View All](https://stripe.com/docs/currencies) |
| stripeBtnText | Paynow Button Text, Default text is `Pay Now` |
| stripeBtnLoading | Loading button text, Default text is `Please Wait..` |
| orderId | It will be passed with Stripe desription |
| email | It will be passed with Stripe desription |
| apiResponse | All success and error data will received here |

### Donate!
Like my Work! [Donate](https://www.paypal.me/LibinPrasanth) 

