import {I18n} from 'i18n-js';
import moment from 'moment';

import {getLocales} from 'react-native-localize';

const en = require('./translations/en.json');
const es = require('./translations/es.json');

const translationGetters: Record<supportedTranslationTags, Object> = {
  en: en,
  es: es,
};

const defaultLanguage = 'en';
const i18n = new I18n({});
i18n.defaultLocale = defaultLanguage;
export type supportedTranslationTags = 'en' | 'es';

export let translateLocale: supportedTranslationTags;

export const setI18nConfig = (): any => {
  const fallback = {languageCode: i18n.defaultLocale};

  let {languageCode} = getLocales()?.length ? getLocales()[0] : fallback;
  if (!Object.keys(translationGetters).includes(languageCode)) {
    languageCode = defaultLanguage;
  }

  console.debug('LanguageTag: ', JSON.stringify(languageCode));

  // clear translation cache
  //translate.cache.clear();
  translateLocale = languageCode as supportedTranslationTags;
  i18n.translations = {
    [translateLocale]: translationGetters[translateLocale],
  };
  i18n.locale = translateLocale;

  return;
};

const translate = (key: string, params?: any): string => {
  return i18n.t(key, params);
};

export const translateData = (key: string, ...data: string[]): string => {
  const REPLACE_CHAR = '%s';
  let result = i18n.t(key);
  for (let param of data) {
    if (result.includes(REPLACE_CHAR)) {
      result = result.replace(REPLACE_CHAR, param);
    }
  }
  return result;
};

export const translateDate = (date: string, shorted?: boolean): string => {
  let dateFormatted: string = date;

  if (isValidDate(date)) {
    if (translateLocale == 'es') {
      dateFormatted = moment(new Date(date))
        .locale('es')
        .format(shorted ? 'DD/MM/YYYY' : 'DD MMMM YYYY');
    } else {
      dateFormatted = moment(new Date(date)).format(
        shorted ? 'MM/DD/YYYY' : 'MMMM DD YYYY',
      );
    }
  } else {
    //console.log('Date:', date, 'not valid');
  }

  return dateFormatted;
};

/**
 * Returns the translation of a concrete property. This properties could exist in tranlation files or not.
 * In case the translation is not possible, the value returned is the property name.
 * @param {string} property name (identifier) of the property should be translated.
 * @returns {string} Property translated in the language used at that moment in the wallet.
 */
export const translateProperty = (property: string): string => {
  let propertyFormatted: string = i18n.t(property, {defaultValue: property});
  return propertyFormatted;
};

function isValidDate(date: string): boolean {
  return !isNaN(Date.parse(date));
}

export default translate;
