import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { SheetsList } from "../models/sheetsList";

interface UrlData {
  uri?: string;
  chanelId?: string;
  from?: string;
  to?: string;
  sheetId?: string
}

@Injectable({
  providedIn: 'root'
})
export class SheetsService {

  constructor(private http: HttpClient) { }

  getSheets(id, uri: string, pageToken?: string): Observable<SheetsList> {
    return this.http.get(`${environment.accountant_apiUrl}users/google/get-excel-sheets?uri=${uri}&channel_id=${id}&page_token=${pageToken}`)
  }

  getSheetContent(data: UrlData): Observable<SheetsList> {
    return this.http.get(`${environment.accountant_apiUrl}users/google/get-excel-sheets-data?uri=${data.uri}&spreadsheet_id=${data.sheetId}&from=${data.from}&to=${data.to}&channel_id=${data.chanelId}`)
  }
}
