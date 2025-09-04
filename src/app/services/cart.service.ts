import { Injectable } from '@angular/core';
import { Product } from '../type/product';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'cart_items';
  private favoritesKey = 'favorite_items';


  getCart(): any[] {
    const cart = localStorage.getItem(this.cartKey);
    return cart ? JSON.parse(cart) : [];
  }

  addToCart(product: Product, quantity: number): void {
    const cart = this.getCart();
    const existingProductIndex = cart.findIndex(p => p.id === product.id);

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));

  }

  removeFromCart(productId: number): void {
    const cart = this.getCart().filter(p => p.id !== productId);
    localStorage.setItem(this.cartKey, JSON.stringify(cart));

    window.dispatchEvent(new Event('cart-updated'));
  }

  clearCart(): void {
    localStorage.removeItem(this.cartKey);

    window.dispatchEvent(new Event('cart-updated'));
  }
  updateCart(cartItems: any[]): void {
  localStorage.setItem(this.cartKey, JSON.stringify(cartItems));

    window.dispatchEvent(new Event('cart-updated'));
  }

  getFavorites(): Product[] {
    const favorites = localStorage.getItem(this.favoritesKey);
    return favorites ? JSON.parse(favorites) : [];
  }

  addToFavorites(product: Product): void {
    const favorites = this.getFavorites();
    if (!favorites.find(p => p.id === product.id)) {
      favorites.push(product);
      localStorage.setItem(this.favoritesKey, JSON.stringify(favorites));
      window.dispatchEvent(new Event('favorites-updated'));
    }
  }

  removeFromFavorites(productId: number): void {
    const updatedFavorites = this.getFavorites().filter(p => p.id !== productId);
    localStorage.setItem(this.favoritesKey, JSON.stringify(updatedFavorites));
    window.dispatchEvent(new Event('favorites-updated'));
  }

  isFavorite(productId: number): boolean {
    return this.getFavorites().some(p => p.id === productId);
  }

  clearFavorites(): void {
    localStorage.removeItem(this.favoritesKey);
    window.dispatchEvent(new Event('favorites-updated'));
  }


}
