import { Router, NavigationEnd } from '@angular/router';
import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';

@Injectable({
   providedIn: 'root'
})
export class DemoRoutingStateService {
   private history = [];

   constructor(
      private router: Router
   ) { }

   public loadRouting(): void {
      this.router.events
         .pipe(filter(event => event instanceof NavigationEnd))
         .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
            let url = urlAfterRedirects.split(/[?#]/)[0];
            // Don't add to the history if the last url is the same
            if (url != this.history[this.history.length - 1]) {
               this.history = [...this.history, url];
            }
         });
   }

   public getHistory(): string[] {
      return this.history;
   }

   public getPreviousUrl(): string {
      let url: string = "";
      try {
         url = this.history[this.history.length - 2] || 'mashup';
         this.history.length--;
         return url;
      } catch (err) {
         this.history = [];
         return "";
      }
   }
}
