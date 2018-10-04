export default class Utils {
  /**
   * getData
   * @param  {String} url
   * @return {Promise}
   */
  static getData(url) {
    return fetch(url)
      .then(response => response.json());
  }
}

