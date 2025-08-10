import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} seconds`));
    }, s * 1000);
  });
};

export const AJAX = async function (
  url,
  method = 'GET',
  uploadData = undefined
) {
  try {
    const fetchPro = fetch(url, {
      method, // always explicit
      headers: uploadData ? { 'Content-Type': 'application/json' } : {},
      body: uploadData ? JSON.stringify(uploadData) : undefined,
    });

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    if (res.status === 204) return;
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};
