export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class DrawSequenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DrawSequenceError";
  }
}

export class DrawAmountError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DrawAmountError";
  }
}

export class DrawApprovalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DrawApprovalError";
  }
}

export class ReceiptAmountError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReceiptAmountError";
  }
}

export class ReceiptDateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReceiptDateError";
  }
}

export class ReceiptDuplicateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReceiptDuplicateError";
  }
}
