import { Component } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-page-products',
  imports: [CommonModule,ProductCardComponent,FormsModule],
  templateUrl: './page-products.component.html',
  styleUrl: './page-products.component.css'
})
export class PageProductsComponent {

searchTerm: string = '';
  products: any[] = [];
  private searchSubject = new Subject<string>();

  constructor(private supabaseService: SupabaseService) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      if (term.length >= 3) {


this.supabaseService.searchProducts(term).subscribe(response => {
  if (response.error) {
    console.error('Error al buscar productos:', response.error.message);
    this.products = [];
  } else {
    this.products = response.data || [];
  }
  });

  }
});
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

}
