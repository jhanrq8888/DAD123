import { Category } from '../models/category';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoryNewComponent } from '../components/form/category-new.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryEditComponent } from '../components/form/category-edit.component';
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";


import {CategoryService} from "../../../../../providers/services/setup/category.service";
import {ClientListComponent} from "../components";

@Component({
    selector: 'app-Categorys-container',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        ClientListComponent,
        CategoryNewComponent,
        CategoryEditComponent,
        FormsModule,
        ReactiveFormsModule,
    ],
    template: `
        <app-category-list
            class="w-full"
            [categories]="categories"
            (eventNew) = "eventNew($event)"
            (eventEdit)="eventEdit($event)"
            (eventDelete)="eventDelete($event)"
        ></app-category-list>
    `,
})
export class CategoryContainerComponent implements OnInit {
    public error: string = '';
    public categories: Category[] = [];
    public category = new Category();

    constructor(
        private _categoryService: CategoryService,
        private _confirmDialogService:ConfirmDialogService,
        private _matDialog: MatDialog,
    ) {}

    ngOnInit() {
        this.getCategorys();
    }

    getCategorys(): void {
        this._categoryService.getAll$().subscribe(
            (response) => {
                this.categories = response;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const CategoryeForm = this._matDialog.open(CategoryNewComponent);
            CategoryeForm.componentInstance.title = 'Nuevo Category' || null;
            CategoryeForm.afterClosed().subscribe((result: any) => {
                if (result) {
                   this.saveCategory(result);
                }
            });
        }
    }

    saveCategory(data: Object): void {
        this._categoryService.add$(data).subscribe((response) => {
        if (response) {
            this.getCategorys()
        }
        });
    }

    eventEdit(idCategory: number): void {
        const listById = this._categoryService
            .getById$(idCategory)
            .subscribe(async (response) => {
                this.category = (response) || {};
                this.openModalEdit(this.category);
                listById.unsubscribe();
            });
    }

    openModalEdit(data: Category) {
        if (data) {
            const CategoryeForm = this._matDialog.open(CategoryEditComponent);
            CategoryeForm.componentInstance.title =`Editar <b>${data.name||data.id} </b>`;
            CategoryeForm.componentInstance.category = data;
            CategoryeForm.afterClosed().subscribe((result: any) => {
                if (result) {
                   this.editCategory(data.id,result);
                }
            });
        }
    }

    editCategory( idCategory: number,data: Object) {
        this._categoryService.update$(idCategory,data).subscribe((response) => {
            if (response) {
                this.getCategorys()
            }
        });
    }


    public eventDelete(idCategpry: number) {
        this._confirmDialogService.confirmDelete(
            {
                // title: 'Confirmación Personalizada',
                // message: `¿Quieres proceder con esta acción ${}?`,
            }
        ).then(() => {
            this._categoryService.delete$(idCategpry).subscribe((response) => {
                this.categories = response;
            });
            this.getCategorys();
        }).catch(() => {
        });

    }
}
