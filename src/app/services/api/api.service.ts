import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CompletionResponse } from '../../interfaces/completionResponse';
import { RouteResponse } from '../../interfaces/routeResponse';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly _apiEndpoint = 'https://timetable.search.ch/api';
  

  constructor(private readonly _http : HttpClient ) { }

  async completion (value:string): Promise<CompletionResponse>{
    const url = `${this._apiEndpoint}/completion.fr.json?term=${value}`;
    const request = this._http.get<CompletionResponse>(url); 
    const result = firstValueFrom (request); 

    return result
  }

  async route(params:{from: string; to: string; date: string;  time: string;} ): Promise<RouteResponse> {
    const url = `${this._apiEndpoint}/route.fr.json?from=${params.from}&to=${params.to}&date=${params.date}&time=${params.time}&limit=1`; 
    const request = this._http.get<RouteResponse>(url); 
    const result = firstValueFrom (request); 
    
    return result;
  }
}
