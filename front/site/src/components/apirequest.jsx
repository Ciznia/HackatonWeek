class ApiClient {
  constructor() {
    this.serverUrl = ``;
  }

  async _internal(APIUrl, method, body = null, content_type = null) {
    const headers = {};

    if (content_type)
      headers['Content-Type'] = content_type;

    const requestOptions = {
      method: method,
    };

    if (headers)
      requestOptions['headers'] = headers
    if (body)
      requestOptions['body'] = body
    try {
      const response = await fetch(this.serverUrl + APIUrl, requestOptions);
      const data = await response.json();
      return {
        status: response.status,
        data: data,
      };
    } catch (error) {
      throw error;
    }
  }

  async json(APIUrl, method, body = null) {
    return this._internal(APIUrl, method, JSON.stringify(body), 'application/json')
      .then((response) => {
        if (response === undefined || response === null)
          throw new Error(`Error fetching data from server`);
        if (response.status !== 200)
          throw new Error(`KO ${response.status} ${response.data.msg}`);
        return response
      })
      .catch((error) => {
        throw error;
      })
  }

  async withoutBody(APIUrl, method) {
    return this._internal(APIUrl, method)
      .then((response) => {
        if (response === undefined || response === null)
          throw new Error(`Error fetching data from server`);
        if (response.status !== 200)
          throw new Error(`KO ${response.status} ${response.data.msg}`);
        return response
      })
      .catch((error) => {
        throw error;
      })
  }

  async autoType(APIUrl, method, body = null) {
    return this._internal(APIUrl, method, body, null)
      .then((response) => {
        if (response === undefined || response === null)
          throw new Error(`Error fetching data from server`);
        if (response.status !== 200)
          throw new Error(`KO ${response.status} ${response.data.msg}`);
        return response
      }).catch((error) => {
        throw error;
      })
  }

}

export const APIReq = new ApiClient();
