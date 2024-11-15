export class BadgeNotFoundException extends Error {
  constructor(id: string) {
    super(`Badge with ID ${id} not found`);
    this.name = 'BadgeNotFoundException';
  }
}

export class BadgeAlreadyRevokedException extends Error {
  constructor(id: string) {
    super(`Badge with ID ${id} is already revoked`);
    this.name = 'BadgeAlreadyRevokedException';
  }
}

export class BadgeExpiredException extends Error {
  constructor(id: string) {
    super(`Badge with ID ${id} has expired`);
    this.name = 'BadgeExpiredException';
  }
}
