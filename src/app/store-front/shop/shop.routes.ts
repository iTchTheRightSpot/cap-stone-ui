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
  // Path matcher
  {
    path: '',
    redirectTo: 'category',
    pathMatch: 'full'
  }
];
