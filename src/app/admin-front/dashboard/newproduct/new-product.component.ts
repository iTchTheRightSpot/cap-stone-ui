import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CategoryResponse, CKEDITOR4CONFIG, CollectionResponse, SizeInventory} from "../../shared-util";
import {catchError, Observable, of, switchMap} from "rxjs";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CategoryService} from "../category/category.service";
import {CollectionService} from "../collection/collection.service";
import {NewProductService} from "./new-product.service";
import {SizeInventoryComponent} from "../sizeinventory/size-inventory.component";
import {CKEditorModule} from "ckeditor4-angular";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatRadioModule} from "@angular/material/radio";
import {DirectiveModule} from "../../../directive/directive.module";
import {ProductService} from "../product/product.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ToastService} from "../../../service/toast/toast.service";

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CKEditorModule,
    SizeInventoryComponent,
    CKEditorModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    ReactiveFormsModule,
    DirectiveModule
  ],
  templateUrl: './new-product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewProductComponent {
  private readonly service: NewProductService = inject(NewProductService);
  private readonly categoryService: CategoryService = inject(CategoryService);
  private readonly collectionService: CollectionService = inject(CollectionService);
  private readonly productService: ProductService = inject(ProductService);
  private readonly toastService: ToastService = inject(ToastService);

  categories$: Observable<CategoryResponse[]> = this.categoryService._categories$;
  collections$: Observable<CollectionResponse[]> = this.collectionService._collections$;

  config = CKEDITOR4CONFIG;
  content: string = '';
  files: File[] = []; // Images
  inputRows: SizeInventory[] = [];

  reactiveForm: FormGroup = new FormGroup({
    category: new FormControl('', [Validators.required]),
    collection: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.max(50)]),
    price: new FormControl('', Validators.required),
    desc: new FormControl('', [Validators.required, Validators.max(400)]),
    currency: new FormControl("USD"),
    files: new FormControl(null, Validators.required),
    visible: new FormControl(false, Validators.required),
    colour: new FormControl('', Validators.required),
    sizeInventory: new FormControl(null, Validators.required)
  });

  /**
   * Responsible for verifying file uploaded is in image and then updating file FormGroup.
   * For better understanding https://blog.angular-university.io/angular-file-upload/
   * @param event of any
   * @return void
   * */
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.reactiveForm.controls['files'].setValue(file);
      this.files.push(file);
    }
  }

  /** Clears reactiveForm */
  clear(): void {
    this.service.setImageUrl([])
    this.files = [];
    this.reactiveForm.reset();
  }

  /**
   * Removes image clicked
   * @param file
   * @return void
   * */
  remove(file: File): void {
    const index: number = this.files.findIndex((value: File) => value.name === file.name);
    this.files.splice(index, 1);
  }

  /** Sets Size and Inventory to FormGroup */
  sizeInv(arr: SizeInventory[]): void {
    this.inputRows = arr;
    this.reactiveForm.controls['sizeInventory'].setValue(arr);
  }

  /**
   * Method responsible for creating a new product
   * @return void
   * */
  submit(): Observable<number> {
    return this.service.create(this.toFormData(this.reactiveForm)).pipe(
      switchMap((status: number) => {
        // TODO clear sizeInventory

        this.clear();
        this.reactiveForm.controls['collection'].setValue('');
        this.reactiveForm.controls['category'].setValue('');

        return this.productService.fetchAllProducts().pipe(switchMap(() => of(status)));
      }),
      catchError((err: HttpErrorResponse) => {
        this.toastService.toastMessage(err.error.message);
        return of(err.status);
      })
    );
  }

  /** Responsible for converting from FormGroup to FormData */
  private toFormData(formGroup: FormGroup): FormData {
    this.reactiveForm.controls['sizeInventory'].setValue(null);
    this.reactiveForm.controls['files'].setValue(null);
    const formData: FormData = new FormData();
    for (const key in formGroup.controls) {
      if (key !== 'files' && key !== 'sizeInventory') {
        formData.append(key, formGroup.controls[key].value);
      }
    }
    this.files.forEach((file: File) => formData.append('files', file));
    this.inputRows.forEach((row: SizeInventory) => formData.append('sizeInventory', JSON.stringify(row)));
    return formData;
  }

  protected readonly URL = URL;
}
