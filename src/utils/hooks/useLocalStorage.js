import CryptoJS from "crypto-js";

const SECRET_KEY = "your-secret-key";

export const useLocalStorage = (key, type, valueToStore) => {
  if (type === "set") {
    // console.log(key, type, valueToStore)
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(valueToStore),
      SECRET_KEY
    ).toString();
    localStorage.setItem(key, encryptedData);
  } else if (type === "get") {
    const encryptedData = localStorage.getItem(key);
    if (encryptedData) {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData || '{}');
    }
    return null;
  }
};
