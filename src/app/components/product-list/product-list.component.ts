import {Component, EventEmitter, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

    products: Product[] = [];
    currentCategoryId: number = 1;
    previousCategoryId: number = 1;
    searchMode: boolean = false;

    pageNumber: number = 1;
    pageSize: number = 5;
    totalElements = 0;

    previousKeyword: string;

    constructor(private productService: ProductService,
                private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(() => {
            this.listProducts();
        });
    }

    listProducts(){
        this.searchMode = this.route.snapshot.paramMap.has('keyword');

        if(this.searchMode)
            this.handleSearchProducts();
        else
            this.handleListProducts();
    }

    private handleSearchProducts() {
        // @ts-ignore
        const keyword: string = this.route.snapshot.paramMap.get('keyword');
        if(this.previousKeyword != keyword)
            this.pageNumber = 1;

        this.previousKeyword = keyword;

        // @ts-ignore
        this.productService.searchProductsPaginate(
                this.pageNumber-1, this.pageSize, keyword)
            .subscribe( this.processResult() );
    }

    handleListProducts(){
        const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

        if (hasCategoryId)
            // @ts-ignore
            this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
        else
            this.currentCategoryId = 1;

        if(this.previousCategoryId != this.currentCategoryId)
            this.pageNumber = 1;
        this.previousCategoryId = this.currentCategoryId;

        this.productService.getProductListPaginate(
            this.pageNumber-1, this.pageSize, this.currentCategoryId)
            .subscribe( this.processResult() );
    }

    updatePageSize(event: Event) {
        // @ts-ignore
        this.pageSize = event.target.value;
        this.pageNumber = 1;
        this.listProducts();
    }

    private processResult() {
        return (data: { _embedded: { products: Product[]; }; page: { number: number; size: number; totalElements: number; }; }) => {
            this.products = data._embedded.products;
            this.pageNumber = data.page.number + 1;
            this.pageSize = data.page.size;
            this.totalElements = data.page.totalElements;
        };
    }
}
