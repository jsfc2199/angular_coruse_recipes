export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  get token(){
    //if there is no expiration date or the expiration day is in the past que don't want to return our token
    if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate){
        return null
    }
    return this._token;
  }

  get tokenExpirationDate() {
    return this._tokenExpirationDate;
  }
}
