/**
 * Checks if the URL is valid
 *
 * @param {string} url
 * @return {boolean} true if the URL is valid
 */
const isValidURL = ( url ) => {
	try {
		new URL( url );
		return true;
	} catch ( error ) {
		return false;
	}
};

export { isValidURL };
