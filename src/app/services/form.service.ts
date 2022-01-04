import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {map} from "rxjs/operators";
import {Country} from "../common/country";
import {HttpClient} from "@angular/common/http";
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class FormService {

    private countriesUrl: string = 'http://localhost:8080/api/countries';
    private statesUrl: string = 'http://localhost:8080/api/states';

    constructor(private httpClient: HttpClient) { }

    getCountries(): Observable<Country[]>{
        return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
                map(response => response._embedded.countries)
            );
    }

    getStates(countryCode: string): Observable<State[]> {
        const searchUrl: string = `${this.statesUrl}/search/findByCountryCode?code=${countryCode}`;

        return this.httpClient.get<GetResponseStates>(searchUrl).pipe(
            map( response => response._embedded.states)
        );
    }

    getMonths(startMonth: number): Observable<number[]> {
        let data: number[] = [];

        for(let tempMonth = startMonth; tempMonth <=12; tempMonth++)
            data.push(tempMonth);

        return of(data);
    }

    getYears(): Observable<number[]> {
        let data: number[] = [];

        const startYear: number = new Date().getFullYear();
        const endYear: number = startYear + 10;

        for(let tempYear = startYear; tempYear <= endYear; tempYear++)
            data.push(tempYear);

        return of(data);
    }

}

interface GetResponseCountries{
    _embedded: {
        countries: Country[];
    }
}

interface GetResponseStates{
    _embedded: {
        states: State[];
    }
}
