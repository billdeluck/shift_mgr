export default class User {
    constructor(id, fullName, email, password, role = 'employee') {
      this.id = id;
      this.fullName = fullName;
      this.email = email;
      this.password = password;
      this.role = role;
    }
  }
  