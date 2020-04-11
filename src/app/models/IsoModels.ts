export class lmpTblRow {

  public timestamp: Date;
   public fiveMinuteAvgLMP: number;
   
  //  constructor(timestamp: Date, fiveMinuteAvgLMP: number) {
  //   timestamp = timestamp;
  //   fiveMinuteAvgLMP = fiveMinuteAvgLMP;
  // }
}
export class loadTblRow {
  public timestamp: Date;
  public instantaneous_Load: number;

  constructor(instantaneous_Load: number, timestamp: Date) {
    timestamp = timestamp;
    instantaneous_Load = instantaneous_Load;
  }
}

export class fuelTypeData {
  public timestamp: Date;
  public gas: number;
  public nuclear: number;
  public coal: number;
  public hydro: number;
  public wind: number;
  public solar: number;
  public multipleFuels: number;
  public otherRenewables: number;
  public oil: number;
  public other: number;
  public storage: number;
}
