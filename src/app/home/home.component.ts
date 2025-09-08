import { Component, OnInit } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../services/supabase.service';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  categoryId: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [ProductCardComponent,CommonModule]
})
export class HomeComponent implements OnInit {

  products: any[] | null = null;
  favorites: any[]  = [];
  heroImage: string = 'https://firebasestorage.googleapis.com/v0/b/productosnaturales-81b16.appspot.com/o/ImageBackground.jpg?alt=media&token=2b0e0db3-1ab7-4816-8d1f-f75749b5f283';
  constructor(private supabaseService: SupabaseService,private router: Router,private cartService: CartService) {}
  ngOnInit(): void {
    this.loadProductsFeature();
    this.loadProductsFavorites();
  }

  async loadProductsFeature() {
    const productos = await this.supabaseService.getProductosFeature();
    this.products = productos;

  }
  loadProductsFavorites(): void {
  this.favorites = this.cartService.getFavorites();
  }
  onSectionChange(section: string): void {

    this.router.navigate([`/${section}`]);

    console.log('Section changed to:', section);
  }
}
