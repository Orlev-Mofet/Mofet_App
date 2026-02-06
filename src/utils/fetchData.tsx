import {create} from 'apisauce';

import {BACKEND_API_URL, SK_TOKEN} from './constants';
import {getStorageData} from './localStorage';
import {CommonObject} from '../components';

// create api.
const api = create({
  baseURL: BACKEND_API_URL,
});

const storeFetchData = async (url: string, bodyData: any) => {
  try {
    const token = await getStorageData(SK_TOKEN);

    return await fetch(`${BACKEND_API_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyData),
    })
      .then((response: any) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(responseData => {
        return responseData;
      })
      .catch(e => {
        throw e;
      });
  } catch (error) {
    throw error;
  }
};

const storeFetchFormData = async (url: string, formData: FormData) => {
  try {
    const token = await getStorageData(SK_TOKEN);

    return await fetch(`${BACKEND_API_URL}${url}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data; ',
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response: any) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(responseData => {
        return responseData;
      })
      .catch(e => {
        throw e;
      });
  } catch (error) {
    throw error;
  }
};

const storeFetchProgressFormData = async (
  url: string,
  data: FormData,
  setProgress: (val: number) => void,
) => {
  try {
    const token = (await getStorageData(SK_TOKEN)) || '';
    api.setHeader('Accept', `*/*`);
    api.setHeader('Content-Type', 'multipart/form-data');
    api.setHeader('Accept-Encoding', 'gzip, deflate, br');
    api.setHeader('Authorization', `Bearer ${token}`);

    const res = await api.post(`/${url}`, data, {
      onUploadProgress: (e: any) => {
        const progress = e?.loaded / e?.total;
        // setProgress(progress);
      },
    });

    if (!res.ok) {
      throw new Error(res?.status as unknown as string);
    }

    return res.data as CommonObject;
  } catch (error) {
    throw error;
  }
};

const getFetchData = async (url: string) => {
  try {
    const token = (await getStorageData(SK_TOKEN)) || '';
    console.log(token, 'token');
    return await fetch(`${BACKEND_API_URL}${url}`, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response: any) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(data => {
        return data;
      })
      .catch(error => {
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

const deleteFetchData = async (url: string) => {
  try {
    const token = (await getStorageData(SK_TOKEN)) || '';
    console.log(token, 'token');

    return await fetch(`${BACKEND_API_URL}${url}`, {
      method: 'DELETE',
      headers: {
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response: any) => {
        console.log(response, 'response');
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(data => {
        return data;
      })
      .catch(error => {
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

const updateFetchData = async (url: string, bodyData: any) => {
  try {
    const token = await getStorageData(SK_TOKEN);

    return await fetch(`${BACKEND_API_URL}${url}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
      },
      body: JSON.stringify(bodyData),
    })
      .then((response: any) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(responseData => {
        return responseData;
      })
      .catch((e: any) => {
        console.log('cathc error');
        throw e;
      });
  } catch (error: any) {
    throw error;
  }
};

export {
  storeFetchData,
  storeFetchFormData,
  storeFetchProgressFormData,
  getFetchData,
  deleteFetchData,
  updateFetchData,
};
