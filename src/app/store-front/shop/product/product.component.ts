import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ProductDetail} from "../shop.helper";
import {State, Variant} from "../../../global-utils";
import {catchError, map, Observable, of, startWith} from "rxjs";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {ProductService} from "./product.service";
import {HttpErrorResponse} from "@angular/common/http";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ShopService} from "../shop.service";
import {CartIconService} from "../../utils/carticon/cart-icon.service";

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product.component.html',
  styles: [
    `
        .show {
            overflow: visible;
            height: auto;
        }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent {

  private readonly productService: ProductService = inject(ProductService);
  private readonly utilService: ShopService = inject(ShopService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly cartIconService: CartIconService = inject(CartIconService);

  range = (num: number): number[] => this.utilService.getRange(num);

  // ProductDetail array and Current ProductDetail
  private productDetailArray: ProductDetail[] = [];
  private currentColourSize = { colour: '', size: '' };
  inventory = -1;
  currentProductDetail?: { currImage: string, detail: ProductDetail };
  sku = '';

  // Fetch ProductDetail on load of application
  private id: string | null = this.route.snapshot.paramMap.get('id');
  private uuid: string = this.id === null ? '' : this.id;

  productDetails$: Observable<State<ProductDetail[]>> = this.productService
    .productDetailsByProductUUID(this.uuid)
    .pipe(
      map((arr: ProductDetail[]): State<ProductDetail[]> => {
        // Add all product detail to product array
        this.productDetailArray = arr;

        // First item in array
        const curr: ProductDetail = arr[0];

        // Current ProductDetail with the first item in arr
        this.currentProductDetail = { currImage: curr.url[0], detail: curr };

        return { state: 'LOADED', data: arr };
      }),
      startWith({ state: 'LOADING' }),
      catchError((err: HttpErrorResponse) => of({ state: 'ERROR', error: err.message }))
    );

  showMore: boolean = false; // Show more paragraph

  reactiveForm = this.fb.group({
    colour: new FormControl('', [Validators.required]),
    size: new FormControl({ value: '', disabled: true }, [Validators.required]),
    qty: new FormControl({ value: '', disabled: true }, [Validators.required]),
  });

  /**
   * Updates currentProductDetail on the colour clicked.
   *
   * @param event is of type Event but contains a value colour
   * @return void
   * */
  onclickColour(event: Event): void {
    const colour: string = (event.target as HTMLInputElement).value;
    const findProductDetail: ProductDetail | undefined = this.productDetailArray
      .find((d: ProductDetail) => d.colour === colour);

    if (!findProductDetail) {
      return;
    }

    this.currentColourSize.colour = colour;

    // Reset dependent FormControls
    this.reactiveForm.controls['size'].reset({ value: '', disabled: false });
    this.reactiveForm.controls['qty'].reset({ value: '', disabled: true });

    // Update currentProductDetail
    this.currentProductDetail = { currImage: findProductDetail.url[0], detail: findProductDetail };
  }

  /**
   * Updates reactive form on the size clicked.
   *
   * @param event is of type HTMLInputElement value is size
   * @return void
   * */
  onselectSize(event: Event): void {
    const size: string = (event.target as HTMLInputElement).value;

    const findProductDetail: ProductDetail | undefined = this.productDetailArray
      .find((d: ProductDetail) => d.colour === this.currentColourSize.colour);

    if (!findProductDetail) {
      return;
    }

    const findVariant: Variant | undefined = findProductDetail.variants
      .find((v: Variant) => v.size === size);

    if (!findVariant) {
      return;
    }

    // Update necessary details for the UI
    this.sku = findVariant.sku;
    this.currentColourSize.size = size;
    this.inventory = Number(findVariant.inventory);

    // Reset qty element
    this.reactiveForm.controls['qty'].reset({ value: '', disabled: false });
  }

  /** Stores product in users cart */
  addToCart(): void {
    const detail = this.productDetailArray
      .find(d => d.variants.find(v => v.sku === this.sku));

    const colour = this.reactiveForm.controls['colour'].value
    const qty = this.reactiveForm.controls['qty'].value
    const size = this.reactiveForm.controls['size'].value

    if (!detail || !colour || !qty || !size) {
      return;
    }

    this.cartIconService.addToCart = {
      url: detail.url[0],
      name: detail.name,
      price: detail.price,
      currency: detail.currency,
      colour: colour,
      qty: Number(qty),
      size: size,
      sku: this.sku
    };
  }

}
