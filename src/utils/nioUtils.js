let timeout= (ms, promise) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject({status:504, message:"time out"});
    }, ms);
    promise.then(resolve, reject);
  });
};
export const api = (url, params, ms=20000) => {
  return timeout(ms, fetch(url, params)).then((response) => {
    return response.json().then((body) => ({body, response}));
  }).catch((error) => {
    throw error;
  });
};

export const GET = (url, params={}, ms) => {
  if (params.headers) {
    Object.assign(params.headers);
  }
  let finalParams = Object.assign({}, params || {}, {
    method: "GET"
  });

  return api(url, finalParams, ms);
};

export const POST = (url, body, params={}) => {
  let headers = Object.freeze({
    "Content-Type": "application/json"
  });
  if (params.headers) {
    Object.assign(headers, params.headers);
  }

  let finalParams = Object.assign({}, params, {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  });

  return api(url, finalParams);
};

export const PUT = (url, body, params={}) => {
  let headers = Object.freeze({
    "Content-Type": "application/json"
  });
  if (params.headers) {
    Object.assign(headers, params.headers);
  }

  let finalParams = Object.assign({}, params, {
    method: "PUT",
    body: JSON.stringify(body),
    headers,
  });

  return api(url, finalParams);
};

export const DELETE = (url, body, params={}) => {
  let headers = Object.freeze({
    "Content-Type": "application/json"
  });
  if (params.headers) {
    Object.assign(headers, params.headers);
  }

  let finalParams = Object.assign({}, params, {
    method: "DELETE",
    body: JSON.stringify(body),
    headers,
  });

  return api(url, finalParams);
};