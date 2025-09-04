import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Product } from '../type/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favorites',
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  favorites: Product[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadFavorites();
    window.addEventListener('favorites-updated', () => this.loadFavorites());
  }

  loadFavorites(): void {
    this.favorites = this.cartService.getFavorites();
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
  }

  removeFromFavorites(productId: number): void {
    this.cartService.removeFromFavorites(productId);
    this.loadFavorites();
  }
}

