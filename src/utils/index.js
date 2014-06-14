module.exports = {
  /*!
   * Stringify a number.
   */
  stringifyNumber: function (number) {
    if (number && angular.isNumber(number)) {
      return number.toString();
    }
    return number;
  },

  /*!
   * Return a hash of the keys in the given collection.
   */
  keySet: function (collection) {
    var keySet = {}, key;
    for (key in collection) {
      if (collection.hasOwnProperty(key)) {
        keySet[key] = key;
      }
    }
    return keySet;
  },

  /*!
   * Return an array of the keys in the given collection
   */
  keys: function (collection) {
    var keys = [], key;
    for (key in collection) {
      if (collection.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
    return keys;
  }
};
