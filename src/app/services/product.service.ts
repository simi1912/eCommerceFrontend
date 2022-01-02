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

    getProductListPaginate(page:number, pageSize:number, currentCategoryId: number): Observable<GetResponseProducts>{
        const searchUrl =`${this.baseUrl}/search/findByCategoryId?` +
                `id=${currentCategoryId}&page=${page}&size=${pageSize}`;

        return this.httpClient.get<GetResponseProducts>(searchUrl);
    }

    searchProductsPaginate(page:number, pageSize:number, keyword: string): Observable<GetResponseProducts>{
        const searchUrl =`${this.baseUrl}/search/findByNameContaining?` +
            `name=${keyword}&page=${page}&size=${pageSize}`;

        return this.httpClient.get<GetResponseProducts>(searchUrl);
    }

    getProductCategories(): Observable<ProductCategory[]> {
        return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
            map(response => response._embedded.productCategory)
        );
    }

    getProduct(productId: number): Observable<Product> {
        const productUrl = `${this.baseUrl}/${productId}`;

        return this.httpClient.get<Product>(productUrl);
    }
}

interface GetResponseProducts{
    _embedded:{
        products: Product[];
    },
    page:{
        size: number,
        totalElements: number,
        totalPages: number,
        number: number
    }
}

interface GetResponseProductCategory {
    _embedded: {
        productCategory: ProductCategory[];
    }
}
