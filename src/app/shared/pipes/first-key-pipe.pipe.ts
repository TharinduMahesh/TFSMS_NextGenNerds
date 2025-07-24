import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstKey'
})
export class FirstKeyPipe implements PipeTransform {

  transform(value: any): string | null {
    const keys = Object.keys(value);
    if(keys && keys.length > 0) {
      return keys[0]; // Return the first key of the object
    } 
    return null;
  }

}