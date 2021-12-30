import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataPropertyGetterPipe'
})
export class DataPropertyGetterPipePipe implements PipeTransform {

  transform(object: any, keyName: string, ...args: unknown[]): unknown {
    return object[keyName];
  }

}
