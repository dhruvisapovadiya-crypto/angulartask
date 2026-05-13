import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

//blue print of object 
export interface User {
  id: number;
  name: string;
  email: string;
  role: [];
  reportee:[];
}

@Injectable({
  providedIn: 'root', // root because k singleton obeject che atle 
})

export class User{
  //DI Handle karva mate use kari chi aapde 
  private http=inject(HttpClient); 
  private apiUrl='https://69e0d98d29c070e6597c24fa.mockapi.io/user';

  getUsers():Observable<User[]>{
    return this.http.get<User[]>(this.apiUrl);
  }
}