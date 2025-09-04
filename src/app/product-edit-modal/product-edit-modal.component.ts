import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-edit-modal',
  imports: [FormsModule],
  templateUrl: './product-edit-modal.component.html',
  styleUrl: './product-edit-modal.component.css'
})
export class ProductEditModalComponent {

@Input() product: any;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  onSave() {
    this.save.emit(this.product);
  }

  onCancel() {
    this.cancel.emit();
  }

}
