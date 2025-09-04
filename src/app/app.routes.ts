import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import { CartComponent } from './cart/cart.component';
import { CategoryComponent } from './category/category.component';
import { PageProductsComponent } from './page-products/page-products.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'category/:categoryid/products', component: ProductComponent },
  { path: 'cart', component: CartComponent },
  {path: 'products', component: PageProductsComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
          ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

