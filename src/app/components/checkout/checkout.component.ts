import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup } from '@angular/forms';
import { State } from 'src/app/common/state';
import { FormService } from 'src/app/services/form.service';
import {Country} from "../../common/country";

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
               firstName: [''],
               lastName: [''],
               email: ['']
            }),
            shippingAddress: this.formBuilder.group({
                street: [''],
                city: [''],
                state: [''],
                country: [''],
                zipCode: [''],
            }),
            billingAddress: this.formBuilder.group({
                street: [''],
                city: [''],
                state: [''],
                country: [''],
                zipCode: [''],
            }),
            creditCard: this.formBuilder.group({
                cardType: [''],
                nameOnCard: [''],
                cardNumber: [''],
                securityCode: [''],
                expirationMonth: [''],
                expirationYear: [''],
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
