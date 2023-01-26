import {
  Component,
  ViewEncapsulation,
  Input,
  SimpleChanges,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  MIRecord,
  CoreBase,
  HttpUtil,
  IIonApiRequest,
  IIonApiResponse,
  IMIResponse,
  IMIRequest,
  ArrayUtil,
} from "@infor-up/m3-odin";
import {
  MIService,
  IonApiService,
  FormService,
} from "@infor-up/m3-odin-angular";
import { MIResponse } from "@infor-up/m3-odin/dist/mi/runtime";
import {
  SohoMessageService,
  SohoDataGridComponent,
  SohoToastService,
} from "ids-enterprise-ng";
import { tap } from "rxjs/operators";
import {
  DataGridOptions,
  IitemNdWeight,
  IRate,
  IRootObject,
  ITmsResponse,
  TMSandColemanInterface,
} from "src/app/datagridoptions";
import { DemoUserContextService } from "src/app/demo/services/usercontext.service/usercontext.service";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "rate-list",
  styleUrls: ["./rate-list.component.css"],
  templateUrl: "./rate-list.component.html",
})
export class RateListComponent extends CoreBase {
  @Input() selectedParentRecord: MIRecord;
  @Input() selectedParentTransportType: MIRecord;
  @Input() address: MIRecord;
  @Input() initialRecord: MIRecord;

  /**
   *    Value that can be set at startup (for example default user warehouse)
   */
  @Input() initialValue: string;
  @Output() orderDetailsChanged = new EventEmitter<MIRecord>();
  @ViewChild(SohoDataGridComponent) datagrid: SohoDataGridComponent;
  @Output() recordChanged: EventEmitter<MIRecord> =
    new EventEmitter<MIRecord>();
  @Input()
  roundRules = "1.0-3";
  packageTypeCode: string;
  isLoading: boolean = true;
  packageGrid: boolean;
  field: string;
  additionalInfoField: string;
  FreightLoading: string;
  columns: SohoDataGridColumn[] = [];
  packageColumns: SohoDataGridColumn[] = [];
  pkgCodeWgt: string[] = [];
  datagridOptions: SohoDataGridOptions;
  packageDatagridOptions: SohoDataGridOptions;
  equipmentType: string[] = ["*"];
  output: Array<string> = [];
  selectedRecord: MIRecord;
  markUpFactor: number;
  deliveryDate: any;
  customerName: string;
  orderNumber: string;
  shipmentTotalWeight: number;
  customerNumber: any;
  OrderNumber: any;
  orderQuantity: Array<number> = [];
  totalWeight: number = 0;
  record: MIRecord;

  mod1 = {
    modId: "",
    modName: "",
  };
  carriers: string[] = [];
  modes: string[] = [];
  packagesCountForUI: number;
  records: MIRecord[] = [];
  m3ChargeResponse: IMIResponse;
  private serviceUrl = "TM/public/cre/shoprates/v1";
  private readonly developmentToken =
    "eyJraWQiOiJrZzpjMTdjMzVkMC04NWU0LTQ5ZDItODc5Yi0yMWQ2Mjg1MmUxMzUiLCJhbGciOiJSUzI1NiJ9.eyJJZGVudGl0eTIiOiJhZTJkZmM0Yi02NDRiLTRjZTctYjc0OC1hNmQ0ODA4YzNkMDciLCJFbmZvcmNlU2NvcGVzRm9yQ2xpZW50IjoiMCIsImlzcyI6Imh0dHBzOi8vbWluZ2xlLWNxYS1zc28uY3FhLmluZm9yY2xvdWRzdWl0ZS5jb20vaW5mb3JzdHMiLCJJbmZvclNUU0lzc3VlZFR5cGUiOiJBUyIsImNsaWVudF9pZCI6ImluZm9yfmh5emZPeVhQdVFEX0xUR1pmdDVBajdkb0lvazFEQmk3VlYybGttMk4zOThfT0lEQyIsImF1ZCI6Imh0dHBzOi8vbWluZ2xlLWNxYS1pb25hcGkuY3FhLmluZm9yY2xvdWRzdWl0ZS5jb20iLCJUZW5hbnQiOiJNM0NFREVWQVBQQUlTX0RFViIsIm5iZiI6MTY2NzM3NTYzMiwic2NvcGUiOm51bGwsImdyYW50X2lkIjoiYWI5MmZhYmItM2NlYy00NTAwLWE0MTktYWQ1YmQxYzZlZjQ3IiwiZXhwIjoxNjY3MzgyODMyLCJpYXQiOjE2NjczNzU2MzIsImp0aSI6ImEyNjgxM2Y3LTVlNDktNGQ1Yi1iNmY5LTA3NmJlYmFjYjE4MSJ9.skDSb61WXu78UAgiZHmA_7xbvv5U6BkOrraLNo1dnIdrCM7FvzOpTAhWmXqGzBBjc457moJQQMgzrXUlaGgt1sor6hT4HzT5GAU9hm8eDopbsadoJs8WLsBlqbyiuMQRh4PUCGntfBJP7W7csbWEkZfYAyxEo4lmw3dOFpA6l0JTNd_aEpVdNp5FM8WhRuKdB-R-puugtCRlSYECSoMGXCB4iKy8eJSIaEpekeWiNfnSAuW7BtATOHPNjWmk44LT9F5cI6vZUxP9CnjYseUuHZ_ab-tvqoY8QMxigs9X9_xEdfqOSqKYrnPQzOjaqb_mPoHuoraq8pWRvBGJhLF0LQ";
  sourceAddressResponse: MIRecord[] = [];
  destinationAddressResponse: MIRecord[] = [];
  commodityCode: Array<string> = [];
  classCode: Array<string> = [];
  comVolume: Array<number> = [];
  comWeight: Array<number> = [];
  mode: string[];
  packagetype: Array<string> = [];
  m3Charge: boolean;
  itemNumberLst: Array<string> = [];
  itemNumber: any;
  wareHouse: number;
  tenant: string;
  itemNumberLen: any;
  itemNumberCount: any;
  comClaCount: number;
  selectedCharge: MIRecord;
  m3Freight: any = 0;
  chargeType: Array<string> = [];
  totalOrderQunatity: number = 0;
  packagetypeList: Array<any> = [];
  packageLength: Array<any> = [];
  packageWidth: Array<any> = [];
  packageHeight: Array<any> = [];
  packageNo: Array<number> = [];
  packageWeight: Array<number> = [];
  packageTypeCount: number;
  packLength: any = 0;
  packageStore: Array<any> = [];
  tenantUrl: string;
  smallParcel: any;
  tmsRates: boolean;
  totalvolume: any = 0.0;
  quantityUOM: any;
  packageDrpDwnCount: number;
  PackageMessage: boolean;
  modeDisable: boolean;
  m3CurrecyCode: any;
  packageTypeName: Array<string> = [];
  packageTypeNameCount: number = 0;
  packageTypeDisable: boolean = true;

  WeightUnit: any;
  VolumeUnit: any;
  DimensionUnit: any;
  deliveryMethod: any;
  delMtdWareHouse: any;
  chargeChanged: any;
  m3ChargeCheck: boolean;
  m3SingleCharge: boolean;
  pckRwSlctIndex: number;
  uniquePakTypes: any[] = [];
  uniquePakDimension: any[] = [];
  quantityJsonArray: Iquantity[] = [];
  itemNdWeightList: IitemNdWeight[] = [];
  loadingText: string = "Loading the Order information";
  pickUpDate: any;
  dateFormat: string = "dd/MM/yyyy";
  daysInTransit: string;
  TmsRequest: IRootObject;
  departureDate: any;
  departureTime: void;
  dDate: any;
  departureDate1: any;
  colemanCarrier: string;
  carrier1: any;
  carrierDisable: boolean;
  deliveryTerms: any;
  totalvolumeLTL: any = 0.0;
  pkgWght: any[] = [];
  pkgWghtIndex: number;
  placeLoading: any;
  pkgTypeCode: string;
  pkgCalling: boolean = true;
  uniquePakTypesCount: any = 0;
  shipmentTWt: string;
  constructor(
    private ionApiService: IonApiService,
    protected messageService: SohoMessageService,
    private toastService: SohoToastService,
    protected miService: MIService,
    private formService: FormService,
    private userContextService: DemoUserContextService,
    private dgOptions: DataGridOptions
  ) {
    super("RateListComponent");
    this.formService
      .getEnvironmentContext()
      .pipe(
        tap((context) => {
          this.tenantUrl = context.ionApiUrl;
        })
      )
      .subscribe();
    if (HttpUtil.isLocalhost()) {
      this.ionApiService.setDevelopmentToken(this.developmentToken);
    }
  }
  ngOnInit(): void {
    this.pckRwSlctIndex = 0;
    this.initColumns();
    this.initPackageColumns();
    this.init();
    this.colemanCarrier = "*";
  }

