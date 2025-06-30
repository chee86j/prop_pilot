export class ScraperException extends Error {
  constructor(message) {
    super(message);
    this.name = "ScraperException";
  }
}

export class DatabaseException extends Error {
  constructor(message) {
    super(message);
    this.name = "DatabaseException";
  }
}

export class NetworkException extends Error {
  constructor(message) {
    super(message);
    this.name = "NetworkException";
  }
}
