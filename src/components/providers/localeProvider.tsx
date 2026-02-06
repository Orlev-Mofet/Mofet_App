// MofetContext.tsx
import React, {
  ReactNode,
  useState,
  useEffect,
  useMemo,
  createContext,
  useContext,
  useCallback,
} from 'react';

import { storeStorageData, getStorageData } from '../../utils/localStorage';
import { CommonObject } from '..';

// import messages
import message_en from '../../lang/en.json';
import message_he from '../../lang/he.json';
import message_ar from '../../lang/ar.json';

function loadMessages(locale: string) {
  switch (locale) {
    case 'en':
      return message_en;
    case 'he':
      return message_he;
    case 'ar':
      return message_ar;
    default:
      return message_en;
  }
}

function getDirection(locale: string) {
  switch (locale) {
    case 'en':
      return 'ltr';
    case 'he':
      return 'rtl';
    case 'ar':
      return 'rtl';
    default:
      return 'ltr';
  }
}

type Context = {
  locale: string;
  direction: string;
  messages: {};
  lang: {};
  constant: CommonObject;
  setLocaleValue: (locale: string) => void;
  addMessages: (val: {}) => void;
  setConstantData: (val: {}) => void;
};

const LocaleContext = createContext<Context | null>(null);

const DEFAULT_LOCALE = 'he';

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [ locale, setLocale ] = useState<string>(DEFAULT_LOCALE);
  const [lang, setLang] = useState<{}>({});
  const [constant, setConstant] = useState<CommonObject>({});
  const [direction, setDirection] = useState<string>('ltr');
  const [messages, setMessages] = useState<{}>(loadMessages(locale));

  useEffect(() => {
    let mounted = true;

    (async () => {
      const storedLocale = await getStorageData('mofet_locale');

      if (mounted) {
        setLocale(storedLocale || DEFAULT_LOCALE);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const setLocaleValue = (locale: string) => {
    storeStorageData('mofet_locale', locale);
    setLocale(locale);
  };

  const addMessages = (val: {}) => {
    setLang(val);
  };

  const setConstantData = (val: CommonObject) => {
    setConstant(val);
  };

  useEffect(() => {
    setMessages({ ...loadMessages(locale), ...lang });
    setDirection(getDirection(locale));
  }, [locale, lang]);

  const values = useMemo(
    () => ({
      locale,
      direction,
      messages,
      lang,
      constant,
      setLocaleValue,
      addMessages,
      setConstantData,
    }),
    [
      locale,
      direction,
      messages,
      lang,
      constant,
      setLocaleValue,
      addMessages,
      setConstantData,
    ],
  );

  return (
    <LocaleContext.Provider value={values}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): Context {
  const context = useContext(LocaleContext);

  if (context === null) {
    throw new Error('useLocale must be used within an LocaleProvider');
  }

  return context;
}
