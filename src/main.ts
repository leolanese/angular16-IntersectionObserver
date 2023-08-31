import 'zone.js/dist/zone';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ViewChildren,
  QueryList,
} from '@angular/core';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="scroll-area" #scrollArea>
    <div 
      *ngFor="let n of numbers; let i = index" 
      class="item"
      #itemElements
      [ngClass]="{'in-viewport': isInViewport && targetIndex === i}"
    >
      {{ n }}
    </div>
  </div>
  `,
  styleUrls: ['./main.css'],
})
export class App implements AfterViewInit, OnDestroy {
  numbers = Array(30)
    .fill(0)
    .map((x, i) => i);
  observer!: IntersectionObserver;
  isInViewport = false;
  targetIndex = 15;
  observedIndexes: number[] = [];
   targetIndexes = [15, 29]; 

  @ViewChild('scrollArea') scrollArea!: ElementRef;
  @ViewChildren('itemElements') itemElements!: QueryList<ElementRef>;

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      (event) => {
        console.log(`intersecting: `, event);

        this.isInViewport = event[0].intersectionRatio !== 0;
        console.log(`${this.isInViewport ? 'YAY!' : 'Nop'} element ${this.targetIndex} ${this.isInViewport ? 'in' : 'not in'} viewport`);
        
      },
      {
        root: this.scrollArea.nativeElement,
      }
    );

    this.observer.observe(
      this.itemElements.toArray()[this.targetIndex].nativeElement
    );
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }
}

bootstrapApplication(App);
