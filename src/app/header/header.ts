import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Login } from '../login/login';
import Swal from 'sweetalert2';

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
  logout() {

  Swal.fire({
    title: 'Logout?',
    text: 'You will be redirected to login page',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    confirmButtonText: 'Logout',
    cancelButtonText: 'Cancel'
  }).then((result: any) => {

    if (result.isConfirmed) {

      Swal.fire({
        icon: 'success',
        title: 'Logged Out Successfully',
        timer: 1000,
        showConfirmButton: false
      });

      setTimeout(() => {

        this.router.navigate(['']);

      }, 1000);

    }

  });

}
}