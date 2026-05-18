import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  user = {
    name: '',
    email: '',
    password: ''
  };

  isDark = false;

  changeMode() {
    this.isDark = !this.isDark;
  }

  constructor(private router: Router) { }
  login(form: NgForm) {
    if (form.valid) {

      localStorage.setItem(
        'username',
        this.user.name
      );

      localStorage.setItem(
        'email',
        this.user.email
      );

      this.router.navigate(['/dashboard']);
    }
  }
}