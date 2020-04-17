module.exports = async (username, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve("ok");
    } catch (err) {
      reject(err);
    }
  });
};
