import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import {ProductService} from "../../services/product.service";
import {ActivatedRoute} from "@angular/router";
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

    product: Product = new Product();

    constructor(private productService: ProductService,
                private route: ActivatedRoute,
                private cartService: CartService,) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(() => {
            this.handleProductDetails();
        });
    }

    private handleProductDetails() {
        // @ts-ignore
        const productId: number = +this.route.snapshot.paramMap.get('id');

        this.productService.getProduct(productId).subscribe(
            data => this.product = data
        );
    }

    addToCart() {
        const cartItem = new CartItem(this.product);
        this.cartService.addToCart(cartItem);
    }
}
