import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { State } from 'src/app/common/state';
import { FormService } from 'src/app/services/form.service';
import {Country} from "../../common/country";
import {CustomValidators} from "../../validators/custom-validators";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

    checkoutFormGroup: FormGroup;

    totalPrice: number;
    totalQuantity: number;

    years: number[] = [];
    months: number[] = [];

    countries: Country[] = [];
    shippingStates: State[] = [];
    billingStates: State[] = [];

    constructor(private formBuilder: FormBuilder,
                private formService: FormService) { }

    ngOnInit(): void {
        this.checkoutFormGroup = this.formBuilder.group({
            customer: this.formBuilder.group({
               firstName: new FormControl('',
                   [Validators.required, Validators.minLength(2),
                       CustomValidators.notOnlyWhitespace]),
               lastName: new FormControl('',
                   [Validators.required, Validators.minLength(2),
                       CustomValidators.notOnlyWhitespace]),
               email: new FormControl('',
                   [Validators.required, Validators.pattern(
                       '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
            }),
            shippingAddress: this.formBuilder.group({
                country: new FormControl('',
                    [Validators.required]),
                street: new FormControl('',
                    [Validators.required, Validators.minLength(2),
                        CustomValidators.notOnlyWhitespace]),
                city: new FormControl('',
                    [Validators.required, Validators.minLength(2),
                    CustomValidators.notOnlyWhitespace]),
                state: new FormControl('',
                    [Validators.required]),
                zipCode: new FormControl('',
            [Validators.required, Validators.minLength(6),
                Validators.maxLength(6) ,CustomValidators.notOnlyWhitespace])
            }),
            billingAddress: this.formBuilder.group({
                country: new FormControl('',
                    [Validators.required]),
                street: new FormControl('',
                    [Validators.required, Validators.minLength(2),
                        CustomValidators.notOnlyWhitespace]),
                city: new FormControl('',
                    [Validators.required, Validators.minLength(2),
                    CustomValidators.notOnlyWhitespace]),
                state: new FormControl('',
                    [Validators.required]),
                zipCode: new FormControl('',
                    [Validators.required, Validators.minLength(6),
                    Validators.maxLength(6) ,CustomValidators.notOnlyWhitespace])
            }),
            creditCard: this.formBuilder.group({
                cardType: new FormControl('',
                    [Validators.required]),
                nameOnCard: new FormControl('',
                    [Validators.required, Validators.minLength(2),
                    CustomValidators.notOnlyWhitespace]),
                cardNumber: new FormControl('',
                    [Validators.required, Validators.minLength(10),
                        Validators.maxLength(10), CustomValidators.notOnlyWhitespace]),
                securityCode: new FormControl('',
                    [Validators.required, Validators.minLength(3),
                        Validators.maxLength(3), CustomValidators.notOnlyWhitespace]),
                expirationMonth: new FormControl('',
                    [Validators.required]),
                expirationYear: new FormControl('',
                    [Validators.required]),
            })
        });

        const startMonth: number = new Date().getMonth() + 1;
        this.formService.getMonths(startMonth).subscribe(
            data => this.months = data
        );

        this.formService.getYears().subscribe(
            data => this.years = data
        );

        this.formService.getCountries().subscribe(
            data => this.countries = data
        );
    }

    onSubmit(){
        if(this.checkoutFormGroup.invalid){
            console.log("Invalid")
            this.checkoutFormGroup.markAllAsTouched();
        }
    }

    get firstName(){
        return this.checkoutFormGroup.get('customer.firstName');
    }
    get lastName(){
        return this.checkoutFormGroup.get('customer.lastName');
    }
    get email(){
        return this.checkoutFormGroup.get('customer.email');
    }


    get shippingCountry(){
        return this.checkoutFormGroup.get('shippingAddress.country');
    }
    get shippingStreet(){
        return this.checkoutFormGroup.get('shippingAddress.street');
    }
    get shippingCity(){
        return this.checkoutFormGroup.get('shippingAddress.city');
    }
    get shippingState(){
        return this.checkoutFormGroup.get('shippingAddress.state');
    }
    get shippingZipCode(){
        return this.checkoutFormGroup.get('shippingAddress.zipCode');
    }


    get billingCountry(){
        return this.checkoutFormGroup.get('billingAddress.country');
    }
    get billingStreet(){
        return this.checkoutFormGroup.get('billingAddress.street');
    }
    get billingCity(){
        return this.checkoutFormGroup.get('billingAddress.city');
    }
    get billingState(){
        return this.checkoutFormGroup.get('billingAddress.state');
    }
    get billingZipCode(){
        return this.checkoutFormGroup.get('billingAddress.zipCode');
    }


    get cardType(){
        return this.checkoutFormGroup.get('creditCard.cardType');
    }
    get nameOnCard(){
        return this.checkoutFormGroup.get('creditCard.nameOnCard');
    }
    get cardNumber(){
        return this.checkoutFormGroup.get('creditCard.cardNumber');
    }
    get securityCode(){
        return this.checkoutFormGroup.get('creditCard.securityCode');
    }
    get expirationMonth(){
        return this.checkoutFormGroup.get('creditCard.expirationMonth');
    }
    get expirationYear(){
        return this.checkoutFormGroup.get('creditCard.expirationYear');
    }

    // @ts-ignore
    copyShippingAddressToBilling(event) {
        if(event.target.checked) {
            this.checkoutFormGroup.controls['billingAddress']
                .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

            this.billingStates = this.shippingStates;
        }else {
            this.checkoutFormGroup.controls['billingAddress'].reset();

            this.billingStates = [];
        }
    }

    handleMonthsAndYears() {
        const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

        const currentYear:number = new Date().getFullYear();
        const selectedYear:number = Number(creditCardFormGroup?.value.expirationYear);

        let startMonth: number;

        if(currentYear === selectedYear)
            startMonth = new Date().getMonth() + 2;
        else
            startMonth = 1;

        this.formService.getMonths(startMonth).subscribe(
            data => this.months = data
        );
    }

    getStates(formGroupName: string) {
        const formGroup = this.checkoutFormGroup.get(formGroupName);
        const countryCode = formGroup?.value.country.code;

        this.formService.getStates(countryCode).subscribe(
            data => {
                if(formGroupName === "shippingAddress")
                    this.shippingStates = data;
                else
                    this.billingStates = data;

                formGroup?.get('state')?.setValue(data[0]);
            }
        );
    }
}
