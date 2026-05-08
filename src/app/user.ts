import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface User {
  id: number;
  name: string;
  email: string;
  role: [];
  reportee:[];
}

@Injectable({
  providedIn: 'root',
})

export class User{
  private http=inject(HttpClient);
  private apiUrl='https://69e0d98d29c070e6597c24fa.mockapi.io/user';

  getUsers():Observable<User[]>{
    return this.http.get<User[]>(this.apiUrl);
  }
}