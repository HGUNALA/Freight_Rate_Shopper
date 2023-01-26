import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { M3OdinModule } from '@infor-up/m3-odin-angular';
import { SohoComponentsModule } from 'ids-enterprise-ng';

// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DemoBusinessContextService } from '../demo/services/businesscontext.service/businesscontext.service';
import { DemoRoutingStateService } from '../demo/services/routingstate.service/routingstate.service';
import { DemoUserContextService } from '../demo/services/usercontext.service/usercontext.service';





@NgModule({
   declarations: [

   ],
   exports: [

      HttpClientModule,
      TranslateModule
   ],
   imports: [
      CommonModule,
      FormsModule,
      M3OdinModule,
      SohoComponentsModule,
      // ngx-translate and the loader module
      HttpClientModule,
      TranslateModule.forRoot({
         loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
         }
      })

   ],
   providers: [

      DemoBusinessContextService,
      DemoRoutingStateService,
      DemoUserContextService,

   ],
   entryComponents: [

   ]

})
export class DemoModule { }

// Required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
   return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
