import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Product} from "../common/product";
import {map, Observable} from "rxjs";
import {ProductCategory} from "../common/product-category";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

    getProductList(currentCategoryId: number): Observable<Product[]>{
        const searchUrl =
            `${this.baseUrl}/search/findByCategoryId?id=${currentCategoryId}`;

        return this.getProducts(searchUrl);
    }

    getProductCategories(): Observable<ProductCategory[]> {
        return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
            map(response => response._embedded.productCategory)
        );
    }

    searchProducts(keyword: string): Observable<Product[]> {
        const searchUrl =
            `${this.baseUrl}/search/findByNameContaining?name=${keyword}`;

        return this.getProducts(searchUrl);
    }

    private getProducts(searchUrl: string) {
        return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
                map(response => response._embedded.products)
            );
    }
}

interface GetResponseProducts{
    _embedded:{
        products: Product[];
    }
}

interface GetResponseProductCategory {
    _embedded: {
        productCategory: ProductCategory[];
    }
}
