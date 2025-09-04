import { Component, input, Input } from '@angular/core';
import { Category } from '../type/category';

@Component({
  selector: 'app-card-category',
  imports: [],
  templateUrl: './card-category.component.html',
  styleUrl: './card-category.component.scss'
})
export class CardCategoryComponent {
    @Input() category!: Category;
    @Input() description!: string;
}
