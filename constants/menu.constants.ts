import { NOTION_PROPERTY_CONFIG } from "@/config/notion.property.config";

    export const ARCHIVE_PROPERTIES_TYPE_MAP = {
      [NOTION_PROPERTY_CONFIG.type_record]: "RECORD",
      [NOTION_PROPERTY_CONFIG.type_project]: "PROJECT",
      [NOTION_PROPERTY_CONFIG.type_general]: "ENGINEERING",
  [NOTION_PROPERTY_CONFIG.type_engineering]: "GENERAL",
  [NOTION_PROPERTY_CONFIG.type_page]: "Page",
  [NOTION_PROPERTY_CONFIG.type_notice]: "Notice",
  [NOTION_PROPERTY_CONFIG.type_menu]: "Menu",
  [NOTION_PROPERTY_CONFIG.type_sub_menu]: "SubMenu",
  [NOTION_PROPERTY_CONFIG.type_sub_menu_page]: "SubMenuPage",
};
export const ARCHIVE_PROPERTIES_STATUS_MAP = {
  [NOTION_PROPERTY_CONFIG.status_publish]: "Published",
  [NOTION_PROPERTY_CONFIG.status_invisible]: "Invisible",
};
export const EXCLUDED_PAGE_TYPES = ["Menu", "SubMenu", "Notice"];

export const AVAILABLE_PAGE_TYPES = [
  ...NOTION_PROPERTY_CONFIG.type_able_arr,
  "Archive",
];

export const INCLUDED_MENU_TYPES = ["Menu", "SubMenu", "SubMenuPage"];

export const GENERAL_TYPE_MENU = ["Menu", "SubMenu"];
export const PAGE_TYPE_MENU = ["Page", "SubMenuPage"];
