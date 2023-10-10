import {Injectable} from '@angular/core';
import {CategoryResponse} from "../../shared-util";
import {BehaviorSubject, map, Observable} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  HOST: string | undefined;

  private subject$ = new BehaviorSubject<CategoryResponse[]>([]);
  categories$: Observable<CategoryResponse[]> = this.subject$.asObservable();
  categories: CategoryResponse[] = [];

  constructor(private http: HttpClient) {
    this.HOST = environment.domain;
  }

  // Delete category based on id
  deleteCategory(id: string): Observable<number> {
    const url = `${this.HOST}api/v1/worker/category/${id}`;
    return this.http.delete<HttpResponse<any>>(url,{
      observe: 'response',
      withCredentials: true
    }).pipe(map((res: HttpResponse<any>) => res.status));
  }

  // Fetch Categories
  fetchCategories(): Observable<CategoryResponse[]> {
    const url = `${this.HOST}api/v1/worker/category`
    return this.http.get<CategoryResponse[]>(url, {
      observe: 'response',
      responseType: 'json',
      withCredentials: true
    }).pipe(
      map((res: HttpResponse<CategoryResponse[]>) => {
        const body = res.body;
        if (!body) {
          const arr: CategoryResponse[] = []
          return arr;
        }

        this.categories = body;
        this.subject$.next(body);
        return body;
      })
    );
  }

}