  protected init() {
    this.datagridOptions = this.dgOptions.initDataGridOptions(
      "Freight-Rate Results",
      this.columns
    );
    this.datagridOptions = { ...this.datagridOptions };
  }
  protected initColumns() {
    this.columns = [
      {
        width: 70,
        id: "selectionCheckbox",
        field: "",
        name: "",
        sortable: false,
        resizable: false,
        align: "center",
        headerAlign: "center",
        formatter: Soho.Formatters.SelectionCheckbox,
      },
      {
        width: "auto",
        id: "col-Carrier-Name",
        field: "CARR",
        name: "Carrier Name",
        resizable: false,
        sortable: true,
        formatter: Soho.Formatters.Text,
        filterType: "text",
      },
      {
        width: 200,
        id: "col-Service-Description",
        field: "SUFI",
        name: "Service Description",
        resizable: true,
        sortable: true,

        filterType: "text",
        formatter: Soho.Formatters.Text,
      },
      {
        width: "auto",
        id: "col-Total-Rated-Amount",
        field: "FRET",
        name: "Freight Amount",
        align: "right",
        headerAlign: "right",
        resizable: false,
        sortable: true,
        formatter: Soho.Formatters.Decimal,
        filterType: "decimal",
        filterConditions: [
          "greater-equals",
          "less-equals",
          "greater-than",
          "equals",
          "does-not-equal",
          "is-empty",
          "is-not-empty",
          "in-range",
        ],
      },
      {
        width: "auto",
        id: "col-Currency",
        field: "CRCY",
        name: "Currency",
        sortable: true,
        formatter: Soho.Formatters.Text,
        filterType: "text",
        resizable: false,
      },
      {
        width: 180,
        id: "col-date",
        field: "DLDT",
        name: "Estimated Arrival Date",
        sortable: true,
        formatter: Soho.Formatters.Date,
        filterType: "date",
        dateFormat: this.dateFormat,
        resizable: false,
        dateShowFormat: this.dateFormat,
        filterConditions: [
          "greater-equals",
          "less-equals",
          "greater-than",
          "equals",
          "does-not-equal",
          "is-empty",
          "is-not-empty",
          "in-range",
        ],
      },
      {
        width: "auto",
        id: "col-Days-In-Transit",
        field: "DITS",
        name: "Days In Transit",
        align: "right",
        headerAlign: "right",
        sortable: true,
        resizable: false,
        formatter: Soho.Formatters.Integer,
        filterType: "integer",
        filterConditions: [
          "greater-equals",
          "less-equals",
          "greater-than",
          "equals",
          "does-not-equal",
          "is-empty",
          "is-not-empty",
          "in-range",
        ],
      },
      {
        width: "auto",
        id: "col-Mode",
        field: "MODE",
        name: "Mode",
        sortable: true,
        formatter: Soho.Formatters.Text,
        filterType: "text",
        resizable: false,
      },
      {
        width: "auto",
        id: "col-Service-Level-Code",
        field: "SLCD",
        name: "Service Code",
        sortable: true,
        align: "left",
        headerAlign: "left",
        formatter: Soho.Formatters.Text,
        filterType: "text",
        resizable: false,
      },
    ];
  }
  initPackageColumns() {
    this.packageColumns = [
      {
        width: 70,
        id: "",
        field: "PASN",
        name: "S.No",
        sortable: false,
        resizable: false,
        formatter: Soho.Formatters.Readonly,
      },
      {
        width: 200,
        id: "col-Package-Type",
        field: "PTYPE",
        name: "Package Type",
        formatter: Soho.Formatters.Readonly,
      },
      {
        width: "auto",
        id: "col-length",
        field: "LNTH",
        name: "Length",
        headerAlign: "right",
        align: "right",
        formatter: Soho.Formatters.Readonly,
      },
      {
        width: "auto",
        id: "col-width",
        field: "WDTH",
        name: "Width",
        headerAlign: "right",
        align: "right",
        formatter: Soho.Formatters.Readonly,
      },
      {
        width: "auto",
        id: "col-Height",
        field: "HGHT",
        name: "Height",
        headerAlign: "right",
        align: "right",
        formatter: Soho.Formatters.Readonly,
      },
      {
        width: 220,
        id: "col-Number-of-Packages",
        field: "NPGS",
        name: "Number of Pieces",
        inputType: "number",
        align: "right",
        formatter: Soho.Formatters.Readonly,
        headerAlign: "right",
      },
      {
        width: "auto",
        id: "col-Height",
        field: "VOLM",
        name: "Volume",
        headerAlign: "right",
        align: "right",
        formatter: Soho.Formatters.Readonly,
      },
      {
        width: "auto",
        id: "col-Weight",
        field: "WGHT",
        name: "Weight",
        headerAlign: "right",
        align: "right",
        formatter: Soho.Formatters.Readonly,
      },
    ];
  }

