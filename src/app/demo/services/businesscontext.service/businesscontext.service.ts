import { Injectable } from '@angular/core';
import { UserService, MIService } from '@infor-up/m3-odin-angular';
import { IUserContext, MIRecord, Log, IMIRequest, IMIResponse } from '@infor-up/m3-odin';
import { MIResponse } from '@infor-up/m3-odin/dist/mi/runtime';

@Injectable({
   providedIn: 'root',
})

export class DemoBusinessContextService {

   private userContext: IUserContext;
   private entityRecords: MIRecord[] = [];

   constructor(private userService: UserService, private miService: MIService) {
      this.userService.getUserContext().subscribe((userContext: IUserContext) => {
         this.userContext = userContext;
      });

      let record: MIRecord = new MIRecord();
      record["ISEC"] = "";

      const request: IMIRequest = {
         includeMetadata: true,
         program: "MNS035MI",
         transaction: "LstByEntity",
         record: record,
         maxReturnedRecords: 999,
         typedOutput: true
      };

      this.miService.execute(request).subscribe((response: IMIResponse) => {
         if (!response.hasError()) {
            this.entityRecords = response.items;
         }
      }, (_error: MIResponse) => {
         // Do nothing for now
      });


   }

   private getContextEntities(record: MIRecord): any[] {
      let contextEntities: IContextEntity[] = [];
      const cono = this.userContext.currentCompany;
      const divi = this.userContext.currentDivision;

      // Get record fields
      const fields: string[] = Object.keys(record);

      // Loop through all fields of the record
      for (let field of fields) {
         // Check against the entities
         for (let entityRecord of this.entityRecords) {
            if (field == entityRecord["FLDI"]) {
               const entityType: string = entityRecord["ISEC"];
               const seqnr: number = entityRecord["SQNR"];
               let contextEntity: IContextEntity;

               // Check for existing accounting entity
               contextEntity = contextEntities.find(e => e.entityType === entityType);

               // ContextEntity exist
               if (contextEntity) {
                  contextEntity["id" + seqnr] = record[field];
               } else {
                  // Create new
                  contextEntity = {
                     accountingEntity: cono + "_" + divi,
                     entityType: entityType,
                     visible: true,
                     drillbackURL: ""
                  }
                  contextEntity["id" + seqnr] = record[field];
                  contextEntities.push(contextEntity);
               }
            }
         }

      }
      // Return all entities where we have an id1 present
      return contextEntities.filter((entity) => { return entity.id1 !== undefined });
   }

   triggerContext(record: MIRecord) {
      try {
         const type = 'inforBusinessContext';
         const data = {
            "screenId": 'm3_mashup',
            "program": "MASHUP",
            "entities": this.getContextEntities(record)
         };
         window.parent['infor'].companyon.client.sendMessage(type, data);
      } catch (err) {
         Log.error(err);
      }
   }

}

export interface IContextEntity {
   accountingEntity: string,
   entityType: string,
   id1?: string,
   id2?: string,
   id3?: string,
   id4?: string,
   id5?: string,
   id6?: string,
   visible?: boolean,
   drillbackURL?: string
}
