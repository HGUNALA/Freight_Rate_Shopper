import { Injectable } from '@angular/core';
import { FormService } from '@infor-up/m3-odin-angular';
import { IEnvironmentContext } from '@infor-up/m3-odin';
import { Observable } from 'rxjs';


@Injectable({
   providedIn: 'root',
})

export class DemoFormUserContextService {

   formUserContext: IEnvironmentContext;

   constructor(private formService: FormService) {
      this.formService.getEnvironmentContext().subscribe((formUserContext: IEnvironmentContext) => {
      this.formUserContext = formUserContext;
      console.log(this.formUserContext);


      });
   }

   getEnvironmentContext(): Observable<IEnvironmentContext> {
      return this.formService.getEnvironmentContext();
   }








}
