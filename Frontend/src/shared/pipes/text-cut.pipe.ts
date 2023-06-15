import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textCut'
})
export class TextCutPipe implements PipeTransform {

  transform(value: string): string {
    let string  = value.slice(0,14) + '...'
    return string

  }

}
