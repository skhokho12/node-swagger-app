export class UserModel {
  public email: string;
  public password: string;
  public name: string;
  public id: string;
  public type: string;
  public status: string;

  constructor(
    email: string,
    password: string,
    name: string,
    id: string,
    type: string,
    status: string
  ) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.id = id;
    this.type = type;
    this.status = status;
  }
}
