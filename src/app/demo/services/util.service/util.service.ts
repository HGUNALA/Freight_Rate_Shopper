import { Injectable } from '@angular/core';
import { MIRecord } from '@infor-up/m3-odin';
import { DemoUserContextService } from '../usercontext.service/usercontext.service';

@Injectable({
   providedIn: 'root'
})
export class DemoUtilService {

   // Fields
   amountFields: string[] = ["BIDB", "BRAM", "BRLA", "BUAM", "CEAM", "CDC1", "CDC2", "CDC3", "CEVA", "CUAM", "DIA1", "DIA2", "DIA3", "DIA4", "DIA5", "DIA6", "FEAM", "GRSA", "IPIV", "IVAM", "IVLA", "IVNA", "LNAM", "LNA2", "NEPR", "NTAM", "NTLA", "ONET", "OTDA", "OTDB", "ORVA", "PUPR", "RPIV", "SAPR", "SAAM", "SDIA", "TOTA", "TOAM", "TOPY", "UCOS"];
   dateFields: string[] = ["AGDT", "AMDT", "ATDT", "AVDT", "CODT", "CODZ", "CUDT", "DLDT", "DMDT", "DSDT", "DUDT", "DWDT", "DWDZ", "FDDT", "FUDT", "FVDT", "LEDT", "LMDT", "LRED", "LVDT", "ORDT", "PLDT", "PRDT", "PUDT", "RCDT", "RELD", "RGDT", "RLDT", "RLDZ", "RPDT", "STDT", "TODT", "TRDT", "VDDT"];
   orderLineFields: string[] = ["PONR", "POSX", "PNLI", "PNLS", "PLPS", "PLP2", "RIDL"];
   quantityFields: string[] = ["ADQA", "ADQT", "ALQA", "ALQT", "CAQA", "CAQT", "CFQA", "CFQT", "DLQA", "DLQT", "IVQA", "IVQT", "ORQA", "ORQT", "PLQA", "PLQT", "PPQA", "PPQT", "REQA", "REQT", "RJQA", "RJQT", "RVQA", "RVQT", "SDQA", "SDQT", "TNQA", "TNQT"];

   // Messages
   errorMessages: string[] = ["PP00001"];
   warningMessages: string[] = [""];

   // Edit mode
   editEnabled: boolean;

   constructor(private userContextService: DemoUserContextService) {
   }

   getDuplicateRecord(inRecord: MIRecord): MIRecord {
      let fields: string[];
      let outRecord: MIRecord;

      outRecord = new MIRecord();
      outRecord["CONO"] = this.userContextService.userContext.currentCompany;

      fields = Object.keys(inRecord);
      for (let field of fields) {
         outRecord[field] = inRecord[field];
      }

      return outRecord;
   }

   getTrimmedRecord(inRecord: MIRecord): MIRecord {
      let fields: string[];
      let outRecord: MIRecord;

      outRecord = new MIRecord();
      outRecord["CONO"] = this.userContextService.userContext.currentCompany;

      fields = Object.keys(inRecord);
      for (let field of fields) {
         if (field.length == 6) {
            const shortField = field.substring(2);
            outRecord[shortField] = inRecord[field];
         } else {
            outRecord[field] = inRecord[field];
         }
      }

      return outRecord;
   }

   isAmount(field: string) {
      if (this.amountFields.indexOf(field) >= 0) {
         return true;
      }
      return false;
   }

   isDate(field: string) {
      if (this.dateFields.indexOf(field) >= 0) {
         return true;
      }
      return false;
   }

   isEditEnabled() {
      if (this.editEnabled) {
         return true;
      } else {
         return false;
      }
   }

   isErrorMessage(message: string) {
      if (this.errorMessages.indexOf(message) >= 0) {
         return true;
      }
      return false;
   }

   isOrderLine(field: string) {
      if (this.orderLineFields.indexOf(field) >= 0) {
         return true;
      }
      return false;
   }

   isQuantity(field: string) {
      if (this.quantityFields.indexOf(field) >= 0) {
         return true;
      }
      return false;
   }

   isWarningMessage(message: string) {
      if (this.warningMessages.indexOf(message) >= 0) {
         return true;
      }
      return false;
   }

}
