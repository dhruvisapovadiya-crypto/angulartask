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
  reporteeList: string[] = [];

  editIndex: number = -1;
  oldUser: any = null;
  editingUser: any = null;

  changeRequests: any[] = [];
  historyRequests: any[] = [];

  isApproving = false;
  isRejecting = false;

  isDarkMode = false;

  ngOnInit() {
    this.getUsers();

    // CHANGE: pending dropdown request refresh pachi pan rahe
    const pendingData = localStorage.getItem('changeRequests');

    if (pendingData) {
      this.changeRequests = JSON.parse(pendingData);
    }

    // CHANGE: history page ma pending/approved/rejected badhu rahe
    const historyData = localStorage.getItem('historyRequests');

    if (historyData) {
      this.historyRequests = JSON.parse(historyData);
    }

    const savedTheme = localStorage.getItem('userListTheme');

    if (savedTheme === 'dark') {
      this.isDarkMode = true;
    } else {
      this.isDarkMode = false;
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      localStorage.setItem('userListTheme', 'dark');
    } else {
      localStorage.setItem('userListTheme', 'light');
    }
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
        this.users = result.reverse();

        this.reporteeList = [
          ...new Set(result.map(user => user.name))
        ];

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

    this.oldUser = {
      ...this.users[index],
      reportee: [...(this.users[index].reportee || [])]
    };

    this.editingUser = {
      ...this.users[index],
      reportee: [...(this.users[index].reportee || [])]
    };

    this.reporteeList = this.users
      .filter(user => user.name !== this.editingUser.name)
      .map(user => user.name);

    this.cdr.detectChanges();
  }

  toggleReportee(name: string, event: any) {
    if (!this.editingUser.reportee) {
      this.editingUser.reportee = [];
    }

    if (event.target.checked) {
      this.editingUser.reportee.push(name);
    } else {
      this.editingUser.reportee = this.editingUser.reportee.filter(
        (r: string) => r !== name
      );
    }
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

      // CHANGE: one request object banavyo
      const requestData = {
        userIndex: index,
        userId: user.id,

        oldData: {
          ...this.oldUser,
          reportee: [...(this.oldUser.reportee || [])]
        },

        newData: {
          ...user,
          reportee: [...(user.reportee || [])]
        },

        changes: changes,

        status: 'Pending'
      };

      // CHANGE: dropdown ma pending request batavva
      this.changeRequests.push(requestData);

      // CHANGE: history page ma pending request pan batavva
      this.historyRequests.push(requestData);

      // CHANGE: pending request refresh pachi pan dropdown ma rahe
      localStorage.setItem(
        'changeRequests',
        JSON.stringify(this.changeRequests)
      );

      // CHANGE: history refresh pachi pan rahe
      localStorage.setItem(
        'historyRequests',
        JSON.stringify(this.historyRequests)
      );

      Swal.fire(
        'Request Created',
        'Edit request generated. Please approve from dropdown.',
        'success'
      );
    }

    this.editIndex = -1;
    this.oldUser = null;
    this.editingUser = null;
  }

approveRequest(req: any, reqIndex: number) {
  this.isApproving = true;

  // CHANGE: dropdown request status Approved
  req.status = 'Approved';

  // CHANGE: history page ma same pending request ne Approved karva
  const historyItem = this.historyRequests.find(
    item => item.userId == req.userId && item.status == 'Pending'
  );

  if (historyItem) {
    historyItem.status = 'Approved';
  }

  const approvedUser = {
    ...req.newData,
    status: 'Approved'
  };

  this.http.put(
    'https://69e0d98d29c070e6597c24fa.mockapi.io/user/' + req.userId,
    approvedUser
  ).subscribe({
    next: () => {
      setTimeout(() => {
        this.isApproving = false;

        this.users[req.userIndex] = approvedUser;

        // CHANGE: dropdown mathi pending request remove
        this.changeRequests.splice(reqIndex, 1);

        localStorage.setItem(
          'changeRequests',
          JSON.stringify(this.changeRequests)
        );

        // CHANGE: updated history status save
        localStorage.setItem(
          'historyRequests',
          JSON.stringify(this.historyRequests)
        );

        this.cdr.detectChanges();

        Swal.fire(
          'Approved',
          'Changes Approved Successfully',
          'success'
        );
      }, 2000);
    },
    error: (err) => {
      this.isApproving = false;
      console.log(err);
    }
  });
}

rejectRequest(req: any, reqIndex: number) {
  this.isRejecting = true;

  // CHANGE: dropdown request status Rejected
  req.status = 'Rejected';

  // CHANGE: history page ma same pending request ne Rejected karva
  const historyItem = this.historyRequests.find(
    item => item.userId == req.userId && item.status == 'Pending'
  );

  if (historyItem) {
    historyItem.status = 'Rejected';
  }

  const rejectedUser = {
    ...req.oldData,
    status: 'Rejected'
  };

  this.http.put(
    'https://69e0d98d29c070e6597c24fa.mockapi.io/user/' + req.userId,
    rejectedUser
  ).subscribe({
    next: () => {
      setTimeout(() => {
        this.isRejecting = false;

        this.users[req.userIndex] = rejectedUser;

        // CHANGE: dropdown mathi pending request remove
        this.changeRequests.splice(reqIndex, 1);

        localStorage.setItem(
          'changeRequests',
          JSON.stringify(this.changeRequests)
        );

        // CHANGE: updated history status save
        localStorage.setItem(
          'historyRequests',
          JSON.stringify(this.historyRequests)
        );

        this.cdr.detectChanges();

        Swal.fire(
          'Rejected',
          'Sorry, Your Edit request rejected so your changes not displayed',
          'warning'
        );
      }, 2000);
    },
    error: (err) => {
      this.isRejecting = false;
      console.log(err);
    }
  });
}

  getRequestCount(userId: string): number {
    return this.changeRequests.filter(
      req => req.userId == userId && req.status === 'Pending'
    ).length;
  }

  getHistory(userId: string) {
    return this.historyRequests.filter(
      req => req.userId == userId
    );
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