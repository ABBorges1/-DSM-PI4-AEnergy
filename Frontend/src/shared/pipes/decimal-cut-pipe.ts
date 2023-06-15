import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalCut'
})
export class DecimalCutPipe implements PipeTransform {

  transform(value: number): string {
    let newDecimal  = value.toFixed(2)
    return newDecimal

  }

}
