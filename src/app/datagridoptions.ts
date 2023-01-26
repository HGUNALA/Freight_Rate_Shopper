export class DataGridOptions {
   packData: Array<any> = []
   public initDataGridOptions(
      title: string,
      columns: SohoDataGridColumn[],
    ): SohoDataGridOptions {
      const options: SohoDataGridOptions = {
        isList: true,
        clickToSelect: true,
        editable: true,
        filterWhenTyping: true,
        rowNavigation:true,
        cellNavigation:false,
        filterable: false,
        showSelectAllCheckBox: true,
        paging: true,
        pagesize: 5,
        indeterminate: false,
        rowHeight: "normal" as SohoDataGridRowHeight,
        selectable: "single" as SohoDataGridSelectable,
        showDirty: true,
        showFilterTotal: true,
        toolbar: {
          results: true,
          keywordFilter:true,
          collapsibleFilter:true,
          title: title,
          rowHeight:true,
          actions: true,
          personalize:true,
          filterRow:true,
        },
        columns: columns,
        dataset: [],
        emptyMessage: {
          title: "Freight Rates are not available yet",
          icon: "icon-empty-no-data",
          color: "azure"
        },
      };
      return options;
    }

  public packageInitDataGridOptions(
      title: string,
      columns: SohoDataGridColumn[]
    ): SohoDataGridOptions {
      const options: SohoDataGridOptions = {
        isList: true,
        editable: false,
        clickToSelect:false,
        rowNavigation: true,
        cellNavigation:false,
        indeterminate: false,
        showSelectAllCheckBox: true,
        paging:true,
        pagesize:5,
        rowHeight: "normal" as SohoDataGridRowHeight,
        showDirty: true,
        toolbar: {
           results:true,
          rowHeight: true,
          title: title,
          actions: true,
        },
        columns: columns,
        dataset: this.packData,
        emptyMessage: {
          title: "Packages are not available yet.",
          icon: "icon-empty-no-data",
          color: "azure"
        },
      };
      return options;
    }


}

export interface IRootObject {
   RateOwner: string;
   carrierCodes: string[];
   ClientTransaction: IClientTransaction;
   Shipment: IShipment;
   Modes: string[];
   EquipmentTypes: string[];
   TripType: string;
   MovementDirection: string;
   RateType: string;
   ChargeTypes: string[];
   ServiceLevelCode: string;
 }
 export interface IShipment {
   Destination: IDestination;
   Origin: IDestination;
   ShipmentTotalWeight: IShipmentTotalWeight;
   Packages: IPackage[];
   TotalVolume: IShipmentTotalWeight;
   TotalQuantity: IShipmentTotalWeight;
   PickupDateTime: IPickupDateTime;
   Commodities: ICommodity[];
 }

 export interface ICommodity {
   Sequence: number;
   Code: string;
   ClassCode: string;
   Weight: IShipmentTotalWeight;
   Volume: IShipmentTotalWeight;
   Quantity: IShipmentTotalWeight;
 }

 export interface IPickupDateTime {
   Date: string;
   Time: string;
 }

 export interface IPackage {
   PackagingType: IPackagingType;
   Dimensions: IDimensions;
   PackageWeight: IShipmentTotalWeight;
   NumberOfPieces: number;
 }

 export interface IInsuredAmount {
   Currency: string;
   Value: number;
 }

 export interface IDimensions {
   UOM: string;
   Length: number;
   Width: number;
   Height: number;
 }

 export interface IPackagingType {
   Code: string;
 }

 export interface IShipmentTotalWeight {
   UOM: string;
   Value: number;
 }

 export interface IDestination {
   Address: IAddress;
 }

 export interface IAddress {
   AddressLine1: string;
   AddressLine2: string;
   AddressLine3: string;
   City: string;
   StateProvinceCode: string;
   PostalCode: string;
   CountryCode: string;
 }

 export interface IClientTransaction {
   ReferenceNumber: string;
   SourceSystem: string;
 }

 export interface ITmsRequest {
   RateOwner: string;
   carrierCodes: Array<string>;
   ClientTransaction: IClientTrans;
   // RateAPI: IRateAPIRequest;
 }

 export interface IClientTrans {
   ReferenceNumber: string;
   SourceSystem: string;
 }

 export interface ITmsResponse {
   rateRecords: IrateRecords;
   errors:            IAlert[];
 }


 export interface IAlert {
   message: string;
   code:    null | string;
   source:  string;
}
 export interface IrateRecords {
   Message?: string;
   EDD?: IRate[];
   length: number;
 }

 export interface IRate {
    carrierCode:string;
   carrierName: string;
   serviceLevel: string;
   estimatedArrivalDate: Date;
   currencyCode: string;
   totalRatedAmount: string;
   mode: string;
   serviceLevelCode: string;
   equipment: string;
   daysInTransit: number;
   serviceLevelCategory: string;
   Error_Message: string;
 }



export interface IitemNdWeight{
   itemNumber: string;
   weight: number;
}

   export interface TMSandColemanInterface {
       status: number;
       statusText: string;
       message: string;
       name:string;
       title:string;
       error: {
         code:string,
         message:string,
      }
      errors: {
         additionalProp1:string,
         additionalProp2:string,
         additionalProp3:string,
      }

   }
