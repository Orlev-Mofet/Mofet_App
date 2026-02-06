// MofetContext.tsx
import React, {
  ReactNode,
  useState,
  useMemo,
  createContext,
  useContext,
} from 'react';
import {CommonObject} from '..';
import {storeStorageData} from '../../utils/localStorage';
import {SK_USER_DATA} from '../../utils/constants';

type Context = {
  userData: CommonObject;
  setUserData: (userData: CommonObject) => void;
  contactUs: boolean;
  setShowContactUs: (val: boolean) => void;
  removeConfirmation: boolean;
  setRemoveConfirmation: (val: boolean) => void;
};

const UserContext = createContext<Context | null>(null);

export function UserProvider({children}: {children: ReactNode}) {
  const [userData, setUser] = useState<CommonObject>({});
  const [contactUs, setContactUs] = useState<boolean>(false);
  const [removeConfirmation, setRemoveConfirmation] = useState<boolean>(false);

  const setUserData = (userData: CommonObject) => {
    const run = async () => {
      await storeStorageData(SK_USER_DATA, JSON.stringify(userData));
    };

    run();
    setUser(userData);
  };

  const setShowContactUs = (val: boolean) => {
    setContactUs(val);
  };

  const values = useMemo(
    () => ({
      userData,
      contactUs,
      setUserData,
      setShowContactUs,
      removeConfirmation,
      setRemoveConfirmation,
    }),
    [
      userData,
      contactUs,
      setUserData,
      setShowContactUs,
      removeConfirmation,
      setRemoveConfirmation,
    ],
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}

export function useUser(): Context {
  const context = useContext(UserContext);

  if (context === null) {
    throw new Error('userUser must be used within an UserProvider');
  }

  return context;
}
