import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { Product } from '../type/product';
import { SupabaseService } from '../services/supabase.service';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  imports:[ProductCardComponent,CommonModule]
})
export class ProductComponent implements OnInit {

  products: any[] | null = null;
  isLoading = true;


  constructor(private route: ActivatedRoute,private supabaseService: SupabaseService) {}
  categories: any | null = null;
  description: string = '';
  nameCategory: string = '';
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['categoryid'];
      //this.loadProducts(id);

      this.cargarProductosPorCategoria(id);

    });
  }

  loadProducts(categoryId: number): void {

  this.isLoading = true;
  this.supabaseService.getCategoriaById(categoryId).subscribe({
    next: data => {
      if (data.data && data.data.length > 0) {
        this.categories = data.data[0]; // si es array
        this.nameCategory = this.categories?.title;
        this.description = this.categories?.description;
      } else {
        console.warn('No se encontró la categoría');
        this.nameCategory = '';
        this.description = '';
      }
    },
    error: error => {
      console.error('Error al obtener categorías:', error);
    }
  });

  // this.supabaseService.getProductosByCategoria(categoryId).subscribe({
  //   next: data => {
  //     this.products = data.data;
  //     setTimeout(() => {
  //       this.isLoading = false;
  //     }, 1500);

  //   },
  //   error: error => {
  //     console.error('Error al obtener productos:', error);
  //     this.isLoading = false;
  //   }
  // });

}

async cargarProductosPorCategoria(categoryId: number) {
  this.isLoading = true;
  try {
    const productos = await this.supabaseService.getProductosByCategoria(categoryId);
    this.products = productos;

    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    this.isLoading = false;
  }
}


}
