import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  imports:[CommonModule]
})
export class ProductCardComponent implements OnInit {
  @Input() product!: { id: number, cod_prod: string, title: string,description: string, image: string, price: number, category_prod: number, feature: boolean };
  quantity: number = 1;
  constructor(private toastr: ToastrService, private cartService: CartService,private supabaseService: SupabaseService) { }
  categories: any | null = null;
  nameCategory: string = '';
  isFavorite: boolean = false;

  ngOnInit(): void {


    this.isFavorite = this.cartService.isFavorite(this.product.id);
    this.quantity = this.cartService.getCart().find(item => item.id === this.product.id)?.quantity || 1;
      this.loadCategory(this.product.category_prod);
    }


  loadCategory(categoryId: number): void {
  this.supabaseService.getCategoriaById(categoryId).subscribe({
    next: data => {
      if (data.data && data.data.length > 0) {
        this.categories = data.data[0];
        this.nameCategory = this.categories?.title;
      } else {
        console.warn('No se encontró la categoría');
        this.nameCategory = '';
      }
    },
    error: error => {
      console.error('Error al obtener categorías:', error);
    }
  });
}
  addToCart() {
    this.cartService.addToCart(this.product, this.quantity);
    this.toastr.success(`Producto agregado al carrito. Cantidad: ${this.quantity}`, '¡Éxito!');
  }

  updateQuantity(change: number) {
    if(this.quantity + change >= 1) {
      this.quantity += change;
    }
  }

toggleFavorite(): void {
    if (this.isFavorite) {
      this.cartService.removeFromFavorites(this.product.id);
    } else {
      this.cartService.addToFavorites(this.product);
    }
    this.isFavorite = !this.isFavorite;
  }

}
