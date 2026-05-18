import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  username = '';
  email = '';

  router = inject(Router);

  ngOnInit() {
    this.username = localStorage.getItem('username') || '';
    this.email = localStorage.getItem('email') || '';
  }

  goToUserList() {
    this.router.navigate(['/user-list']);
  }

  logout() {

    Swal.fire({
      title: 'Are You Sure You Want to Leave?',
      text: 'You will be redirected to login page',
      iconColor: '#ff6b6b',
      icon: 'question',

      showCancelButton: true,

      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Logout',

      cancelButtonText: 'Cancel',

      // CHANGE: custom dark mode classes
      customClass: {
        popup: 'my-swal-popup',
        title: 'my-swal-title',
        htmlContainer: 'my-swal-text',
        confirmButton: 'my-swal-confirm',
        cancelButton: 'my-swal-cancel'
      }

    }).then((result: any) => {

      if (result.isConfirmed) {

        Swal.fire({

          icon: 'success',
          title: 'Logged Out Successfully',

          timer: 1000,
          showConfirmButton: false,

          // CHANGE: success popup dark mode
          customClass: {
            popup: 'my-swal-popup',
            title: 'my-swal-title',
            htmlContainer: 'my-swal-text'
          }

        });

        setTimeout(() => {

          this.router.navigate(['']);

        }, 1000);

      }

    });

  }

  isDarkMode = false;

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;

    document.body.classList.toggle(
      'dark-mode',
      this.isDarkMode
    );
  }
}