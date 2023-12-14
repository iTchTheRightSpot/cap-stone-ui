import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, ReplaySubject, tap} from "rxjs";
import {Page, SarreCurrency} from "../../../global-utils";
import {ProductResponse, UpdateProduct} from "../../shared-util";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly HOST: string | undefined = environment.domain;
  private readonly http = inject(HttpClient);

  private readonly productSubject = new ReplaySubject<Page<ProductResponse>>()
  products$: Observable<Page<ProductResponse>> = this.productSubject.asObservable();
  products: ProductResponse[] = [];

  private readonly subject = new BehaviorSubject<SarreCurrency>(SarreCurrency.NGN);
  currency$ = this.subject.asObservable();

  setCurrencySubject(currency: SarreCurrency): void {
    this.subject.next(currency);
  }

  /**
   * Responsible for making a PUT call to server to update a product
   * @param obj of type Product
   * @return Observable of type HttpStatus
   * */
  updateProduct(obj: UpdateProduct): Observable<number> {
    const url = `${this.HOST}api/v1/worker/product`
    return this.http.put<UpdateProduct>(url, obj, {
      headers: { 'content-type': 'application/json' },
      observe: 'response',
      withCredentials: true
    }).pipe(map((res: HttpResponse<UpdateProduct>) => res.status));
  }

  /**
   * Responsible for making a DELETE restful call to our serve to delete a product.
   *
   * @param id is Product UUID
   * @return Observable of type HttpStatus
   * */
  deleteProduct(id: string): Observable<number> {
    const url: string = `${this.HOST}api/v1/worker/product`;
    return this.http.delete<HttpResponse<any>>(url, {
      observe: 'response',
      params: {id: id},
      withCredentials: true
    }).pipe(map((res: HttpResponse<any>) => res.status));
  }

  /**
   * Returns a Page of ProductResponse
   * */
  allProducts(
    page: number = 0,
    size: number = 20,
    currency: SarreCurrency
  ): Observable<Page<ProductResponse>> {
    const url = `${this.HOST}api/v1/worker/product`;
    return this.http.get<Page<ProductResponse>>(url, {
      headers: { 'content-type': 'application/json' },
      responseType: 'json',
      params: { page: page, size: size, currency: currency },
      withCredentials: true
    }).pipe(
      tap((res: Page<ProductResponse>) => {
        this.productSubject.next(res);
        this.products = res.content
      })
    );
  }

}
