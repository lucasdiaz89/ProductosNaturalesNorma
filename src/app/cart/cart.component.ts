import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
//import { trigger, transition, style, animate } from '@angular/animations';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  imports:[CommonModule],
 // animations: [
  //   trigger('fadeInOut', [
  //     transition(':enter', [
  //       style({ opacity: 0 }),
  //       animate('300ms ease-in', style({ opacity: 1 }))
  //     ]),
  //     transition(':leave', [
  //       animate('300ms ease-out', style({ opacity: 0 }))
  //     ])
  //   ])
  // ]
})
export class CartComponent implements OnInit {

  cartItems: any[] = [];
  total = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCart();
    this.calculateTotal();
  }


calculateTotal(): void {
  const total = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  this.total = parseFloat(total.toFixed(2));
}


  updateItemQuantity(item: any, change: number): void {
    if (item.quantity + change >= 1) {
      item.quantity += change;
      this.cartService.updateCart(this.cartItems);  // Tendrás que implementar este método en tu servicio
      this.calculateTotal();
    }
  }

  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(p => p.id !== productId);
    this.cartService.updateCart(this.cartItems);
    this.calculateTotal();
  }

  clearCart(): void {
    this.cartItems = [];
    this.cartService.clearCart();
    this.calculateTotal();
  }

  hacerPedido(): void {
  let mensaje = '¡Hola! Quiero hacer un pedido:\n\n';

  this.cartItems.forEach(item => {
    mensaje += `• ${item.title} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}  (${item.cod_prod})\n`;
  });

  mensaje += `\nTotal: $${this.total.toFixed(2)}\n`;
  mensaje += '\n¿Está disponible para entrega?';

  const mensajeCodificado = encodeURIComponent(mensaje);
  const numeroWhatsApp = '5493541337754';
  const url = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;

  window.open(url, '_blank');
  }

}
