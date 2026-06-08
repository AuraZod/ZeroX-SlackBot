import axios from 'axios';

export const get = async (url, config = {}) => {
  try {
    const res = await axios.get(url, config);
    return res.data;
  } catch (err) {
    console.error(`fetch failed for ${url}:`, err.message);
    return null;
  }
};

export const post = async (url, body = {}, config = {}) => {
  try {
    const res = await axios.post(url, body, config);
    return res.data;
  } catch (err) {
    console.error(`post failed for ${url}:`, err.message);
    return null;
  }
};
