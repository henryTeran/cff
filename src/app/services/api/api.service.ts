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

  async completion(value: string, signal?: AbortSignal): Promise<CompletionResponse> {
    const url = `${this._apiEndpoint}/completion.fr.json?term=${encodeURIComponent(value)}&show_ids=1&show_coordinates=1`;
    const request = this._http.get<CompletionResponse>(url, {
      context: signal ? { signal } as any : undefined
    });
    const result = firstValueFrom(request);

    return result;
  }

  async route(params: {
    from: string;
    to: string;
    date: string;
    time: string;
    timeType?: 'depart' | 'arrival';
    num?: number;
  }): Promise<RouteResponse> {
    const queryParams = new URLSearchParams({
      from: params.from,
      to: params.to,
      date: params.date,
      time: params.time,
      time_type: params.timeType || 'depart',
      num: String(params.num ?? 5),
      show_delays: '1',
      show_trackchanges: '1'
    });

    const url = `${this._apiEndpoint}/route.fr.json?${queryParams.toString()}`;
    const request = this._http.get<RouteResponse>(url);
    const result = firstValueFrom(request);

    return result;
  }
}
