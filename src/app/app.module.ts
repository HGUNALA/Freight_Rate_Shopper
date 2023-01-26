import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { M3OdinModule } from '@infor-up/m3-odin-angular';
import { SohoComponentsModule, SohoDropDownModule } from 'ids-enterprise-ng';
import { AppComponent } from './app.component';
import { LauncherModule } from './mashup/launcher.module';

import { APP_BASE_HREF } from '@angular/common';
import { DataGridOptions } from './datagridoptions';

@NgModule({
   imports: [
      BrowserModule,
      FormsModule,
      AppRoutingModule,
      M3OdinModule,
      SohoComponentsModule,
      LauncherModule,
      SohoDropDownModule
   ],
   declarations: [
      AppComponent,
   ],
   providers: [
      { provide: APP_BASE_HREF, useValue: window.location.pathname }, DataGridOptions
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
