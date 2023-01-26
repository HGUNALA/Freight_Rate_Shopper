import { Component, OnInit, ViewEncapsulation, ViewChild, ViewContainerRef } from '@angular/core';
import { CoreBase, Log } from '@infor-up/m3-odin';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { DemoRoutingStateService } from '../demo/services/routingstate.service/routingstate.service';
import { DemoUserContextService } from '../demo/services/usercontext.service/usercontext.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
   styleUrls: ['./launcher.component.css'],
   templateUrl: './launcher.component.html',
   encapsulation: ViewEncapsulation.None
})
export class LauncherComponent extends CoreBase implements OnInit {

   @ViewChild('panelPlaceholder', { read: ViewContainerRef }) placeholder: ViewContainerRef;

   isReady: boolean;
   isShowSidebar: boolean;
   title: string = 'Freight Rate Shopper';

   constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public translate: TranslateService,
      private routingStateService: DemoRoutingStateService,
      private userContextService: DemoUserContextService) {
      super('LauncherComponent');
      Log.setDebug();
      console.log(Log.setDebug());

      this.routingStateService.loadRouting();
   }

   ngOnInit(): void {
      // Get language from user
      if (this.userContextService.userContext) {
        console.log(this.userContextService.userContext.currentDivision);
        console.log(this.userContextService.userContext.language);
         this.translate.setDefaultLang(this.userContextService.userContext.language);
         this.changeLanguage(this.userContextService.userContext.language);
         setTimeout(() => {
            this.isReady = true;
         }, 1000);
      } else {
         this.userContextService.getUserContext().subscribe(() => {
            console.log("hello1");
            this.translate.setDefaultLang(this.userContextService.userContext.language);
            this.changeLanguage(this.userContextService.userContext.language);
            console.log(this.userContextService.userContext.currentDivision);
            setTimeout(() => {
               this.isReady = true;
            }, 1000);
         });
      }
   }

   changeLanguage(language: string) {
      switch (language) {
         case "FR":
            Soho.Locale.set('fr-FR');
            break;
         case "GB":
            Soho.Locale.set('en-US');
            break;
         case "SE":
            Soho.Locale.set('sv-SE');
            break;
      }
   }

   onRefreshData() {
      try {
         // Get url
         const url: string = this.router.url.split("?")[0];
         // Get current route query params. It is non-extendable and hence we need to create a new object
         let temp: Object = this.activatedRoute.queryParams["value"];
         const keys = Object.keys(temp);
         // Create new query params object
         let parms = {};
         for (let key of keys) {
            parms[key] = temp[key]
         }
         /**
          * Use timestamp to workaround the route shouldReuseRoute (checks if curr
          * and future route is the same) logic
          *
          */
         parms["TMTS"] = new Date();
         let nav: NavigationExtras = {
            skipLocationChange: true,
            queryParams: parms
         }
         // Navigate back and forth to reload
         this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate([url], nav)
         );
      } catch (err) {
         Log.info(err);
      }
   }

   onShowSidebar() {
      this.isShowSidebar = !this.isShowSidebar;
      if (this.isShowSidebar) {
         document.getElementById("appMain").style.width = "calc(100vw - 250px)";
         document.getElementById("appSidebar").style.height = "100vh";
         document.getElementById("appSidebar").style.width = "250px";
      } else {
         document.getElementById("appMain").style.width = "calc(100vw)";
         document.getElementById("appSidebar").style.height = "0";
         document.getElementById("appSidebar").style.width = "0";
      }
   }

}
