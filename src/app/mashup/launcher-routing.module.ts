import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoModule } from '../demo/demo.module';

import { LauncherComponent } from './launcher.component';
import { MainPageComponent } from './pages/main-page/main-page.component';

const routes: Routes = [
   {
      path: 'mashup', component: LauncherComponent, children: [
         { path: '', component: MainPageComponent },
      ]
   }
];

@NgModule({
   imports: [
      RouterModule.forChild(routes),
      DemoModule
   ],
   exports: [RouterModule]
})
export class LauncherRoutingModule { }
