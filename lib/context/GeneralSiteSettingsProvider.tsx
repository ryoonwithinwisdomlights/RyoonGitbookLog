"use client";
import { BLOG } from "@/blog.config";
import {
  GeneralSiteSettingsProviderContext,
  LeftSideBarNavItem,
} from "@/types";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";

import {
  generateLocaleDict,
  getFilteredDictionaryListKey,
  saveLangToCookies,
  saveLangToLocalStorage
} from "@/lib/utils/lang";
import { initDarkMode, setThemeByLocalStorage } from "@/lib/utils/theme";
import { toast } from "sonner";

const GeneralSiteSettings =
  createContext<GeneralSiteSettingsProviderContext | null>(null);

/**
 * Global variable Provider, including language localization, style theme, search terms
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */

export const GeneralSiteSettingsProvider: React.FC<{
  children: ReactNode;
  allPagesForLeftNavBar: LeftSideBarNavItem[];
}> = ({ children, allPagesForLeftNavBar }) => {
  const [lang, updateLang] = useState<string>(BLOG.LANG); // default language
  const [locale, updateLocale] = useState<Record<string, any>>(
    generateLocaleDict(BLOG.LANG)
  );
  const [setting, SetSettingState] = useState<boolean>(false);
  const [isDarkMode, updateDarkMode] = useState<boolean>(
    BLOG.APPEARANCE === "dark"
  );
  const [onLoading, setOnLoading] = useState<boolean>(false);

  const [tocVisible, setTOCVisible] = useState<boolean>(true);
  const [pageNavVisible, setPageNavVisible] = useState<boolean>(false);

  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [filteredNavPages, setFilteredNavPages] = useState<
    LeftSideBarNavItem[]
  >(allPagesForLeftNavBar);
  // const isFirstRender = useRef(true);

  const handleTOCVisible = () => setTOCVisible(!tocVisible);

  const handleLeftNavVisible = () => setPageNavVisible(!pageNavVisible);

  const changeLang = useCallback((lang: string) => {
    if (lang) {
      saveLangToLocalStorage(lang);
      saveLangToCookies(lang);
      updateLang(lang);
      const newLocale = generateLocaleDict(lang);
      updateLocale(newLocale);
      toast.success(`${newLocale.SITE.LANG_CHANGE_SUCCESS_MSG}`);
    }
  }, []);

  const changeOppositeLang = useCallback(() => {
    const resLang = getFilteredDictionaryListKey(locale.LOCALE);

    if (resLang) {
      saveLangToLocalStorage(resLang);
      saveLangToCookies(resLang);
      updateLang(resLang);
      const newLocale = generateLocaleDict(resLang);
      updateLocale(newLocale);
      toast.success(`${newLocale.SITE.LANG_CHANGE_SUCCESS_MSG}`);
    }
  }, [locale.LOCALE]);

  const handleChangeDarkMode = useCallback(
    (newStatus = !isDarkMode) => {
      setThemeByLocalStorage(newStatus);
      updateDarkMode(newStatus);
      const htmlElement = document.getElementsByTagName("html")[0];
      htmlElement.classList?.remove(newStatus ? "light" : "dark");
      htmlElement.classList?.add(newStatus ? "dark" : "light");
    },
    [isDarkMode]
  );

  const handleSettings = useCallback(() => {
    SetSettingState((prev) => !prev);
  }, []);

  const value: GeneralSiteSettingsProviderContext = {
    onLoading,
    setOnLoading,
    searchKeyword,
    setSearchKeyword,
    filteredNavPages,
    setFilteredNavPages,
    allPagesForLeftNavBar,
    tocVisible,
    handleTOCVisible,
    pageNavVisible,
    handleLeftNavVisible,
    isDarkMode,
    handleChangeDarkMode,
    locale,
    updateLocale,
    lang,
    changeLang,
    changeOppositeLang,
    setting,
    handleSettings,
  };

  useEffect(() => {
    initDarkMode(updateDarkMode);
    // 첫 렌더링에서는 initLocale을 호출하지 않음 (서버에서 이미 올바른 locale 설정됨)
    // initLocale(lang, locale, updateLang, updateLocale);
    setOnLoading(false);
  }, []);

  // useEffect(() => {
  //   if (isFirstRender.current) {
  //     isFirstRender.current = false;
  //     return;
  //   }

  //   initLocale(lang, locale, updateLang, updateLocale);
  //   setOnLoading(false);
  //   toast.success(`${locale.SITE.LANG_CHANGE_SUCCESS_MSG} `);
  // }, [lang]);

  return (
    <GeneralSiteSettings.Provider value={value}>
      {children}
    </GeneralSiteSettings.Provider>
  );
};

export const useGeneralSiteSettings =
  (): GeneralSiteSettingsProviderContext => {
    const context = useContext(GeneralSiteSettings);
    if (!context) {
      throw new Error(
        "useGeneralSiteSettings must be used within a GeneralSiteSettingsProvider"
      );
    }
    return context;
  };
