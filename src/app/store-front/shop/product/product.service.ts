import {inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {ProductDetail} from "../shop.helper";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {SarreCurrency} from "../../../global-utils";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  HOST: string | undefined = environment.domain;
  private readonly http = inject(HttpClient);

  productDetailsByProductUUID(uuid: string, currency: SarreCurrency): Observable<ProductDetail[]> {
    const url: string = `${this.HOST}api/v1/client/product/detail?product_id=${uuid}&currency=${currency}`;
    return this.http.get<ProductDetail[]>(url, {
      withCredentials: true
    })
      // .pipe(
      //   map((arr) => {
      //
      //     for (let detail of arr) {
      //       detail.url = DUMMY_IMAGES;
      //     }
      //
      //     return arr;
      //   })
      // );
  }

}
