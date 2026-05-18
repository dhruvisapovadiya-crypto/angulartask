import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-user.html',
  styleUrl: './add-user.css',
})
export class AddUser implements OnInit {
  http = inject(HttpClient);
  cdr = inject(ChangeDetectorRef);
  route = inject(ActivatedRoute);
  router = inject(Router);
  changeRequests: any[] = [];

  @Output() closeForm = new EventEmitter<void>();
  @Output() userAdded = new EventEmitter<void>();
  @Input() reporteeList: string[] = [];

  apiUrl = 'https://69e0d98d29c070e6597c24fa.mockapi.io/user';
  isAdding = false;

  user = {
    name: '',
    email: '',
    role: '',
    reportee: [] as string[],
    status: 'Pending'
  };

  ngOnInit() {
    this.getReporteeList();
  }

  getReporteeList() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (res) => {

        this.reporteeList = [
          ...new Map(
            res.map(user => [user.name.toLowerCase(), user.name])
          ).values()
        ];

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  //User ne dropdown thi array ma add karva mate 

  toggleReportee(reportee: string, event: any) {
    if (event.target.checked) {
      this.user.reportee.push(reportee);
    } else {
      this.user.reportee = this.user.reportee.filter(
        (r: string) => r != reportee
      );
    }
  }

  toggleSelectAll(event: any) {
    if (event.target.checked) {
      this.user.reportee = [...this.reporteeList];
    } else {
      this.user.reportee = [];
    }
  }

  isAllSelected(): boolean {
    return this.user.reportee.length === this.reporteeList.length;
  }

  addUser() {
    if (!this.user.name || !this.user.email || !this.user.role || this.user.reportee.length === 0) {
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
        this.http.post(this.apiUrl, this.user).subscribe({
          next: () => {
            this.isAdding = false;

            Swal.fire({
              icon: 'success',
              title: 'User Added Successfully',
              timer: 1200,
              showConfirmButton: false
            });

            this.getReporteeList();
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