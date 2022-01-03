import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {

    cartItems: CartItem[] = [];

    totalPrice: Subject<number> = new Subject<number>();
    totalQuantity: Subject<number> = new Subject<number>();

    constructor() { }

    addToCart(cartItem: CartItem){
        // @ts-ignore
        let existingCartItem: CartItem = this.cartItems.find(
            tempCartItem => tempCartItem.id === cartItem.id
        );
        let alreadyExistsInCart: boolean = existingCartItem != undefined;

        if(alreadyExistsInCart)
            // @ts-ignore
            existingCartItem.quantity++;
        else
            this.cartItems.push(cartItem);

        this.computeCartTotals();
    }

    computeCartTotals() {
        let totalPrice: number = 0;
        let totalQuantity: number = 0;

        for(let currentCartItem of this.cartItems) {
            totalPrice += currentCartItem.quantity * currentCartItem.unitPrice;
            totalQuantity += currentCartItem.quantity;
        }

        this.totalPrice.next(totalPrice);
        this.totalQuantity.next(totalQuantity);
    }

    decrementQuantity(cartItem: CartItem) {
        cartItem.quantity--;

        if(cartItem.quantity === 0)
            this.remove(cartItem);
        else
            this.computeCartTotals();
    }

    remove(cartItem: CartItem) {
        const itemIndex = this.cartItems.findIndex(
            currentCartItem => currentCartItem.id === cartItem.id
        );

        if(itemIndex > -1) {
            this.cartItems.splice(itemIndex, 1);
            this.computeCartTotals();
        }
    }
}
