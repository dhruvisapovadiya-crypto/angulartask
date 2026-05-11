import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-user.html',
  styleUrl: './add-user.css',
})
export class AddUser {

  http = inject(HttpClient);
  cdr = inject(ChangeDetectorRef);

  router = inject(Router);

  @Output() closeForm = new EventEmitter<void>();

  @Output() userAdded = new EventEmitter<void>();

  isAdding = false;

  user = {

    name: '',

    email: '',

    role: '',

    reportee: [
      'Riya',
      'Meera',
      'Kavya'
    ],

    status: 'Pending'

  };

  addUser() {
    if (!this.user.name || !this.user.email || !this.user.role) {
      Swal.fire({
        icon: 'warning',
        title: 'All Fields Required'
      });
      return;
    }

    if (this.isAdding) {
      return;
    }

    this.isAdding = true;
    Swal.fire({
      title: 'Add User?',
      text: 'New user will be created',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      confirmButtonText: 'Add User'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.http.post(
          'https://69e0d98d29c070e6597c24fa.mockapi.io/user',
          this.user
        ).subscribe({
          next: () => {
            this.isAdding = false;
            this.cdr.detectChanges();

            Swal.fire({
              icon: 'success',
              title: 'User Added Successfully',
              timer: 1200,
              showConfirmButton: false
            });
            this.userAdded.emit();
            this.closeForm.emit();
            this.router.navigate(['/user-list']);
          },

          error: (err) => {
            console.log(err);
            this.isAdding = false;
            Swal.fire({
              icon: 'error',
              title: 'Failed To Add User'
            });
          }
        });
      } else {
        this.isAdding = false;
      }
    });
  }
  close() {
    Swal.fire({
      title: 'Close Form?',
      text: 'Unsaved changes may be lost',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Close'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.closeForm.emit();
        this.router.navigate(['/user-list']);
      }
    });
  }
}