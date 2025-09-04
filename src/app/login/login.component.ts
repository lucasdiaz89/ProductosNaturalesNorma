import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { sDBCliente } from '../supabaseClient';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [CommonModule,FormsModule]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private router: Router){}
  async login() {
    this.loading = true;
    const { data, error } = await sDBCliente.auth.signInWithPassword({
      email: this.email,
      password: this.password
    });
    if (error || !data.user) {
      this.router.navigate(['/']);
    }
    else {
      this.router.navigate(['/settings']);
    }
    this.loading = false;
  }
}
