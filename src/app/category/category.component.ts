import { SupabaseService } from './../services/supabase.service';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardCategoryComponent } from '../card-category/card-category.component';
import { CommonModule } from '@angular/common';
import { Category } from '../type/category';

@Component({
  selector: 'app-category',
  imports: [CardCategoryComponent,CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {

  categories: Category[] = [];
  filteredCategories: Category[] = [];
  categoryId!: number;
  imageUrl!:string;
  description!:string;
  isLoading = true;
  constructor(private route: Router,private supabaseService: SupabaseService) {}

  ngOnInit(): void {
  this.loadCategories();
  }

  async loadCategories() : Promise<void> {

      this.isLoading = true;
    try {
      this.categories = await this.supabaseService.getAllCategories();
    }
    catch(error){
      console.error('Error loading categories:',error)
    }
    finally {
      setTimeout(() => {
        this.isLoading = false;
      }, 1500);
    }
  }
  goToProducts(categoryId: number): void {
        this.route.navigate(['/category', categoryId,'products']);
    }
}
