// Array utility extensions matching Vue implementation

export function arrayRemoveValue<T>(array: T[], key: keyof T, value: any): T[] {
  return array.filter((item) => item[key] !== value);
}

export function arrayMax(array: number[]): number {
  return Math.max(...array);
}

// Check if account should be displayed (not SL, RD, or XX status)
export function checkSLAccount(loan: { LoanStatus?: string }): boolean {
  if (loan.LoanStatus) {
    if (
      loan.LoanStatus.indexOf("SL") >= 0 ||
      loan.LoanStatus.indexOf("RD") >= 0 ||
      loan.LoanStatus.indexOf("XX") >= 0
    ) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
}