  onMode() {
    console.log(this.mod1);
    this.shipmentTotalWeight = parseFloat(this.totalWeight.toFixed(3));
    this.shipmentTWt = this.totalWeight.toFixed(3);
    this.datagrid.dataset = [];
    this.packageGrid = false;
    this.dgOptions.packData = [];
    this.uniquePakDimension = [];
    this.datagridOptions = { ...this.datagridOptions };
    this.packageTypeCount = 0;
    if (this.mod1["DRTRCA"]) {
      this.isLoading = true;
      this.carriers = [];
      if (this.mod1["DRTRCA"] != "ALL") {
        this.getCarriers();
        this.carrierDisable = false;
      } else {
        this.carrierDisable = true;
        // Calling FACETMI to get the list count
        this.getCarrierCount();
      }
      this.tmsRates = true;
      this.loadingText = "Loading the Carrier information...";
      if (this.mod1["DRTRCA"] === "SPC" || this.mod1["DRTRCA"] === "ALL") {
        this.packageTypeDisable = false;
      } else {
        this.packageTypeDisable = true;
      }
    } else {
      this.carrierDisable = true;
      this.tmsRates = true;
      this.packageGrid = false;
    }
  }
  onCarrier() {
    this.shipmentTotalWeight = parseFloat(this.totalWeight.toFixed(3));
    this.shipmentTWt = this.totalWeight.toFixed(3);
    this.dgOptions.packData = [];
    this.packageGrid = false;
    this.datagrid.dataset = [];
    if (this.carrier1 || this.carrier1["DRFWNO"]) {
      this.getCarrierCount();
      this.tmsRates = false;
      this.modeDisable = true;
    } else {
      this.packageTypeDisable = true;
      this.tmsRates = true;
      this.modeDisable = false;
    }
  }
  onClose() {
    this.packageGrid = false;
  }
  onChange() {
    this.recordChanged.emit(this.record);
    this.chargeChanged = this.record;
  }
  private onChargeResponse(response: IMIResponse) {
    this.records = response.items;
    let chargeCount = 0;
    for (let index = 0; index < this.records.length; index++) {
      if (
        response.items[index].CRID === "TMS-I" ||
        response.items[index].CRID === "TMS-E"
      ) {
        chargeCount++;
      }
    }

    if (this.records.length === 0 || chargeCount != 2) {
      this.onError(
        "TMS-I,TMS-E M3 charge(s) is/are  not available in the OIS103 program. Create those charge(s) to proceed further",
        "M3 Charges"
      );
      this.m3ChargeCheck = true;
      this.modeDisable = true;
    } else {
      this.m3ChargeCheck = true;
      this.record = this.records[0];
      this.chargeChanged = "TMS-I";
    }
    this.field = "CRID";
    this.additionalInfoField = "CRD0";
    if (this.initialRecord) {
      if (
        ArrayUtil.containsByProperty(
          this.records,
          this.field,
          this.initialRecord[this.field]
        )
      ) {
        this.record = ArrayUtil.itemByProperty(
          this.records,
          this.field,
          this.initialRecord[this.field]
        );
      }
    }
    if (this.initialValue) {
      if (
        ArrayUtil.containsByProperty(
          this.records,
          this.field,
          this.initialValue
        )
      ) {
        this.record = ArrayUtil.itemByProperty(
          this.records,
          this.field,
          this.initialValue
        );
      }
    }
  }
  onCallTMS() {
    this.packageGrid = false;
    this.datagrid.dataset = [];
    this.loadingText = "Please wait.. Freight Rates are generating";
    this.getRates();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedParentRecord) {
      if (this.selectedParentRecord) {
        this.getUnits();
        this.getOrderDetails();
        this.getDepDate1();
        this.carrierDisable = true;
        this.tmsRates = true;
      }
    }
  }
  getOrderDetails() {
    let record: MIRecord = new MIRecord();
    record["ORNO"] = this.selectedParentRecord;
    this.output = ["CUNO", "WHLO"];
    this.orderNumber = record["ORNO"];
    this.callApi(record, "OIS100MI", "GetHead", this.output);
  }
  getCharges() {
    let record: MIRecord = new MIRecord();
    record["ORNO"] = this.orderNumber;
    this.output = ["CRID", "CRD0"];
    this.callApi(record, "OIS100MI", "LstConnCOCharge", this.output);
  }
  getCarrierCount() {
    let record: MIRecord = new MIRecord();
    record["FNAM"] = "MITVEN";
    if (this.mod1["DRTRCA"] === "ALL") {
      this.colemanCarrier = "ALL";
    } else if (this.mod1["DRTRCA"] === "SPC" || this.mod1["DRTRCA"] === "LTL") {
      if (this.carrier1 != "Select All") {
        this.colemanCarrier = this.carrier1["DRFWNO"];
      } else {
        this.colemanCarrier = this.mod1["DRTRCA"];
      }
    }
    record["SQRY"] = "SUNO:" + this.colemanCarrier;
    this.output = ["TX30", "TX60"];
    this.callApi(record, "FACETMI", "LstFacets", this.output);
  }
  getDestinationAddress() {
    let record: MIRecord = new MIRecord();
    record["ORNO"] = this.orderNumber;
    record["ADRT"] = "01";
    this.output = [
      "CUNM",
      "CUA1",
      "CUA2",
      "CUA3",
      "CUA4",
      "TOWN",
      "PONO",
      "ECAR",
      "CSCD",
    ];
    this.callApi(record, "OIS100MI", "GetAddress", this.output);
    this.getOrderLines();
  }
  getOrderLines() {
    let record: MIRecord = new MIRecord();
    record["ORNO"] = this.selectedParentRecord;
    this.output = ["ITNO", "ALUN", "WHLO", "ORQA"];
    this.callApi(record, "OIS100MI", "LstCOLineInfo", this.output);
  }
  getItmBasic(itemNumber: any) {
    let record: MIRecord = new MIRecord();
    record["ITNO"] = itemNumber;
    this.output = ["GRWE", "VOL3"];
    this.callApi(record, "MMS200MI", "GetItmBasic", this.output);
  }
  getItem(itemNumber: any) {
    let record: MIRecord = new MIRecord();
    record["ITNO"] = itemNumber;
    this.output = ["CMMC", "CMCL", "HAZM"];
    this.callApi(record, "MWS001MI", "GetItem", this.output);
  }
  getModes() {
    let record: MIRecord = new MIRecord();
    record["DRTSID"] = "TMS";
    record["DRSDES"] = this.placeLoading;
    this.isLoading = true;
    this.output = ["DRTRCA", "DCTX40"];
    this.callApi(record, "CMS100MI", "LstInforTMMode");
  }
  getWhPlaceHolder() {
    let record: MIRecord = new MIRecord();
    record["WHLO"] = this.delMtdWareHouse;
    this.isLoading = true;
    this.output = ["SDES"];
    this.callApi(record, "MMS005MI", "GetWarehouse");
  }
  getCarriers() {
    let record: MIRecord = new MIRecord();
    record["DRTRCA"] = this.mod1["DRTRCA"];
    record["DRTSID"] = this.mod1["DRTSID"];
    record["DRSDES"] = this.placeLoading;
    this.output = ["DRFWNO", "IDSUNM"];
    this.callApi(record, "CMS100MI", "LstInforTMCarri");
  }
  getSourceAddress() {
    let record: MIRecord = new MIRecord();
    record["ADTH"] = "1";
    record["ADK2"] = this.delMtdWareHouse;
    this.output = [
      "ADR1",
      "ADR2",
      "ADR3",
      "ADR4",
      "TOWN",
      "PONO",
      "ECAR",
      "CSCD",
    ];
    this.callApi(record, "CRS235MI", "Get", this.output);
  }
  getDepDate1() {
    let record: MIRecord = new MIRecord();
    record["OBORNO"] = this.selectedParentRecord;
    this.callApi(record, "CMS100MI", "LstLastCOLiDate");
  }
  getUnits() {
    let record: MIRecord = new MIRecord();
    record["CONO"] = "";
    this.output = ["WEUN", "VOUN", "LEUN"];
    this.callApi(record, "CRS175MI", "GetItemFreeFlds", this.output);
  }
  getPkgInfoFrmCmn() {
    this.isLoading = true;
    this.loadingText = "Loading the package information...";
    this.packageGrid = true;
    this.pkgCodeWgt = [];
    this.packagesCountForUI = 0;
    this.uniquePakDimension = [];
    this.packageTypeDisable = true;
    let itemNumberCount = 0,
      itemNumberString = "",
      lineQuantityString = "";
    this.packageDatagridOptions = this.dgOptions.packageInitDataGridOptions(
      "Package Details",
      this.packageColumns
    );
    while (itemNumberCount < this.itemNumberLst.length) {
      itemNumberString =
        itemNumberString + ":" + this.itemNumberLst[itemNumberCount];
      lineQuantityString =
        lineQuantityString + ":" + this.orderQuantity[itemNumberCount];
      itemNumberCount++;
    }
    itemNumberString = itemNumberString.slice(1);
    lineQuantityString = lineQuantityString.slice(1);
    let carrier = "";
    if (this.mod1["DRTRCA"] === "ALL") {
      carrier = "ALL";
    } else if (this.carrier1 != "Select All") {
      carrier = this.carrier1["DRFWNO"];
    } else {
      carrier = this.mod1["DRTRCA"];
    }
    const request: IIonApiRequest = {
      method: "POST",
      url: "COLEMANAI/aiplatform/v1/endpoints/binpack_endpoint/detailed-prediction",
      headers: {
        Accept: "application/json",
      },
      body: [
        {
          Shipment: this.orderNumber,
          ItemNumber: itemNumberString,
          Quantity: lineQuantityString,
          ordernum_linenum: 1,
          Carrier: carrier,
        },
      ],
      source: "Coleman_Packages",
    };
    console.log("Coleman Request is:");
    console.log(request);

    this.onCallIonApi(request);
  }
  getPackageTypeInfo(packageTypeCode: string) {
    let record: MIRecord = new MIRecord();
    record["PACT"] = packageTypeCode;
    this.output = [
      "PACT",
      "PACL",
      "PACW",
      "PACH",
      "WEIG",
      "PANM",
      "VOMT",
      "VOM3",
    ];
    this.callApi(record, "MMS050MI", "GetPackaging", this.output);
    this.isLoading = true;
  }
  getDeliveryMethod() {
    let record: MIRecord = new MIRecord();
    record["TRQF"] = "0"; // Table or file
    record["MSTD"] = "ION"; // Msg std
    record["MVRS"] = "1"; // Category Mapping Code(ServiceLevelCategory)
    record["BMSG"] = "Generic"; // Business Message
    record["IBOB"] = "I"; // Inbound or Outbound
    record["ELMP"] = "Generic"; //  Parent element(s)
    record["ELMD"] = "TransportationMethodCode";
    if (this.selectedRecord["SLCD"].toLowerCase() != "standard") {
      record["MBMD"] = this.selectedRecord["SLCD"];
    } else {
      record["MBMD"] = this.selectedRecord["CACD"];
    }
    this.output = ["MVXD"];
    this.callApi(record, "CRS881MI", "GetTranslData", this.output);
  }

  public onCreateCharge() {
    this.loadingText = "Selected Freight Rate is updating.. Please wait";
    this.isLoading = true;
    this.onConformation();
  }
  public onConformation() {
    this.getDeliveryMethod();
  }

  public m3ChargeUpdate() {
    if (this.selectedRecord) {
      let record: MIRecord;
      let request: IMIRequest;
      record = new MIRecord();
      record["ORNO"] = this.selectedParentRecord;
      record["CRID"] = this.chargeChanged;
      record["CRAM"] = this.m3Freight;
      request = {
        program: "OIS100MI",
        transaction: "UpdConnCOCharge",
        record: record,
      };
      this.callApi(
        request.record,
        request.program,
        request.transaction,
        this.output
      );
    } else {
      this.onError(
        "Please select the Total Amount Rated row to create charge",
        "Selection Required"
      );
      this.isLoading = false;
    }
  }
  public onChargeChanged(record: MIRecord) {
    this.selectedCharge = record;
  }
  public enableConfirm(message: string) {
    const buttons = [
      {
        text: "Yes",
        click: (_e, modal) => {
          modal.close();
          this.onConformation();
        },
      },
      {
        text: "No",
        click: (_e, modal) => {
          modal.close();
          this.isLoading = false;
        },
      },
    ];
    this.messageService
      .confirm()
      .title("Confirmation on mark up factor")
      .message(message)
      .buttons(buttons)
      .open();
  }

  dateConcatTms(dateF: Date) {
    let finalDate;
    let year = dateF.getFullYear().toString();
    let month = (dateF.getMonth() + 1).toString();
    let mont = month;
    let date = dateF.getDate().toString();
    let dat = date;
    if (month.length === 1) month = "0" + mont;
    else month = mont;
    if (date.length === 1) date = "0" + dat;
    else date = dat;
    finalDate = year + "/" + month + "/" + date;
    return finalDate;
  }

  dateConcat(dateF: Date) {
    let finalDate;
    let year = dateF.getFullYear().toString();
    let month = (dateF.getMonth() + 1).toString();
    let mont = month;
    let date = dateF.getDate().toString();
    let dat = date;
    if (month.length === 1) month = "0" + mont;
    else month = mont;
    if (date.length === 1) date = "0" + dat;
    else date = dat;
    finalDate = this.estimateArrivalDateFormat(year, month, date);
    return finalDate;
  }
  estimateArrivalDateFormat(year: string, month: string, date: string) {
    let fDate: string;
    switch (this.userContextService.userContext["DTFM"]) {
      case "YMD": {
        fDate = year + "/" + month + "/" + date;
        this.dateFormat = "yyyy/MM/dd";
        break;
      }
      case "DMY": {
        fDate = date + "/" + month + "/" + year;
        this.dateFormat = "dd/MM/yyyy";
        break;
      }
      case "MDY": {
        fDate = month + "/" + date + "/" + year;
        this.dateFormat = "MM/dd/yyyy";
      }
    }
    this.datagridOptions.columns[5].dateFormat = this.dateFormat;
    this.datagridOptions.columns[5].dateShowFormat = this.dateFormat;
    return fDate;
  }

  callApi(
    record?: MIRecord,
    program?: string,
    transaction?: string,
    outputFields?: string[]
  ) {
    const request: IMIRequest = {
      includeMetadata: true,
      program: program,
      transaction: transaction,
      record: record,
      outputFields: outputFields,
      maxReturnedRecords: 100,
      typedOutput: true,
    };
    this.miService.execute(request).subscribe(
      (response) => {
        if (!response.items.length) {
          if (request.transaction !== "LstFacets") {
            this.onError(
              "No response is available for repective " +
                request.program +
                " program and " +
                request.transaction +
                " transaction",
              "MI Programs Response Validation"
            );
            this.isLoading = false;
            this.modeDisable = true;
          }
        } else {
          this.firstMICheck(response, request);
        }
      },
      (error: MIResponse) => {
        if (error.errorCode != "XRE0103") {
          this.onError(
            error.errorMessage +
              " on the " +
              request.program.slice(0, 6) +
              " program. Please Configure the data accordingly to get this " +
              request.outputFields +
              " field values",
            "Data Validation"
          );
          this.modeDisable = true;
          this.packageTypeDisable = true;
        } else {
          this.modeDisable = false;
          this.packageTypeDisable = false;
        }
        this.isLoading = false;
      }
    );
  }

  public firstMICheck(response: IMIResponse, _request: IMIRequest) {
    if (response.program === "OIS100MI" && response.transaction === "GetHead") {
      this.output = [];
      this.customerNumber = response.item["CUNO"];
      this.delMtdWareHouse = response.item["WHLO"];
      this.getWhPlaceHolder();
      this.deliveryTerms = this.selectedParentTransportType;
      this.datagridOptions = this.dgOptions.initDataGridOptions(
        "Freight Rate Details",
        this.columns
      );
    } else if (
      response.program === "OIS100MI" &&
      response.transaction === "GetAddress"
    ) {
      this.output = [];
      this.destinationAddressResponse = response.item;
      this.customerName = response.item["CUNM"];
    } else if (response.transaction === "LstInforTMMode") {
      this.modes = response.items;
      this.getCharges();
      this.getSourceAddress();
    } else if (response.transaction === "LstInforTMCarri") {
      this.carrierResponse(response);
    } else if (response.transaction === "GetWarehouse") {
      this.placeLoading = response.item["SDES"];
      this.getModes();
    } else if (response.transaction === "LstLastCOLiDate") {
      this.departureDate = this.dateConcatTms(response.item["OBPLDT"]);
      this.departureDate1 = this.dateConcat(response.item["OBPLDT"]);
      this.getDestinationAddress();
      this.requestDateCheck(this.departureDate1);
    } else {
      this.remainingMICheck(response);
    }
  }

  public carrierResponse(response: IMIResponse) {
    this.carriers = response.items;
    this.isLoading = false;
  }

  public remainingMICheck(response: IMIResponse) {
    if (
      response.program === "OIS100MI" &&
      response.transaction === "LstCOLineInfo"
    ) {
      this.output = [];
      this.itemNumberLen = response.items.length;
      this.quantityUOM = response.item["ALUN"];
      this.itemNumberCount = 1;
      this.itemNumberLst[0] = response.item["ITNO"];
      if (
        !(
          parseInt(this.itemNumberLst[0]) >= 20000100 &&
          parseInt(this.itemNumberLst[0]) <= 20000117
        )
      ) {
        this.onError(
          "Please make sure that associated items for this order number should be in the range of 20000100 to 20000117",
          "Item Validation"
        );
      }
      this.orderQuantity[0] = response.item["ORQA"];
      this.totalOrderQunatity = this.orderQuantity[0];
      this.getItmBasic(this.itemNumberLst[0]);
      for (let index = 1; index < response.items.length; index++) {
        this.itemNumberLst[index] = response.items[index].ITNO;
        if (
          !(
            parseInt(this.itemNumberLst[index]) >= 20000100 &&
            parseInt(this.itemNumberLst[index]) <= 20000117
          )
        ) {
          this.onError(
            "Please make sure that associated items for this order number should be in the range of 20000100 to 20000117",
            "Item Validation"
          );
        }

        this.orderQuantity[index] = response.items[index].ORQA;
        this.totalOrderQunatity =
          this.totalOrderQunatity + this.orderQuantity[index];
      }
    } else if (response.program === "CRS235MI") {
      this.output = [];
      this.sourceAddressResponse = response.item;
    } else if (response.program === "FACETMI") {
      this.sendColemanCarriers(response);
    } else {
      this.remainingMICheck1(response);
    }
  }

  public remainingMICheck1(response: IMIResponse) {
    if (response.transaction === "GetItemFreeFlds") {
      this.WeightUnit = response.item.WEUN;
      this.VolumeUnit = response.item.VOUN;
      this.DimensionUnit = response.item.LEUN;
    } else if (
      response.program === "MMS200MI" &&
      response.transaction === "GetItmBasic"
    ) {
      this.output = [];
      if (this.itemNumberCount === this.itemNumberLen) {
        this.comVolume[this.itemNumberLen - 1] = response.item.VOL3;
        this.comWeight[this.itemNumberLen - 1] = response.item.GRWE;
        this.totalWeight +=
          this.comWeight[this.itemNumberLen - 1] *
          this.orderQuantity[this.itemNumberLen - 1];
        this.totalvolumeLTL =
          this.totalvolumeLTL +
          this.comVolume[this.itemNumberLen - 1] *
            this.orderQuantity[this.itemNumberLen - 1];
        let i = 0;
        while (i < this.itemNumberCount) {
          this.itemNdWeightList.push({
            itemNumber: this.itemNumberLst[i],
            weight: this.comWeight[i],
          });
          i++;
        }
        this.getItem(this.itemNumberLst[0]);
        this.itemNumberCount = 1;
        this.comClaCount = 0;
        let check = this.tenantUrl;
        let index = check.indexOf("com/");
        this.tenant = check.substring(index + 4);
      } else {
        let i = this.itemNumberCount;
        this.comWeight[i - 1] = response.item.GRWE;
        this.comVolume[i - 1] = response.item.VOL3;
        this.totalWeight =
          this.totalWeight + this.comWeight[i - 1] * this.orderQuantity[i - 1];
        this.totalvolumeLTL =
          this.totalvolumeLTL +
          this.comVolume[i - 1] * this.orderQuantity[this.itemNumberLen - 1];
        this.getItmBasic(this.itemNumberLst[i]);
        this.itemNumberCount++;
      }
    } else {
      this.remainingMICheck2(response);
    }
  }

  public remainingMICheck2(response: IMIResponse) {
    if (response.transaction === "GetItem") {
      this.output = [];
      this.commodityCode[this.comClaCount] = response.item["CMMC"];
      this.classCode[this.comClaCount] = response.item["CMCL"];
      if (response.item["HAZM"] === 1) {
        this.chargeType[this.comClaCount] = "HZ";
      } else {
        this.chargeType[this.comClaCount] = "";
      }

      if (this.itemNumberLen > this.itemNumberCount) {
        let i = this.itemNumberCount;
        this.getItem(this.itemNumberLst[i]);
        this.itemNumberCount++;
        this.comClaCount++;
      } else {
        this.shipmentTotalWeight = parseFloat(this.totalWeight.toPrecision(6));
        this.shipmentTWt = this.totalWeight.toFixed(3);
        this.isLoading = false;
      }
    } else if (response.program === "CRS620MI") {
      this.output = [];
      this.carriers = response.items;
    } else {
      this.remainingMICheck3(response);
    }
  }

  public remainingMICheck3(response: IMIResponse) {
    if (response.program === "MMS050MI") {
      this.output = [];
      this.uniquePakDimension.push(response.item);
      let record: MIRecord = new MIRecord();

      record["PASN"] = this.packagesCountForUI + 1;
      if (
        this.quantityJsonArray[this.packagesCountForUI].packType.slice(0, 1) ===
          "Y" ||
        this.quantityJsonArray[this.packagesCountForUI].packType.slice(0, 1) ===
          "P"
      ) {
        record["PTYPE"] = this.quantityJsonArray[
          this.packagesCountForUI
        ].packType.slice(0, 6);
      } else {
        record["PTYPE"] = this.quantityJsonArray[
          this.packagesCountForUI
        ].packType.slice(0, 5);
      }
      record["LNTH"] =
        response.item["PACL"].toFixed(3) + " " + this.DimensionUnit;
      record["WDTH"] =
        response.item["PACW"].toFixed(3) + " " + this.DimensionUnit;
      record["HGHT"] =
        response.item["PACH"].toFixed(3) + " " + this.DimensionUnit;
      record["VOLM"] = response.item["VOM3"].toFixed(3) + " " + this.VolumeUnit;
      this.totalvolume =
        parseFloat(this.totalvolume) +
        parseFloat(response.item["VOM3"].toFixed(3));

      record["WGHT"] =
        (
          parseFloat(
            this.pkgCodeWgt[this.uniquePakTypesCount].slice(
              this.pkgCodeWgt[this.uniquePakTypesCount].lastIndexOf("_") + 1
            )
          ) + parseFloat(response.item["VOMT"])
        ).toFixed(3) +
        " " +
        this.WeightUnit;
      this.pkgWght[this.pkgWghtIndex] = response.item["VOMT"].toFixed(3);
      this.pkgWghtIndex++;
      record["NPGS"] = this.quantityJsonArray[this.packagesCountForUI].quantity;
      this.dgOptions.packData.push(record);
      this.pkgCalling = true;
      this.packagesCountForUI++;
      this.packageDatagridOptions = this.dgOptions.packageInitDataGridOptions(
        "Package Details",
        this.packageColumns
      );
      this.packageContinue();
      this.uniquePakTypesCount++;
      if (this.uniquePakTypesCount < this.uniquePakTypes.length) {
        this.getPackageTypeInfo(
          this.quantityJsonArray[this.uniquePakTypesCount].packType
        );
      } else {
        this.uniquePakTypesCount = 0;
      }
    } else {
      this.remainingMICheck4(response);
    }
  }

  packageContinue() {
    if (this.packagesCountForUI === this.quantityJsonArray.length) {
      let pkgWghtLnth = 0;
      this.shipmentTotalWeight = 0;
      let shipWtRegex;
      while (pkgWghtLnth < this.dgOptions.packData.length) {
        shipWtRegex = /[A-z]/g.exec(this.dgOptions.packData[pkgWghtLnth].WGHT);
        this.shipmentTotalWeight =
          this.shipmentTotalWeight +
          parseFloat(
            this.dgOptions.packData[pkgWghtLnth].WGHT.slice(
              0,
              shipWtRegex.index
            )
          );
        pkgWghtLnth++;
      }
      this.shipmentTWt = this.shipmentTotalWeight.toFixed(3);
      this.isLoading = false;
    }
    this.packageTypeDisable = false;
  }

  remainingMICheck4(response: IMIResponse) {
    if (response.transaction === "GetTranslData") {
      this.deliveryMethod = response.item["MVXD"];
      this.m3ChargeUpdate();
      this.setDeliverTerms();
    } else if (response.transaction == "LstConnCOCharge") {
      this.onChargeResponse(response);
      this.m3ChargeResponse = response;
      this.output = [];
    } else {
      if (this.chargeChanged === "TMS-I") {
        this.onchargeUpdation(response);
      }
    }
  }

  public sendColemanCarriers(response: IMIResponse) {
    if (response.items.length > 0) {
      this.getPkgInfoFrmCmn();
    }
  }

  private setDeliverTerms() {
    let route = "",
      dept = "";
    const modl = this.deliveryMethod;
    route = this.delMtdWareHouse.toString() + this.deliveryMethod.toString();
    if (this.selectedRecord["MODE"] === "Parcel") {
      dept = "001";
    } else {
      if (parseInt(this.daysInTransit) < 10) {
        dept = "00" + this.daysInTransit;
      } else if (parseInt(this.daysInTransit) < 100) {
        dept = "0" + this.daysInTransit;
      } else {
        dept = this.daysInTransit;
      }
    }
    const data = {
      fields: [
        { key: "OAMODL", val: modl },
        { key: "WWFLD1", val: route },
        { key: "WWFLD2", val: dept },
      ],
    };
    window.parent["infor"].companyon.client.sendMessage(
      "setApplicationFields",
      data
    );
  }

  onchargeUpdation(response: IMIResponse) {
    this.isLoading = false;
    this.chargeChanged = "TMS-E";
    this.onDeliveryTerms();

    this.m3ChargeUpdate();
    if (response.transaction == "UpdConnCOCharge") {
      this.isLoading = false;
      this.toastService.show({
        title: "Charge Updated",
        message:
          "TMS-I, TMS-E charges are updating on order " +
          this.selectedParentRecord +
          " and MODL, Route ID, Departure are updating in the OIS100/I panel." +
          "\n" +
          "Please close the Application",
        position: SohoToastService.BOTTOM_LEFT,
        timeout: 15000,
      });
    }
  }
  public onDeliveryTerms() {
    if (
      this.deliveryTerms === "TM1" ||
      this.deliveryTerms === "TM2" ||
      this.deliveryTerms === "TM4" ||
      this.deliveryTerms === "TM5"
    ) {
      this.m3Freight = 0;
    } else if (this.deliveryTerms === "TM3") {
      this.m3Freight = -this.selectedRecord["FRET"];
    } else if (this.deliveryTerms === "TM6" || this.deliveryTerms === "TM7") {
      this.m3Freight = ((this.m3Freight * 11) / 10).toFixed(2);
    }
  }
  public requestDateCheck(dDate: any) {
    let todayDate = this.dateConcat(new Date());
    let month, day, year, month1, year1, day1;
    if (this.dateFormat === "MM/dd/yyyy") {
      month = parseInt(dDate.slice(0, 2));
      day = parseInt(dDate.slice(3, 5));
      year = parseInt(dDate.slice(6, 10));
      month1 = parseInt(todayDate.slice(0, 2));
      day1 = parseInt(todayDate.slice(3, 5));
      year1 = parseInt(todayDate.slice(6, 10));
    } else if (this.dateFormat === "yyyy/MM/dd") {
      year = parseInt(dDate.slice(0, 4));
      month = parseInt(dDate.slice(5, 7));
      day = parseInt(dDate.slice(8, 10));
      year1 = parseInt(todayDate.slice(0, 4));
      month1 = parseInt(todayDate.slice(5, 7));
      day1 = parseInt(todayDate.slice(8, 10));
    } else if (this.dateFormat === "dd/MM/yyyy") {
      month = parseInt(dDate.slice(0, 2));
      year = parseInt(dDate.slice(3, 7));
      day = parseInt(dDate.slice(8, 10));
      day1 = parseInt(todayDate.slice(8, 10));
      month1 = parseInt(todayDate.slice(0, 2));
      year1 = parseInt(todayDate.slice(3, 7));
    }
    if (
      year < year1 ||
      (year1 === year && month1 > month) ||
      (year1 === year && month1 === month && day1 > day)
    ) {
      this.departureDate1 = todayDate;
    }
  }
  protected onError(message: string, title?: any) {
    const buttons = [
      {
        text: "Ok",
        click: (_e, modal) => {
          modal.close();
        },
      },
    ];
    this.messageService
      .error()
      .title(title)
      .message(message)
      .buttons(buttons)
      .open();
  }
  private createRequest(relativeUrl: string, headers?: object): IIonApiRequest {
    if (!headers) {
      headers = {
        Accept: "application/json",
      };
    }
    const url = this.serviceUrl + "/" + relativeUrl;
    // Create the request
    this.TmsRequest = {
      RateOwner: "",
      carrierCodes: [],
      ClientTransaction: {
        ReferenceNumber: "",
        SourceSystem: "",
      },
      Shipment: {
        Destination: {
          Address: {
            AddressLine1: "",
            AddressLine2: "",
            AddressLine3: "",
            City: "",
            StateProvinceCode: "",
            PostalCode: "",
            CountryCode: "",
          },
        },
        Origin: {
          Address: {
            AddressLine1: "",
            AddressLine2: "",
            AddressLine3: "",
            City: "",
            StateProvinceCode: "",
            PostalCode: "",
            CountryCode: "",
          },
        },
        ShipmentTotalWeight: {
          UOM: "",
          Value: 0.0,
        },
        Packages: [],
        TotalVolume: {
          UOM: "",
          Value: 0.0,
        },
        TotalQuantity: {
          UOM: "",
          Value: 0,
        },
        PickupDateTime: {
          Date: "",
          Time: "",
        },
        Commodities: [],
      },
      Modes: [],
      EquipmentTypes: [],
      TripType: "",
      MovementDirection: "",
      RateType: "",
      ChargeTypes: [],
      ServiceLevelCode: "*",
    };

    this.TmsRequest.RateOwner = this.tenant;
    if (
      this.colemanCarrier === "ALL" ||
      this.colemanCarrier === "LTL" ||
      this.colemanCarrier === "SPC"
    ) {
      this.TmsRequest.carrierCodes = ["*"];
    } else {
      this.TmsRequest.carrierCodes = [String(this.colemanCarrier)];
    }
    this.TmsRequest.ClientTransaction.ReferenceNumber = this.orderNumber;
    this.TmsRequest.ClientTransaction.SourceSystem = this.tenant;
    // Shipment Destination Address
    this.TmsRequest.Shipment.Destination.Address.AddressLine1 =
      this.destinationAddressResponse["CUA1"];
    this.TmsRequest.Shipment.Destination.Address.AddressLine2 =
      this.destinationAddressResponse["CUA2"];
    this.TmsRequest.Shipment.Destination.Address.City =
      this.destinationAddressResponse["TOWN"];
    this.TmsRequest.Shipment.Destination.Address.CountryCode =
      this.destinationAddressResponse["CSCD"];
    this.TmsRequest.Shipment.Destination.Address.PostalCode =
      this.destinationAddressResponse["PONO"];
    this.TmsRequest.Shipment.Destination.Address.StateProvinceCode =
      this.destinationAddressResponse["ECAR"];
    // Shipment Origin Address
    this.TmsRequest.Shipment.Origin.Address.AddressLine1 =
      this.sourceAddressResponse["ADR1"];
    this.TmsRequest.Shipment.Origin.Address.AddressLine2 =
      this.sourceAddressResponse["ADR2"];
    this.TmsRequest.Shipment.Origin.Address.City =
      this.sourceAddressResponse["TOWN"];
    this.TmsRequest.Shipment.Origin.Address.CountryCode =
      this.sourceAddressResponse["CSCD"];
    this.TmsRequest.Shipment.Origin.Address.PostalCode =
      this.sourceAddressResponse["PONO"];
    this.TmsRequest.Shipment.Origin.Address.StateProvinceCode =
      this.sourceAddressResponse["ECAR"];
    //Shipment Total Weight
    this.TmsRequest.Shipment.ShipmentTotalWeight.UOM = this.WeightUnit;
    if (
      this.shipmentTotalWeight >= 0.00001 &&
      this.shipmentTotalWeight < 999999999999.99
    ) {
      this.TmsRequest.Shipment.ShipmentTotalWeight.Value = parseFloat(
        this.shipmentTotalWeight.toFixed(3)
      );
    } else {
      this.onError(
        "Shipment Total Weight must be in between 0.00001 and 999999999999.99",
        "Total Weight validation"
      );
    }
    // Total Volume
    this.volumeStart();
    // Equipment Type
    this.TmsRequest.EquipmentTypes = [String(this.equipmentType)];
    // Movement Direction
    this.TmsRequest.MovementDirection = "O";
    // Trip Type
    this.TmsRequest.RateType = "AP";
    // Rate Type
    this.TmsRequest.TripType = "ONE WAY";
    // Charge Type
    const request: IIonApiRequest = {
      method: "POST",
      url: url,
      headers: headers,
      body: this.TmsRequest,
      source: "TMS_Shop_Rate",
    };
    return request;
  }
  destinationAddress(): boolean {
    let dAddress1: string;
    if (!this.destinationAddressResponse) {
      this.destinationAddress();
    } else {
      return true;
    }
  }
  public volumeStart() {
    this.TmsRequest.Shipment.TotalVolume.UOM = this.VolumeUnit;
    if (
      (this.totalvolume >= 0.00001 && this.totalvolume < 999999999999.99) ||
      (this.totalvolumeLTL >= 0.00001 && this.totalvolumeLTL < 999999999999.99)
    ) {
      if (this.mod1["DRTRCA"] === "LTL") {
        this.TmsRequest.Shipment.TotalVolume.Value = this.totalvolumeLTL;
      } else {
        this.TmsRequest.Shipment.TotalVolume.Value = this.totalvolume;
      }
    } else {
      this.onError(
        "Total Volume must be in between 0.00001 and 999999999999.99",
        "Rates input Validation"
      );
      this.disableApp();
    }
    // Total Quantity
    if (
      this.totalOrderQunatity >= 0.00001 &&
      this.totalOrderQunatity < 999999999999.99
    ) {
      this.TmsRequest.Shipment.TotalQuantity.UOM = this.quantityUOM;
      this.TmsRequest.Shipment.TotalQuantity.Value = this.totalOrderQunatity;
    } else {
      this.onError(
        "Total Order Quantity must be in between 0.00001 and 999999999999.99",
        "Rates input Validation"
      );
      this.disableApp();
    }
    // PickupDateTime
    this.TmsRequest.Shipment.PickupDateTime.Date = this.departureDate;
    // Packages
    this.onParcelAll();
    // Commodities
    this.otParcel();
    // Modes
    if (this.mod1["DRTRCA"] === "ALL") {
      this.TmsRequest.Modes = ["*"];
    } else if (this.mod1["DRTRCA"] === "SPC") {
      this.TmsRequest.Modes = ["PARCEL"];
    } else {
      this.TmsRequest.Modes = [String(this.mod1["DRTRCA"])];
    }
  }
  public onParcelAll() {
    if (
      this.mod1["DRTRCA"] === "SPC" ||
      (this.mod1["DRTRCA"] === "ALL" && this.uniquePakDimension.length > 0)
    ) {
      for (let index = 0; index < this.uniquePakTypes.length; index++) {
        if (
          this.uniquePakDimension[index].PACL >= 0.00001 &&
          this.uniquePakDimension[index].PACL < 999999.99 &&
          this.uniquePakDimension[index].PACW >= 0.00001 &&
          this.uniquePakDimension[index].PACW < 999999.99 &&
          this.uniquePakDimension[index].PACH >= 0.00001 &&
          this.uniquePakDimension[index].PACH < 999999.99
        ) {
          this.shipmentPackages(index);
          this.TmsRequest.Shipment.Packages.push({
            PackagingType: {
              Code: this.pkgTypeCode,
            },
            Dimensions: {
              UOM: this.DimensionUnit,
              Length: this.uniquePakDimension[index].PACL,
              Width: this.uniquePakDimension[index].PACW,
              Height: this.uniquePakDimension[index].PACH,
            },
            PackageWeight: {
              UOM: this.WeightUnit,
              Value: parseFloat(
                (
                  parseFloat(
                    this.pkgCodeWgt[index].slice(
                      this.pkgCodeWgt[index].lastIndexOf("_") + 1
                    )
                  ) + parseFloat(this.pkgWght[index])
                ).toFixed(3)
              ),
            },
            NumberOfPieces: this.quantityJsonArray[index].quantity,
          });
        } else {
          this.onError(
            "Package Dimensions(length,width,height) must be between 0.00001 and 999999.99 ",
            "Rates input Validation"
          );
          this.disableApp();
        }
      }
    }
  }

  public shipmentPackages(index: number) {
    this.pkgTypeCode = "";
    if (this.quantityJsonArray[index].packType.slice(0, 1) === "Y") {
      this.pkgTypeCode = "02";
    } else if (this.quantityJsonArray[index].packType.slice(0, 1) === "P") {
      this.pkgTypeCode = "08";
    } else {
      this.pkgTypeCode = this.quantityJsonArray[index].packType.slice(3, 6);
    }
  }
  public disableApp() {
    this.modeDisable = true;
    this.packageTypeDisable = true;
    this.tmsRates = true;
    this.isLoading = false;
    this.carrierDisable = true;
  }
  public otParcel() {
    if (this.mod1["DRTRCA"] !== "SPC") {
      for (let index = 0; index < this.itemNumberLen; index++) {
        if (
          this.comWeight[index] >= 0.00001 &&
          this.comWeight[index] < 999999999999.99 &&
          this.comVolume[index] >= 0.00001 &&
          this.comVolume[index] < 999999999999.99 &&
          this.orderQuantity[index] >= 0.00001 &&
          this.orderQuantity[index] < 999999999999.99
        ) {
          this.TmsRequest.Shipment.Commodities.push({
            Sequence: index + 1,
            Code: this.commodityCode[index],
            ClassCode: this.classCode[index],
            Weight: {
              UOM: this.WeightUnit,
              Value: this.comWeight[index],
            },
            Volume: {
              UOM: this.VolumeUnit,
              Value: this.comVolume[index],
            },
            Quantity: {
              UOM: this.quantityUOM,
              Value: this.orderQuantity[index],
            },
          });
        }
      }
      for (let itemNumber of this.itemNumberLen) {
        this.TmsRequest.ChargeTypes.push(itemNumber);
      }
    }
  }

  public onRateResponse(response: IIonApiResponse) {
    if (!response.body.ErrorList) {
      let TmsResponse: ITmsResponse = response.body;
      if (TmsResponse.rateRecords) {
        if (TmsResponse.rateRecords.Message) {
          this.onError(
            TmsResponse.rateRecords.Message,
            "Freight Rate Information"
          );
        } else if (TmsResponse.rateRecords.length) {
          this.rateResponse(TmsResponse);
        } else {
          this.carrierCheck(TmsResponse);
        }
      }
    }
  }

  public rateResponse(TmsResponse: ITmsResponse) {
    if (Array.isArray(TmsResponse.rateRecords)) {
      if (TmsResponse.rateRecords.length > 1) {
        this.onMultipleRatesFound(TmsResponse.rateRecords);
      } else if (TmsResponse.rateRecords.length == 1) {
        this.onSingleRateFound(TmsResponse.rateRecords[0]);
      }
    }
  }
  private getRates() {
    // Set busy indicator
    this.isLoading = true;
    // Create request
    const request = this.createRequest("ShopRate/shippingrate");
    console.log("KBX or TMS request is: ");
    console.log(request);
    // call ION Api
    this.onCallIonApi(request);
  }

  carrierCheck(TmsResponse: ITmsResponse) {
    if (TmsResponse.rateRecords.length === 0) {
      if (this.carrier1 === "Select All" || this.carrier1["DRFWNO"]) {
        if (!TmsResponse.errors.length) {
          this.onError(
            "Minimum weight should be 150 kgs to get freight rate records for selected Carrier(s)",
            "Freight Rate Information"
          );
          this.datagrid.dataset = [];
        } else {
          this.onError(
            TmsResponse.errors[0].source +
              " - " +
              TmsResponse.errors[0].message,
            "Carrier Response"
          );
        }
      }
    } else {
      this.rateResponse(TmsResponse);
    }
  }

  onCallIonApi(request: IIonApiRequest) {
    this.ionApiService.execute(request).subscribe(
      (response: IIonApiResponse) => {
        console.log("ION Response is: ");
        console.log(response);
        this.isLoading = false;
        this.dgOptions.packData = [];
        this.packageStore = [];
        this.pckRwSlctIndex = 0;
        this.packageTypeNameCount = 0;
        this.packageTypeCount = 0;
        this.selectedRecord = null;
        if (request.source === "Coleman_Packages") {
          this.ColemanResponse(response);
        } else {
          this.onRateResponse(response);
        }
      },
      (error: TMSandColemanInterface) => {
        if (error.status >= 400) {
          if (request.source === "Coleman_Packages") {
            this.onError(error.error.message, error.status + " " + error.name);
          } else if (error.status === 404) {
            this.onError(error.status + "Invalid URL", "Bad Request");
          }
          this.disableApp();
        } else if (error.status >= 500) {
          this.onError(
            error.status +
              " Internal Server Error, Please try again after some time",
            "Internal Server Error"
          );
          this.disableApp();
        } else {
          this.modeDisable = false;
          this.packageTypeDisable = false;
        }
        this.isLoading = false;
      }
    );
  }

  public ColemanResponse(response: IIonApiResponse) {
    this.tmsRates = false;
    if (!response.body[0].score_1) {
      this.onError(
        "Coleman AI generated empty packages, Please try again",
        "Packages response"
      );
    } else {
      let packageRelatedInfo = response.body[0].score_1;
      let regex = /[(]/gm,
        result,
        fullPkgCode = [],
        multiQtyFullPkgCd = [],
        pkgCode = [],
        binlength = 0,
        binlength1 = 0;
      let blah = "";
      while ((result = regex.exec(packageRelatedInfo))) {
        blah = packageRelatedInfo.slice(result.index, result.index + 15);
        binlength = blah.indexOf("_");
        binlength1 = blah.lastIndexOf("_");
        pkgCode.push(
          packageRelatedInfo.slice(
            result.index + 1,
            result.index + binlength + 2
          )
        );
        this.pkgCodeWgt.push(
          packageRelatedInfo.slice(result.index, result.index + 15)
        );
        fullPkgCode.push(
          packageRelatedInfo.slice(
            result.index - 1,
            result.index + 7 + (binlength1 - binlength)
          )
        );
        multiQtyFullPkgCd.push(
          packageRelatedInfo.slice(
            result.index - 3,
            result.index + 7 + (binlength1 - binlength)
          )
        );
      }

      //   console.log(Number.isNaN(multiQtyFullPkgCd.slice(0,3)));
      //   console.log(multiQtyFullPkgCd);

      // for(let multioQtyFPkg of multiQtyFullPkgCd) {

      //     if(Number.isNaN(multioQtyFPkg.slice(0,3)))
      //     {
      //        if(Number.isNaN(multioQtyFPkg.slice(1,3))){
      //          if(Number.isNaN(multioQtyFPkg.slice(2,3))) {
      //             console.log(multioQtyFPkg);
      //          }
      //          else {
      //             console.log("ok check");

      //          }
      //        }
      //        else {
      //          console.log("not ok");

      //        }
      //     }
      //     else {
      //       console.log("ok sir");

      //     }
      // }
      let pkgCodeLnth = 0;
      while (pkgCodeLnth < pkgCode.length) {
        if (this.pkgCodeWgt[pkgCodeLnth].indexOf(")")) {
          this.pkgCodeWgt[pkgCodeLnth] = this.pkgCodeWgt[pkgCodeLnth].slice(
            0,
            this.pkgCodeWgt[pkgCodeLnth].indexOf(")")
          );
        }
        pkgCodeLnth++;
      }
      this.uniquePakTypes = pkgCode.filter((c, index) => {
        return pkgCode.indexOf(c) === index;
      });
      this.quantityJsonArray = [];
      this.packageTypeDisable = true;
      let quantityJson, unqPak;
      console.log("quantity ");
      console.log(pkgCode);
      // fullPkgCode = ["100(YT1-02_0"];
      // multiQtyFullPkgCd = ["-100(YT1-02_0"]
      console.log(fullPkgCode);
      console.log(this.uniquePakTypes);
      console.log(multiQtyFullPkgCd);

      for (let uniquePakType of this.uniquePakTypes) {
        quantityJson = 0;

        //  -10(YT1-02_0'
        for (let fullPkg of multiQtyFullPkgCd) {
          console.log(uniquePakType + " " + fullPkg);
          if (uniquePakType === fullPkg.slice(4, 12)) {
            if (
              Number(fullPkg.slice(0, 1)) > 0 &&
              Number(fullPkg.slice(0, 1) <= 9) &&
              Number(fullPkg.slice(1, 2)) > 0 &&
              Number(fullPkg.slice(1, 2) <= 9)
            ) {
              quantityJson += parseInt(fullPkg.slice(0, 3));
              console.log("1");
              unqPak = fullPkg.slice(4, 10);
            } else if (
              Number(fullPkg.slice(1, 2)) > 0 &&
              Number(fullPkg.slice(1, 2) <= 9)
            ) {
              quantityJson += parseInt(fullPkg.slice(1, 3));
              console.log("2");
              unqPak = fullPkg.slice(4, 10);
            } else {
              quantityJson += parseInt(fullPkg.slice(2, 3));
              console.log("3");
              unqPak = fullPkg.slice(4, 10);
            }
          } else if (uniquePakType === fullPkg.slice(4, 11)) {
            if (
              Number(fullPkg.slice(0, 1)) > 0 &&
              Number(fullPkg.slice(0, 1) <= 9) &&
              Number(fullPkg.slice(1, 2)) > 0 &&
              Number(fullPkg.slice(1, 2) <= 9)
            ) {
              quantityJson += parseInt(fullPkg.slice(0, 3));
              unqPak = fullPkg.slice(4, 9);
            } else if (
              Number(fullPkg.slice(1, 2)) > 0 &&
              Number(fullPkg.slice(1, 2) <= 9)
            ) {
              quantityJson += parseInt(fullPkg.slice(1, 3));
              unqPak = fullPkg.slice(4, 9);
            } else {
              quantityJson += parseInt(fullPkg.slice(2, 3));
              unqPak = fullPkg.slice(4, 9);
            }
          }
        }
        uniquePakType = this.quantityJsonArray.push({
          quantity: quantityJson,
          packType: unqPak,
        });
      }
      this.totalvolume = 0.0;
      this.pkgWghtIndex = 0;
      this.getPackageTypeInfo(
        this.quantityJsonArray[this.uniquePakTypesCount].packType
      );
    }
    console.log("Quantity json");
    console.log(this.quantityJsonArray);
  }
  ratesDate(rateDate: Date) {
    if (!rateDate) {
      this.onError(
        "Freight Rates of " +
          this.mod1["DRTRCA"] +
          " mode could not able to display in the Grid due to Estimated Arrival Date is null.",
        "Freight Rates"
      );
    } else {
      let ratesFinalDate;
      let month = rateDate.toString().slice(0, 2);
      let date = rateDate.toString().slice(3, 5);
      let year = rateDate.toString().slice(6, 10);
      ratesFinalDate = this.estimateArrivalDateFormat(year, month, date);
      return ratesFinalDate;
    }
  }

  private onMultipleRatesFound(rates: IRate[]) {
    // Set records
    for (let rate of rates) {
      if (rate.estimatedArrivalDate) {
        rate.estimatedArrivalDate = this.ratesDate(rate.estimatedArrivalDate);
      }
    }
    let records: MIRecord[] = [];
    for (let rate of rates) {
      let record: MIRecord = new MIRecord();
      record["CACD"] = rate.carrierCode;
      record["CARR"] = rate.carrierName;
      record["SUFI"] = rate.serviceLevel;

      record["DLDT"] = rate.estimatedArrivalDate;
      record["CRCY"] = rate.currencyCode;
      record["FRET"] = rate.totalRatedAmount;
      record["MODE"] = rate.mode;
      record["SLCD"] = rate.serviceLevelCode;
      record["DITS"] = rate.daysInTransit;
      this.onResponseValidation(record, records);
    }
    // Set data
    this.datagrid.dataset = records;
    this.datagridOptions = { ...this.datagridOptions };
  }

  onResponseValidation(record: MIRecord, records: MIRecord[]) {
    if (
      record["CACD"] &&
      record["CARR"] &&
      record["DLDT"] &&
      record["SUFI"] &&
      record["CRCY"] &&
      record["FRET"] &&
      record["MODE"] &&
      record["SLCD"] &&
      record["DITS"]
    ) {
      records.push(record);
    } else {
      this.onError(
        "Freight Rates of " +
          this.mod1["DRTRCA"] +
          " mode could not able to display in the Grid due to part of this " +
          record["CACD"] +
          " response is null",
        "Freight Rates"
      );
    }
    this.datagrid.dataset = records;
    this.datagridOptions = { ...this.datagridOptions };
  }

  private onSingleRateFound(rate: IRate) {
    // Set records
    if (rate.estimatedArrivalDate) {
      rate.estimatedArrivalDate = this.ratesDate(rate.estimatedArrivalDate);
      let records: MIRecord[] = [];
      let record: MIRecord = new MIRecord();
      record["CACD"] = rate.carrierCode;
      record["CARR"] = rate.carrierName;
      record["SUFI"] = rate.serviceLevel;
      record["DLDT"] = rate.estimatedArrivalDate;
      record["FRET"] = rate.totalRatedAmount;
      record["MODE"] = rate.mode;
      record["SLCD"] = rate.serviceLevelCode;
      record["SLCG"] = rate.serviceLevelCategory;
      record["EQMT"] = rate.equipment;
      record["DITS"] = rate.daysInTransit;
      record["CRCY"] = rate.currencyCode;
      this.onResponseValidation(record, records);
    }
  }

  public onSelected(event: any) {
    this.selectedRecord = null;
    if (event.rows) {
      if (event.rows.length > 0) {
        this.selectedRecord = event.rows[0].data;
        if (this.selectedRecord) {
          if (
            this.deliveryTerms === "TM1" ||
            this.deliveryTerms === "TM4" ||
            this.deliveryTerms === "TM6" ||
            this.deliveryTerms === "TM7"
          ) {
            this.m3Freight = parseFloat(this.selectedRecord["FRET"]);
          } else if (
            this.deliveryTerms === "TM2" ||
            this.deliveryTerms === "TM3" ||
            this.deliveryTerms === "TM5"
          ) {
            this.m3Freight = 0;
          }
          this.m3CurrecyCode = this.selectedRecord["CRCY"];
          this.daysInTransit = this.selectedRecord["DITS"];
        }
      }
    }
  }
}
export interface Iquantity {
  quantity: number;
  packType: string;
}
