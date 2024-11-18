import { Routes } from '@angular/router';
import {CategoryContainerComponent} from "./containers/category-container.component";
import {CategoryComponent} from "./category.component";

export default [

  {
    path     : '',
    component: CategoryComponent,
    children: [
      {
        path: '',
        component: CategoryContainerComponent,
        data: {
          title: 'Categoría'
        }
      },
    ],
  },
] as Routes;
