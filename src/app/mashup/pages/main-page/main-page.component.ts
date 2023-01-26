import { Component, ViewEncapsulation } from '@angular/core';
import { CoreBase, MIRecord } from '@infor-up/m3-odin';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

@Component({
   styleUrls: ['./main-page.component.css'],
   templateUrl: './main-page.component.html',
   encapsulation: ViewEncapsulation.None
})
export class MainPageComponent extends CoreBase {

   isReady: boolean= true;
   selectedOrder: MIRecord;
   selectedType: MIRecord;
   selectedOrderDetails: MIRecord;
   visibility = false;
   selectedRate: MIRecord;

   constructor(
      private activatedRoute: ActivatedRoute,
      public translate: TranslateService) {
      super('MainPageComponent');

      /**
       *    Receive data from the URL
       */
      this.activatedRoute.queryParams.subscribe(params => {
         console.log(params)
         let selectedData: string = params['selectedRecord'];
         let selectedDTerms: string = params['SelectedDTerms']
         console.log(selectedData)
         console.log(selectedDTerms);
         console.log("Receiving SelectedData and SelectedDTerms");

         if (selectedData) {
            let record = new MIRecord();
            console.log(record)
            let dataArray: string[] = selectedData.split(",");
            let key = dataArray[0];
            let key1 = dataArray[2];
            console.log(dataArray)
            let value = dataArray[1];
            let value1 = dataArray[3];
            record[key] = value;
            record[key1] = value1;
            this.selectedOrder = record[key];
            console.log(this.selectedOrder);
            this.selectedRate = record;
            this.selectedType = record[key1];
            console.log(this.selectedType);

         }
      });

   }

   public onOrderDetailsChanged(record: MIRecord) {
      this.selectedOrderDetails = record;
      console.log(this.selectedOrderDetails + '  Order detiled changed');
      if (record && this.selectedOrderDetails) {
         record["ORNO"] = this.selectedOrder;

      }
      this.selectedRate = record;
      console.log(this.selectedRate)

   }

   public onRateChanged(record: MIRecord) {
      // Pass in the delivery method from the order
      if (record && this.selectedOrderDetails) {
         record["ORNO"] = this.selectedOrder;
         this.selectedRate = record;
         console.log(this.selectedRate)
      }


   }

}
