import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-user.html',
  styleUrl: './add-user.css',
})
export class AddUser {
  http = inject(HttpClient);
  router = inject(Router);

  @Output() closeForm = new EventEmitter<void>();
  @Output() userAdded = new EventEmitter<void>();

  user = {
    name: '',
    email: '',
    role: '',
    reportee: [
      "Riya",
      "Meera",
      "Kavya"
    ],
    status: 'Pending'
  };

addUser() {
  this.http
    .post('https://69e0d98d29c070e6597c24fa.mockapi.io/user', this.user)
    .subscribe(() => {
      alert('User Added Successfully');
      this.userAdded.emit();
      this.closeForm.emit();
      this.router.navigate(['/user-list']);
    });
}
  close() {
    this.closeForm.emit();
    this.router.navigate(['/user-list']);
  }
}

