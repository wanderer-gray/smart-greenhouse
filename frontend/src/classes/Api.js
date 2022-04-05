export class ApiError extends Error {
  constructor (status, message) {
    super(message)
    this.name = this.constructor.name
    this.status = status
  }
}

export class Api {
  constructor (url = null) {
    this._url = url;
    this._method = null;
    this._params = null;
    this._query = null;
    this._body = null;
  }

  url (url) {
    this._url = url

    return this
  }

  method (method) {
    this._method = method

    return this
  }

  params (params) {
    this._params = params

    return this
  }

  query (query) {
    this._query = query

    return this
  }

  body (body) {
    this._body = body

    return this
  }

  _getUrl () {
    const path = this._url.replace(/(:\w+)/g, (rParam) => {
      const param = rParam.slice(1);

      if (!this._params || !(param in this._params)) {
        throw new Error(`Param #${param} not found in ${this._url}`);
      }
  
      return this._params[param];
    });

    const url = new URL(path);

    if (this._query) {
      for (const [qKey, qVal] of Object.entries(this._query)) {
        url.searchParams.set(qKey, qVal);
      }
    }

    return url;
  }

  _getOptions () {
    const options = {
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      method: this._method
    };

    const body = this._body;

    if (body) {
      options.body = JSON.stringify(body)
    }

    return options;
  }

  _request () {
    const url = this._getUrl();
    const options = this._getOptions();

    return fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new ApiError(response.status, response.statusText)
        }

        return response.json();
      });
  }
  
  then (resolve, reject) {
    return this._request()
      .then(resolve)
      .catch(reject);
  }

  catch (reject) {
    return this._request()
      .catch(reject);
  }
}
