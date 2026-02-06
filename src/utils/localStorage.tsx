import AsyncStorage from '@react-native-async-storage/async-storage';


const storeStorageData = async ( key: string, value: string ) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error saving data: ', error);
    }
};

const getStorageData = async ( key: string ) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // Data found
        return value;
      } else {
        // Data not found
        return null;
      }
    } catch (error) {
      console.error('Error retrieving data: ', error);
      return null;
    }
};



const removeStorageData = async ( key: string ) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data: ', error);
    }
};

export {
    storeStorageData, 
    getStorageData, 
    removeStorageData
}
  