import {Routes} from '@angular/router';
import {COLLECTIONNOTEMPTY} from "../store-front-guard";

export const SHOP_ROUTES: Routes = [
  {
    path: 'category',
    loadComponent: () => import('./category/category.component').then(m => m.CategoryComponent)
  },
  {
    path: 'collection',
    loadComponent: () => import('./collection/collection.component').then(m => m.CollectionComponent),
    canActivate: [COLLECTIONNOTEMPTY]
  },
  {
    path: ':path/product/:id',
    loadComponent: () => import('./product/product.component').then(m => m.ProductComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart.component').then(m => m.CartComponent)
  },
  // Path matcher
  {
    path: '',
    redirectTo: 'category',
    pathMatch: 'full'
  }
];
