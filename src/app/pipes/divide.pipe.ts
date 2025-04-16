import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'divide',
  standalone: true
})
export class DividePipe implements PipeTransform {

  transform(value: number | undefined, divisor: number = 1000): number | string {
    if (typeof value !== 'number') return '-';
    console.log(Math.floor(value / divisor));
    return Math.floor(value / divisor); // ou value / divisor si tu veux un float
 }

}
