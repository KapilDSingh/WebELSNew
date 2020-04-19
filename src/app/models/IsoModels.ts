export class lmpTblRow {

  public timestamp: Date;
   public fiveMinuteAvgLMP: number;
   
}
export class loadTblRow {
  public timestamp: Date;
  public instantaneous_Load: number;
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
