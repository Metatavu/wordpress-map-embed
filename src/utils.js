/**
 * Checks if the URL is valid
 * 
 * @param {string} url
 * @returns {boolean} true if the URL is valid
 */
const isValidURL = (url) => {
  try {
    new URL(url);
    console.log('URL is valid');
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export { isValidURL };