import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Login } from '../login/login';

@Component({
  selector: 'app-header',
  imports: [RouterLink,Login],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  username = '';
  router = inject(Router);
  goToUserList() {
    this.router.navigate(['/user-list']);
  }
  ngOnInit() {
    this.username = localStorage.getItem('username') || '';
  }
  logout(){
    this.router.navigate(['']);
  }
}