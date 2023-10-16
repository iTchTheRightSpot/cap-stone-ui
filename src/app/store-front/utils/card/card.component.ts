import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full w-full flex flex-col" >
      <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
        <img class="h-full w-full object-cover object-center lg:h-full lg:w-full" [src]="url" alt="image">
      </div>
      <!-- End of Image Container -->
      <div class="mt-4 flex items-center justify-between">
        <div>
          <h3 class="font-app-card capitalize text-sm text-gray-700">
            {{ name }}
          </h3>
          <!--      <p class="mt-1 text-sm text-gray-500">Black</p>-->
        </div>
        <p class="font-app-card font-medium text-gray-900">{{ price }} {{ currency }}</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  @Input() url: string = '';
  @Input() name: string = '';
  @Input() currency: string = '';
  @Input() price: number = 0;
}
