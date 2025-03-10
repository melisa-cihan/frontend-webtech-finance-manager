import { Injectable } from '@angular/core';
import { Asset } from './asset';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BackendService {
  backendURL = 'http://localhost:3000'
  
  constructor(private http: HttpClient) { }

  getAllAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>(`${this.backendURL}/assets`); 
  }

  deleteOneAsset(id: string): Observable<any> {
    let endpoint = '/assets';
    return this.http.delete<any>(this.backendURL + endpoint + "/" + id);
  }

  getOneAsset(id: string): Observable<Asset>{
    let endpoint = '/assets';
    return this.http.get<Asset>(this.backendURL + endpoint + '/' + id);
  }

  createNewAsset(asset: Asset): Observable<Asset> {
    let endpoint = '/assets';
    return this.http.post<Asset>(this.backendURL + endpoint, asset);
  }

  updateOneAsset(id: string, asset: Asset,): Observable<Asset> {
    let endpoint = '/assets';
    return this.http.put<Asset>(this.backendURL + endpoint + "/" + id, asset);
  }

  getCategoryDistribution(): Observable<any[]> {
    let endpoint = '/category-distribution'; 
    return this.http.get<any[]>(`${this.backendURL}${endpoint}`);
  }

  getAssetGrowth(): Observable<any[]> {
    let endpoint = '/asset-growth'; 
    return this.http.get<any[]>(`${this.backendURL}${endpoint}`);
  }

  getAssetLocationCount(): Observable<any[]> {
    let endpoint = '/asset-location-count'; 
    return this.http.get<any[]>(`${this.backendURL}${endpoint}`);
  }

  getAssetProfitability(): Observable<any[]> {
    let endpoint = '/asset-profitability'; 
    return this.http.get<any[]>(`${this.backendURL}${endpoint}`);
  }

}
