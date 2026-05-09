import { Component } from '@angular/core';
import { Header } from "../header/header";
import { Footer } from "../footer/footer";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [Header, Footer,RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
   username = '';

  ngOnInit(){
    this.username = localStorage.getItem('username') || '';
  }
}