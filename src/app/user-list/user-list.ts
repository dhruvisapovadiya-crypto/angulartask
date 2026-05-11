import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddUser } from '../add-user/add-user';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AddUser, RouterLink],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {
  showAddForm = false;
  http = inject(HttpClient);
  cdr = inject(ChangeDetectorRef);

  users: any[] = [];

  editIndex: number = -1;
  oldUser: any = null;
  editingUser: any = null;
  changeRequests: any[] = [];
  isApproving: boolean = false;
  isRejecting: boolean = false;

  ngOnInit() {
    this.getUsers();
  }

  openAddForm() {
    this.showAddForm = true;
  }

  closeAddForm() {
    this.showAddForm = false;
  }

  getUsers(): void {

    this.http.get<any[]>(
      'https://69e0d98d29c070e6597c24fa.mockapi.io/user'
    ).subscribe({

      next: (result) => {

        this.users = result;

        this.cdr.detectChanges();

      },

      error: (err) => {

        console.log(err);

        Swal.fire({
          icon: 'error',
          title: 'API Error'
        });

      }

    });

  }

  editUser(index: number) {
    this.editIndex = index;
    this.oldUser = { ...this.users[index] };
    this.editingUser = { ...this.users[index] };
    this.cdr.detectChanges();
  }

  saveUser(index: number) {
    if (!this.editingUser || !this.oldUser) {
      return;
    }

    const user = this.editingUser;
    const changes: any[] = [];

    if (this.oldUser.name !== user.name) {
      changes.push({
        field: 'Name',
        oldValue: this.oldUser.name,
        newValue: user.name
      });
    }

    if (this.oldUser.email !== user.email) {
      changes.push({
        field: 'Email',
        oldValue: this.oldUser.email,
        newValue: user.email
      });
    }

    if (this.oldUser.role?.toString() !== user.role?.toString()) {
      changes.push({
        field: 'Role',
        oldValue: this.oldUser.role,
        newValue: user.role
      });
    }

    if (this.oldUser.reportee?.toString() !== user.reportee?.toString()) {
      changes.push({
        field: 'Reportee',
        oldValue: this.oldUser.reportee,
        newValue: user.reportee
      });
    }

    if (changes.length > 0) {
      this.changeRequests.push({
        userIndex: index,
        userId: user.id,
        oldData: { ...this.oldUser },
        newData: { ...user },
        changes: changes
      });

      Swal.fire('Request Created', 'Edit request generated. Please approve from dropdown.', 'success');
    }

    this.editIndex = -1;
    this.oldUser = null;
    this.editingUser = null;
  }

  approveRequest(req: any, reqIndex: number) {

    const approvedUser = {
      ...req.newData,
      status: 'Approved'
    };

    this.http.put(
      'https://69e0d98d29c070e6597c24fa.mockapi.io/user/' + req.userId,
      approvedUser
    ).subscribe({
      next: () => {

        this.users[req.userIndex] = approvedUser;

        this.changeRequests.splice(reqIndex, 1);
        this.cdr.detectChanges();

        Swal.fire(
          'Approved',
          'Changes Approved Successfully',
          'success'
        );
      },

      error: (err) => {
        console.log(err);
      }
    });
  }

  rejectRequest(req: any, reqIndex: number) {

    const rejectedUser = {
      ...req.oldData,
      status: 'Rejected'
    };

    this.http.put(
      'https://69e0d98d29c070e6597c24fa.mockapi.io/user/' + req.userId,
      rejectedUser
    ).subscribe({
      next: () => {

        this.users[req.userIndex] = rejectedUser;

        this.changeRequests.splice(reqIndex, 1);
        this.cdr.detectChanges();

        Swal.fire(
          'Rejected',
          'Edit request rejected successfully.',
          'info'
        );
      },

      error: (err) => {
        console.log(err);
      }
    });
  }

  deleteUser(id: string) {

    Swal.fire({
      title: 'Delete User?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Delete'
    }).then((result) => {

      if (result.isConfirmed) {

        this.http.delete(
          'https://69e0d98d29c070e6597c24fa.mockapi.io/user/' + id
        ).subscribe({

          next: () => {

            this.cdr.detectChanges();
            Swal.fire({
              icon: 'success',
              title: 'Deleted Successfully',
              timer: 1000,
              showConfirmButton: false
            });
            window.location.reload();

          },

          error: (err) => {

            console.log(err);

            Swal.fire({
              icon: 'error',
              title: 'Delete Failed'
            });

          }

        });

      }

    });

  }
}