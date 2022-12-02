import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FamilyData } from '../models/FamilyData';

@Injectable({
  providedIn: 'root'
})
export class FamilyDataService {

  private headers = new HttpHeaders();
  private endpoint: string = 'http://localhost:3000/data';

  constructor(private httpClient: HttpClient) { }

  getData(): Observable<FamilyData[]> {
    return this.httpClient.get<FamilyData[]>(this.endpoint)
  }
}
