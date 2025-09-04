import { Component, OnInit } from '@angular/core';
import { Product } from '../type/product';
import { FormBuilder, FormGroup, FormsModule, NgModel } from '@angular/forms';
import { SupabaseService } from '../services/supabase.service';
import { CommonModule } from '@angular/common';
import { ProductTable } from '../type/productTabe';
import { ProductEditModalComponent } from '../product-edit-modal/product-edit-modal.component';
import { sDBCliente } from '../supabaseClient';

@Component({
  selector: 'app-settings',
  imports: [CommonModule,FormsModule,ProductEditModalComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  productos: ProductTable[] = [];
  selectedProduct: ProductTable | null = null;
  productForm: FormGroup;

  searchTerm: string = '';
  isLoggedIn: boolean = false;

  constructor(
    private supabaseService: SupabaseService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      categoria: [''],
      title: [''],
      description: [''],
      price: [0]
    });
  }

  ngOnInit(): void {
    this.verificarSesion();
    this.loadProductos();

  }

  async loadProductos() {
    this.productos = await this.supabaseService.fetchProductos();
  }

async verificarSesion() {
  const { data } = await sDBCliente.auth.getSession();
  this.isLoggedIn = !!data.session;
}


selectProduct(product: any) {
  this.selectedProduct = { ...product };
}

saveChanges(updatedProduct: any) {
  this.supabaseService.updateProducto(updatedProduct).then(() => {
    this.loadProductos();
    this.selectedProduct = null;
  });
}

filteredProducts(): ProductTable[] {
    return this.productos.filter(prod =>
      prod.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }


}
