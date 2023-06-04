/**
 * Function to check if a given string is a valid URL.
 *
 * @export
 * @param {string} str - The string to be tested.
 * @return {boolean} - Returns true if the string is a valid URL, false otherwise.
 *
 * The function uses a regular expression (regex) to match the string against common URL patterns.
 * Here is a breakdown of the URL components the regex checks for:
 *
 * 1. Protocol: The regex checks if the URL starts with 'http://' or 'https://'.
 * 2. Domain name and extension: The regex checks for a valid domain name and extension.
 * 3. IP (v4) address: Alternatively, the URL could be an IP address.
 * 4. Port: The regex checks for an optional port number, which would be preceded by a colon.
 * 5. Path: The regex checks for any valid path, which would start with a '/'.
 * 6. Query string: The regex checks for an optional query string, which would start with a '?'.
 * 7. Fragment locator: Finally, the regex checks for an optional fragment locator, which would start with a '#'.
 *
 * Please note that this function only checks if the URL is in a valid format,
 * it does not verify whether the URL points to a real, reachable location on the internet.
 */
export const isValidURL = (str: string): boolean => {
  const regex = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name and extension
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?' + // port
    '(\\/[-a-z\\d%_.~+]*)*' + // path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

  return regex.test(str);
};

/**
 * Function to check if a given URL is a YouTube video URL.
 *
 * @export
 * @param {string} url - The URL to be tested.
 * @return {boolean} - Returns true if the URL is a YouTube video URL, false otherwise.
 *
 * The function uses a regular expression (regex) to match the URL against the pattern of YouTube video URLs.
 * The regex checks for both long-form URLs (https://www.youtube.com/watch?v=) and short-form or 'share' URLs (https://youtu.be/),
 * followed by a series of alphanumeric characters, hyphens or underscores which typically represent the video ID.
 *
 * Note that this function does not check if the URL is a valid, existing YouTube video - it simply checks if the URL follows the standard format of a YouTube video URL.
 */
export const isYoutubeVideo = (url: string): boolean => {
  var pattern = /^(https?:\/\/)?((www\.)?youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9\-_]+$/i;
  return pattern.test(url);
};
