import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import {ProductCategory} from "../../common/product-category";

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {

    productCategories: ProductCategory[];

    constructor(private productService: ProductService) { }

    ngOnInit(): void {
        this.listProductCategorise();
    }

    private listProductCategorise() {
        this.productService.getProductCategories().subscribe(
            data => {
                this.productCategories = data;
            }
        );
    }
}
