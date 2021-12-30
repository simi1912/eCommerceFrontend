import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Product} from "../common/product";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';

  constructor(private httpClient: HttpClient) { }

    getProductList(currentCategoryId: number): Observable<Product[]>{
        const searchUrl =
            `${this.baseUrl}/search/findByCategoryId?id=${currentCategoryId}`;

        return this.httpClient.get<GetResponse>(searchUrl).pipe(
            map(response => response._embedded.products)
    );
  }

}

interface GetResponse{
    _embedded:{
        products: Product[];
    }
}
