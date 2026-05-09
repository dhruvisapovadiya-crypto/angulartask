import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddUser } from '../add-user/add-user';
import { RouterLink } from '@angular/router';
import { email } from '@angular/forms/signals';

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

  users: any[] = [{
    name:'dhruvi',
    email:'dhruvi@gmail.com'

  }];

  editIndex: number = -1;

  oldUser: any = null;

  changeRequests: any[] = [];

  ngOnInit() {
    this.getUsers();
  }

  openAddForm() {
    this.showAddForm = true;
  }

  closeAddForm() {
    this.showAddForm = false;
  }

  getUsers() {
    this.http.get<any[]>(
      'https://69e0d98d29c070e6597c24fa.mockapi.io/user'
    ).subscribe({
      next: (result) => {
        this.users = result;
        console.log(result);
      },
      error: (err) => {
        console.log('API Error:', err);
      }
    });
  }

  editUser(index: number) {
    this.editIndex = index;

    this.oldUser = { ...this.users[index] };
  }

  saveUser(user: any, index: number) {

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

      this.users[index] = { ...this.oldUser };
    }

    this.editIndex = -1;
    this.oldUser = null;

    alert('Edit request generated. Please approve from dropdown.');
  }

  approveRequest(req: any, reqIndex: number) {

    this.http.put(
      'https://69e0d98d29c070e6597c24fa.mockapi.io/user/' + req.userId,
      req.newData
    ).subscribe({
      next: () => {

        this.users[req.userIndex] = req.newData;

        this.changeRequests.splice(reqIndex, 1);

        alert('Changes Approved Successfully');
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  rejectRequest(reqIndex: number) {

    this.changeRequests.splice(reqIndex, 1);

    alert('Sorry, your edit request has been rejected.');
  }

  deleteUser(id: string, index: number) {

    this.http.delete(
      'https://69e0d98d29c070e6597c24fa.mockapi.io/user/' + id
    ).subscribe({
      next: () => {

        this.users.splice(index, 1);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}