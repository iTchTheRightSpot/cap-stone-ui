import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, Renderer2} from '@angular/core';
import {Filter} from "../../shop/shop.helper";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex w-full h-full">
      <div class="w-2/4 max-[600px]:w-full h-full p-8 bg-white overflow-y-auto">

        <button type="button" class="w-full flex justify-between bg-transparent border-0" (click)="closeModal()">
          <h1 class="text-4xl capitalize font-bold tracking-tight text-gray-900">{{ title }}</h1>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
          </svg>
        </button>

        <div class="border-t border-b border-gray-200 py-6" *ngFor="let filter of filters; let i = index">
          <h3 class="flow-root bg-red-900">
            <!-- Expand/collapse section button -->
            <button (click)="toggleSection(i)" type="button" class="flex w-full items-center bg-white py-3 text-gray-400 hover:text-gray-500" aria-controls="filter-section-mobile-1" aria-expanded="false">
              <span class="font-medium text-gray-900 capitalize">{{ filter.parent }}</span>
              <span [style]="{ 'margin-left' : 'auto' }" class="ml-6 flex items-center">
          <!-- Expand icon, show/hide based on section open state. -->
          <svg
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            [style]="{'display': !filter.isOpen ? 'block' : 'none' }"
          >
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
                <!-- Collapse icon, show/hide based on section open state. -->
          <svg
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            [style]="{'display': filter.isOpen ? 'block' : 'none' }"
          >
            <path fill-rule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clip-rule="evenodd" />
          </svg>
        </span>
            </button>
          </h3>

          <!-- Filter section, show/hide based on section state. -->
          <div class="pt-6" id="filter-section-mobile-{{ i }}" [style]="{ 'display': i === indexToOpen ? 'block' : 'none' }">
            <div class="space-y-6">
              <button
                (click)="childClicked(child)"
                type="button"
                class="flex items-center bg-transparent"
                *ngFor="let child of filter.children"
              >
                <input
                  [id]="child"
                  name="category[]"
                  value="new-arrivals"
                  type="radio"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                >
                <label
                  [for]="child"
                  class="ml-3 min-w-0 flex-1 text-gray-500 capitalize cursor-pointer"
                >{{ child }}</label>
              </button>
            </div>
          </div>
        </div>

        <div class="w-full flex flex-col">
          <button
            type="button"
            class="cx-font-size w-full p-8 mb-2 capitalize hover:uppercase border border-black hover:bg-black hover:text-white"
            (click)="closeModal()"

          >clear all</button>
          <button
            type="button"
            class="cx-font-size w-full p-8 capitalize hover:uppercase border bg-black hover:bg-white text-white hover:text-black hover:border-black"
            (click)="closeModal()"
          >show results</button>
        </div>

      </div>

      <!-- Right column which is a black screen -->
      <div class="h-full max-[600px]:hidden flex-1 bg-black opacity-50" (click)="closeModal()"></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent<T> {

  private render: Renderer2 = inject(Renderer2);

  @Input() title: string = '';
  @Input() filters: Filter<T>[] = [];
  @Input() data: T[] = [];
  @Output() emitter = new EventEmitter<T>();

  indexToOpen = -1;

  /**
   * Close filter component
   * */
  closeModal(): void {
    this.render.selectRootElement('.filter-btn', true).style.display = 'none';
  }

  /**
   * Toggles contents of each row when clicked
   * @param index is the index of Filter content in the array
   * @return void
   * */
  toggleSection(index: number): void {
    // Toggle + and - svg
    this.filters[index].isOpen = !this.filters[index].isOpen;

    // Close content if it is visible
    this.indexToOpen = (index === this.indexToOpen ? -1 : index);
  }

  /**
   * Updates parent component on what category or collection is clicked.
   * @param generic is the value. It is a generic type because it can be of type string or number
   * @return void
   * */
  childClicked(generic: T): void {
    this.emitter.emit(generic);
  }

}
