class Api {
  constructor() {
    this.method = 'get';
    this.url = '';
    this.params = null;
    this.query = null;
    this.body = null;
  }

  get _url() {
    return this.url
  }

  get _options() {
    return this.method
  }

  async _request() {
    const response = await fetch(this._url, this._options);

    
  }
}
