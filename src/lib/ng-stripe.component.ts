import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'; 
import { CreditCardValidator } from 'angular-cc-library';

@Component({
  selector: 'lib-ng-stripe',
  templateUrl: './ng-stripe.component.html',
  styleUrls: ['./ng-stripe.component.css']
})
export class NgStripeComponent implements OnInit {

  public apiKey: string;
  public apiSecret: string;
  public totalAmount: number;
  public stripeBtnText = 'Pay Now';
  public stripeBtnLoading = 'Please Wait..';
  public BtnText = 'Pay Now';
  public orderId: any;
  public email: any;
  public currency: string;

  /* Stripe */
  public stripeCardForm: FormGroup;
  stripe: any = {
    stripeBtnText: 'Pay Now',
    stripMessage: '',
    stripBtnDisabled: false,
    submitted: false,
    stripData: {}
  };
  constructor(private httpClient: HttpClient, private formBuilder: FormBuilder) {
    this.stripeCardForm = this.formBuilder.group({
      name: ['', [<any> Validators.required]],
      cardNumber: ['', [<any> CreditCardValidator.validateCCNumber]],
      expirationDate: ['', [<any> CreditCardValidator.validateExpDate]],
      cvc: ['', [<any> Validators.required, <any> Validators.minLength(3), <any> Validators.maxLength(4)]]
    });
  }
	
  @Output()
  apiResponse: EventEmitter<Object> = new EventEmitter<Object>();

  @Input('stripeBtnText')
  public set setstripeBtnText(stripeBtnText: string) {
    this.stripeBtnText = stripeBtnText;
    this.BtnText = this.stripeBtnText;
  }
	@Input('currency')
  public set setcurrency(currency: string) {
    this.currency = currency; 
  }
  @Input('orderId')
  public set setorderId(orderId: string) {
    this.orderId = orderId;
  }
  @Input('email')
  public set setemail(email: string) {
    this.email = email;
  }
  @Input('stripeBtnLoading')
  public set setstripeBtnLoading(stripeBtnLoading: string) {
    this.stripeBtnLoading = stripeBtnLoading;
  }

  @Input('apiKey')
  public set setapiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  @Input('apiSecret')
  public set setapiSecret(apiSecret: string) {
    this.apiSecret = apiSecret;
  }
  @Input('totalAmount')
  public set settotalAmount(totalAmount: number) {
    this.totalAmount = totalAmount;
  }

  ngOnInit() {
  }

  /* Stripe Payment */
  get f() { return this.stripeCardForm.controls; }

  payUsingStripe() {
    const total = parseFloat((Math.round(this.totalAmount * 100) / 100).toFixed(2));
    console.log('Total Order Amounth is ' + total);
    const amount = Math.round(total * 100).toString();
    this.stripe.submitted = true;

    // stop here if form is invalid
    if (this.stripeCardForm.invalid) {
      return;
    }

    this.BtnText = this.stripeBtnLoading;
    this.stripe.stripBtnDisabled = true;

    /* Generating card token */
    const tokenbody = new HttpParams()
      .set('card[number]', this.stripeCardForm.value.cardNumber)
      .set('card[cvc]', this.stripeCardForm.value.cvc)
      .set('card[exp_month]', this.getMonth(this.stripeCardForm.value.expirationDate))
      .set('card[exp_year]', this.getYear(this.stripeCardForm.value.expirationDate))
      .set('card[name]', this.stripeCardForm.value.name)
      .set('key', this.apiKey);
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.apiSecret,
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    this
      .httpClient
      .post(`https://api.stripe.com/v1/tokens`, tokenbody, httpOptions)
      .subscribe(
        (data: any) => {
          if (data) {

            const description = 'Order id ' + this.orderId + ' and user ' + this.email + '';

            const body = new HttpParams()
              .set('amount', amount)
              .set('currency', this.currency)
              .set('source', data.id)
              .set('description', description); 

            this
              .httpClient
              .post(`https://api.stripe.com/v1/charges`, body, httpOptions)
              .subscribe(
                (datas: any) => {
                  this.apiResponse.emit({data: datas, token: data});
                  this.stripe.stripBtnDisabled = true;
                  this.stripe.stripMessage = '';
                  this.BtnText = this.stripeBtnText;
                },
                (errs: any) => {
                  this.apiResponse.emit({breaks: 'charges', err: errs});
                  this.stripe.stripBtnDisabled = false;
                  this.BtnText = this.stripeBtnText;
                }
              );
          }
        },
        (err: any) => {
          this.apiResponse.emit({breaks: 'tokens', err: err});
          this.stripe.stripBtnDisabled = false;
          this.BtnText = this.stripeBtnText;
        }
      );
  }

  getMonth(data: any) {
    return data.substring(0, 2);
  }
  getYear(data: any) {
    const y = data.split('/');
    if (y.length > 1) {
      return y[1].trim();
    }
  } 
}
