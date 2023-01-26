import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { M3OdinModule } from '@infor-up/m3-odin-angular';
import { SohoComponentsModule } from 'ids-enterprise-ng';
import { DemoModule } from '../demo/demo.module';
import { LauncherComponent } from './launcher.component';
import { LauncherRoutingModule } from './launcher-routing.module';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { RateListComponent } from './components/rate-list/rate-list.component';



@NgModule({
   declarations: [
      LauncherComponent,
      MainPageComponent,
      RateListComponent,
   ],
   entryComponents: [],
   imports: [
      CommonModule,
      FormsModule,
      M3OdinModule,
      SohoComponentsModule,
      DemoModule,
      LauncherRoutingModule
   ],
   providers: [
   ],
})
export class LauncherModule { }
