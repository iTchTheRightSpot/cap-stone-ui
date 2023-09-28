import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatRadioModule} from "@angular/material/radio";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NewCollectionService} from "./new-collection.service";
import {catchError, Observable, of, switchMap} from "rxjs";
import {CollectionRequest} from "../../shared-util";
import {DirectiveModule} from "../../../directive/directive.module";
import {CollectionService} from "../collection/collection.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ToastService} from "../../../service/toast/toast.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-new-collection',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatRadioModule, ReactiveFormsModule, DirectiveModule],
  templateUrl: './new-collection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewCollectionComponent {

  private readonly newCollectionService: NewCollectionService = inject(NewCollectionService);
  private readonly collectionService: CollectionService = inject(CollectionService);
  private readonly toastService: ToastService = inject(ToastService);
  private readonly router: Router = inject(Router);

  reactiveForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.max(50)]),
    visible: new FormControl(false, Validators.required)
  });

  routeToCollectionComponent = (): void => {
    this.router.navigate(['/admin/dashboard/collection']);
  }

  /** Clears reactiveForm */
  clear(): void {
    this.reactiveForm.reset();
  }

  /**
   * Submit reactive form to our server.
   * The gotcha is on successful creation, we switch map to update collection array
   * @return Observable of type number
   * */
  submit(): Observable<number> {
    const obj: CollectionRequest = {
      name: this.reactiveForm.get('name')?.value,
      visible: this.reactiveForm.get('visible')?.value
    };

    return this.newCollectionService.create(obj).pipe(
      switchMap((status: number): Observable<number> => {
        const res = of(status);
        if (!(status >= 200 && status < 300)) {
          return of(status);
        }

        this.clear();
        return this.collectionService.fetchCollections().pipe(switchMap(() => res));
      }),
      catchError((err: HttpErrorResponse) => {
        this.toastService.toastMessage(err.error.message);
        return of(err.status);
      })
    );
  }

}
