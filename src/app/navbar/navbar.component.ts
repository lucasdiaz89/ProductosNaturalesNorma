import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../services/cart.service';
import { sDBCliente } from '../supabaseClient';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [CommonModule,RouterModule,FormsModule]
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  isLoggedIn = false;
  userEmail: string | null = null;

email = '';
password = '';


  showLoginModal = false;


  logoUrl='https://qporfxmzivhzjowtxhdy.supabase.co/storage/v1/object/sign/logo/logProd.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yOTRjZGQ1Yi0wYmI1LTRmMTktYjM2ZC1kZmM4YjcxM2Y3M2MiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvL2xvZ1Byb2QucG5nIiwiaWF0IjoxNzU3MzM4ODk4LCJleHAiOjEyMzk2MDMwMDk4fQ.2OLAQJdwBksT-xq1sNl2bLfkDLftZlr9F0f5DPKze9Y'
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  cartQuantity: number = 0;

  constructor(private cartService: CartService,private router: Router) {}
  async ngOnInit() {
    this.getCartQuantity();
    window.addEventListener('cart-updated', () => {this.cartQuantity = 0; this.getCartQuantity();});

    const { data } = await sDBCliente.auth.getUser();
    this.isLoggedIn = !!data.user;
    this.userEmail = data.user?.email ?? null;

    this.isLoggedIn = !!data.user;
    this.userEmail = data.user?.email ?? null;

  }
  getCartQuantity() {
    const cart = JSON.parse(localStorage.getItem('cart_items') || '[]');
    this.cartQuantity = cart.reduce((total: number, item: any) => total + (item.quantity || 1), 0);
  }

  async logout() {
    await sDBCliente.auth.signOut();
    this.isLoggedIn = false;
    this.userEmail = null;
    this.email = '';
    this.password = '';

      this.router.navigate(['/']);
  }

toggleLoginModal() {
    this.showLoginModal = !this.showLoginModal;
  }

async login() {
  const { error } = await sDBCliente.auth.signInWithPassword({
    email: this.email,
    password: this.password
  });

  if (!error) {
    this.isLoggedIn = true;
    this.toggleLoginModal();

      this.router.navigate(['/settings']);
  } else {

      this.router.navigate(['/']);
  }
}

}

