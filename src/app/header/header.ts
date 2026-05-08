import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
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
}