import { Injectable } from '@angular/core';
import { HashLocationStrategy } from '@angular/common';

@Injectable()
export class DemoLocationStrategy extends HashLocationStrategy {
   prepareExternalUrl(_internal: string): string {
      return this.getBaseHref();
   }
}
