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
   email=''

isDarkMode = false;

ngOnInit() {
  this.username = localStorage.getItem('username') || '';

  const savedTheme = localStorage.getItem('dashboardTheme');

  if (savedTheme === 'dark') {
    this.isDarkMode = true;
  }
}

toggleTheme() {
  this.isDarkMode = !this.isDarkMode;

  if (this.isDarkMode) {
    localStorage.setItem('dashboardTheme', 'dark');
  } else {
    localStorage.setItem('dashboardTheme', 'light');
  }
}
}
