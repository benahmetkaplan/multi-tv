import { useEffect, useRef, useState } from "react";

const DEFAULT_STREAMS = [
  { slug: "pqq5c6k70kk", title: "NTV" },
  { slug: "6N8_r2uwLEc", title: "CNN Türk" },
  { slug: "ztmY_cCtUl0", title: "Sözcü TV" },
  { slug: "RNVNlJSUFoE", title: "Habertürk" },
  { slug: "8uNelFh0oz4", title: "Halk TV" },
  { slug: "EqoCJ8BPxtE", title: "Haber Global" }
];

const GRID_OPTIONS = [
  { count: 4, cols: 2, rows: 2, label: "2×2" },
  { count: 6, cols: 3, rows: 2, label: "3×2" },
  { count: 9, cols: 3, rows: 3, label: "3×3" },
  { count: 12, cols: 4, rows: 3, label: "4×3" },
  { count: 24, cols: 6, rows: 4, label: "6×4" },
];

const MAX_STREAMS = Math.max(...GRID_OPTIONS.map((option) => option.count));

const SETTINGS_TABS = ["streams", "share"];

const THEME_OPTIONS = [
  { id: "dark" },
  { id: "light" },
];

const LANGUAGE_OPTIONS = [
  { id: "tr", label: "Türkçe" },
  { id: "en", label: "English" },
  { id: "de", label: "Deutsch" },
  { id: "fr", label: "Français" },
  { id: "zh", label: "中文" },
  { id: "ar", label: "العربية" },
];

const VIDEO_RATIO = 16 / 9;
const GRID_SAFE_INSET = 24;
const SETTINGS_TRANSITION_MS = 320;
const APP_STATE_STORAGE_KEY = "multi-tv-state";
const THEME_STORAGE_KEY = "multi-tv-theme";
const LANGUAGE_STORAGE_KEY = "multi-tv-language";
const RTL_LANGUAGES = new Set(["ar"]);

const TRANSLATIONS = {
  tr: {
    tabs: { streams: "Yayınlar", share: "Paylaş" },
    themes: { dark: "Koyu", light: "Açık" },
    settingsButton: "Ayarlar",
    controlCenter: "Kontrol Merkezi",
    settingsTitle: "Ayarlar",
    settingsDescription: "Yayın başlıklarını, tema ayarını, dil seçimini ve paylaşım bağlantısını tek panelden yönet.",
    themeTitle: "Tema",
    themeDescription: "Light ve dark görünüm arasında geçiş yap.",
    languageTitle: "Dil",
    languageDescription: "Arayüz dilini değiştir.",
    activeSlotCount: "Aktif slot sayısı",
    activeSlotDescription: "İlk {count} slot düzenlenebilir durumda.",
    streamLabel: "Yayın {index}",
    inactive: "Pasif",
    active: "Aktif",
    videoSlug: "Video Slug / ID",
    title: "Başlık",
    titlePlaceholder: "Yayın adı...",
    emptySlot: "Boş Slot",
    emptySlotDescription: "Ayarlardan bir YouTube yayın kimliği ekleyerek bu alanı doldurabilirsin.",
    selected: "Seçili",
    liveStream: "Canlı Yayın",
    slugHelpTitle: "Slug nasıl bulunur?",
    slugHelpText: "YouTube bağlantısındaki",
    slugHelpText2: "bölümündeki değeri girmen yeterli. Embed formatı:",
    shareTitle: "Paylaşılabilir görünüm",
    shareDescription: "Mevcut grid yapısı, tema seçimi ve tüm yayın bilgileri URL içine kodlanır. Linki açan herkes aynı düzeni görür.",
    createShareUrl: "Paylaşım URL'si Oluştur",
    generatedUrl: "Oluşan URL",
    shareHint: "Paylaşım bağlantısı, modal içinde henüz kaydetmediğin değişiklikleri ve dil seçimini de yansıtır.",
    copied: "Panoya kopyalandı",
    manualCopy: "Panoya erişim yok, URL'yi elle kopyalayabilirsin",
    copyError: "Kopyalama başarısız oldu",
    urlReady: "URL hazır",
    reset: "Resetle",
    cancel: "İptal",
    save: "Kaydet",
    closeSettings: "Ayarları kapat",
  },
  en: {
    tabs: { streams: "Streams", share: "Share" },
    themes: { dark: "Dark", light: "Light" },
    settingsButton: "Settings",
    controlCenter: "Control Center",
    settingsTitle: "Settings",
    settingsDescription: "Manage stream titles, theme, language, and the share link from one panel.",
    themeTitle: "Theme",
    themeDescription: "Switch between light and dark appearance.",
    languageTitle: "Language",
    languageDescription: "Change the interface language.",
    activeSlotCount: "Active slot count",
    activeSlotDescription: "The first {count} slots are editable.",
    streamLabel: "Stream {index}",
    inactive: "Inactive",
    active: "Active",
    videoSlug: "Video Slug / ID",
    title: "Title",
    titlePlaceholder: "Stream title...",
    emptySlot: "Empty Slot",
    emptySlotDescription: "Add a YouTube stream ID from settings to fill this area.",
    selected: "Selected",
    liveStream: "Live Stream",
    slugHelpTitle: "How to find the slug?",
    slugHelpText: "Use the value in the YouTube link after",
    slugHelpText2: ". Embed format:",
    shareTitle: "Shareable view",
    shareDescription: "The current grid, selected theme, language, and all stream data are encoded into the URL. Anyone opening the link sees the same setup.",
    createShareUrl: "Create Share URL",
    generatedUrl: "Generated URL",
    shareHint: "The share link also includes unsaved changes and the selected language from the drawer.",
    copied: "Copied to clipboard",
    manualCopy: "Clipboard is unavailable, you can copy the URL manually",
    copyError: "Copy failed",
    urlReady: "URL ready",
    reset: "Reset",
    cancel: "Cancel",
    save: "Save",
    closeSettings: "Close settings",
  },
  de: {
    tabs: { streams: "Streams", share: "Teilen" },
    themes: { dark: "Dunkel", light: "Hell" },
    settingsButton: "Einstellungen",
    controlCenter: "Kontrollzentrum",
    settingsTitle: "Einstellungen",
    settingsDescription: "Verwalte Stream-Titel, Thema, Sprache und den Freigabelink in einem Panel.",
    themeTitle: "Thema",
    themeDescription: "Zwischen hellem und dunklem Erscheinungsbild wechseln.",
    languageTitle: "Sprache",
    languageDescription: "Die Sprache der Oberflaeche aendern.",
    activeSlotCount: "Aktive Slot-Anzahl",
    activeSlotDescription: "Die ersten {count} Slots sind bearbeitbar.",
    streamLabel: "Stream {index}",
    inactive: "Inaktiv",
    active: "Aktiv",
    videoSlug: "Video-Slug / ID",
    title: "Titel",
    titlePlaceholder: "Stream-Titel...",
    emptySlot: "Leerer Slot",
    emptySlotDescription: "Fuege in den Einstellungen eine YouTube-Stream-ID hinzu, um diesen Bereich zu fuellen.",
    selected: "Ausgewahlt",
    liveStream: "Live-Stream",
    slugHelpTitle: "Wie findet man den Slug?",
    slugHelpText: "Verwende den Wert im YouTube-Link nach",
    slugHelpText2: ". Embed-Format:",
    shareTitle: "Teilbare Ansicht",
    shareDescription: "Das aktuelle Grid, das Thema, die Sprache und alle Stream-Daten werden in die URL kodiert. Jeder mit dem Link sieht dieselbe Konfiguration.",
    createShareUrl: "Freigabe-URL erstellen",
    generatedUrl: "Erzeugte URL",
    shareHint: "Der Freigabelink enthaelt auch ungespeicherte Aenderungen und die gewaehlte Sprache aus dem Drawer.",
    copied: "In die Zwischenablage kopiert",
    manualCopy: "Keine Zwischenablage verfuegbar, du kannst die URL manuell kopieren",
    copyError: "Kopieren fehlgeschlagen",
    urlReady: "URL bereit",
    reset: "Zuruecksetzen",
    cancel: "Abbrechen",
    save: "Speichern",
    closeSettings: "Einstellungen schliessen",
  },
  fr: {
    tabs: { streams: "Flux", share: "Partager" },
    themes: { dark: "Sombre", light: "Clair" },
    settingsButton: "Parametres",
    controlCenter: "Centre de controle",
    settingsTitle: "Parametres",
    settingsDescription: "Gerez les titres des flux, le theme, la langue et le lien de partage depuis un seul panneau.",
    themeTitle: "Theme",
    themeDescription: "Basculez entre l'apparence claire et sombre.",
    languageTitle: "Langue",
    languageDescription: "Changer la langue de l'interface.",
    activeSlotCount: "Nombre d'emplacements actifs",
    activeSlotDescription: "Les {count} premiers emplacements sont modifiables.",
    streamLabel: "Flux {index}",
    inactive: "Inactif",
    active: "Actif",
    videoSlug: "Slug video / ID",
    title: "Titre",
    titlePlaceholder: "Titre du flux...",
    emptySlot: "Emplacement vide",
    emptySlotDescription: "Ajoutez un identifiant de flux YouTube dans les parametres pour remplir cette zone.",
    selected: "Selectionne",
    liveStream: "En direct",
    slugHelpTitle: "Comment trouver le slug ?",
    slugHelpText: "Utilisez la valeur dans le lien YouTube apres",
    slugHelpText2: ". Format d'integration :",
    shareTitle: "Vue partageable",
    shareDescription: "La grille actuelle, le theme, la langue et toutes les donnees des flux sont encodes dans l'URL. Toute personne ouvrant le lien voit la meme configuration.",
    createShareUrl: "Creer l'URL de partage",
    generatedUrl: "URL generee",
    shareHint: "Le lien de partage inclut aussi les modifications non enregistrees et la langue choisie dans le panneau.",
    copied: "Copie dans le presse-papiers",
    manualCopy: "Le presse-papiers est indisponible, vous pouvez copier l'URL manuellement",
    copyError: "La copie a echoue",
    urlReady: "URL prete",
    reset: "Reinitialiser",
    cancel: "Annuler",
    save: "Enregistrer",
    closeSettings: "Fermer les parametres",
  },
  zh: {
    tabs: { streams: "直播源", share: "分享" },
    themes: { dark: "深色", light: "浅色" },
    settingsButton: "设置",
    controlCenter: "控制中心",
    settingsTitle: "设置",
    settingsDescription: "在一个面板中管理直播标题、主题、语言和分享链接。",
    themeTitle: "主题",
    themeDescription: "在浅色和深色外观之间切换。",
    languageTitle: "语言",
    languageDescription: "更改界面语言。",
    activeSlotCount: "活动槽位数量",
    activeSlotDescription: "前 {count} 个槽位可编辑。",
    streamLabel: "直播 {index}",
    inactive: "未启用",
    active: "启用中",
    videoSlug: "视频 Slug / ID",
    title: "标题",
    titlePlaceholder: "直播标题...",
    emptySlot: "空白槽位",
    emptySlotDescription: "在设置中添加一个 YouTube 直播 ID 来填充此区域。",
    selected: "已选中",
    liveStream: "直播中",
    slugHelpTitle: "如何找到 slug？",
    slugHelpText: "使用 YouTube 链接中",
    slugHelpText2: "后面的值。嵌入格式：",
    shareTitle: "可分享视图",
    shareDescription: "当前网格、主题、语言以及所有直播数据都会编码进 URL。任何打开该链接的人都会看到相同布局。",
    createShareUrl: "生成分享链接",
    generatedUrl: "生成的 URL",
    shareHint: "分享链接也会包含抽屉中尚未保存的更改以及所选语言。",
    copied: "已复制到剪贴板",
    manualCopy: "无法访问剪贴板，你可以手动复制该 URL",
    copyError: "复制失败",
    urlReady: "URL 已就绪",
    reset: "重置",
    cancel: "取消",
    save: "保存",
    closeSettings: "关闭设置",
  },
  ar: {
    tabs: { streams: "البثوث", share: "مشاركة" },
    themes: { dark: "داكن", light: "فاتح" },
    settingsButton: "الإعدادات",
    controlCenter: "مركز التحكم",
    settingsTitle: "الإعدادات",
    settingsDescription: "أدر عناوين البثوث والمظهر واللغة ورابط المشاركة من لوحة واحدة.",
    themeTitle: "المظهر",
    themeDescription: "بدّل بين الوضع الفاتح والداكن.",
    languageTitle: "اللغة",
    languageDescription: "غيّر لغة الواجهة.",
    activeSlotCount: "عدد الخانات النشطة",
    activeSlotDescription: "أول {count} خانات قابلة للتعديل.",
    streamLabel: "البث {index}",
    inactive: "غير نشط",
    active: "نشط",
    videoSlug: "معرّف / Slug الفيديو",
    title: "العنوان",
    titlePlaceholder: "عنوان البث...",
    emptySlot: "خانة فارغة",
    emptySlotDescription: "أضف معرّف بث YouTube من الإعدادات لملء هذه المساحة.",
    selected: "محدد",
    liveStream: "بث مباشر",
    slugHelpTitle: "كيف تجد الـ slug؟",
    slugHelpText: "استخدم القيمة الموجودة في رابط YouTube بعد",
    slugHelpText2: ". صيغة التضمين:",
    shareTitle: "عرض قابل للمشاركة",
    shareDescription: "يتم ترميز الشبكة الحالية والمظهر واللغة وكل بيانات البث داخل الرابط. أي شخص يفتح الرابط سيرى نفس الترتيب.",
    createShareUrl: "إنشاء رابط المشاركة",
    generatedUrl: "الرابط الناتج",
    shareHint: "رابط المشاركة يتضمن أيضاً التغييرات غير المحفوظة واللغة المختارة من اللوحة الجانبية.",
    copied: "تم النسخ إلى الحافظة",
    manualCopy: "الحافظة غير متاحة، يمكنك نسخ الرابط يدوياً",
    copyError: "فشل النسخ",
    urlReady: "الرابط جاهز",
    reset: "إعادة تعيين",
    cancel: "إلغاء",
    save: "حفظ",
    closeSettings: "إغلاق الإعدادات",
  },
};

function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

function getInitialTheme(ignoreStoredPreference = false) {
  if (typeof window === "undefined") return "dark";

  if (!ignoreStoredPreference) {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function getInitialLanguage(ignoreStoredPreference = false) {
  if (typeof window === "undefined") return "tr";

  if (!ignoreStoredPreference) {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (LANGUAGE_OPTIONS.some((option) => option.id === storedLanguage)) {
      return storedLanguage;
    }
  }

  const browserLanguage = window.navigator.language.slice(0, 2);
  return LANGUAGE_OPTIONS.some((option) => option.id === browserLanguage) ? browserLanguage : "tr";
}

function getStoredAppState() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(APP_STATE_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.s)) return null;

    return {
      gridCount: GRID_OPTIONS.some((option) => option.count === parsed.g) ? parsed.g : GRID_OPTIONS[1].count,
      streams: parsed.s.map((stream) => ({
        slug: typeof stream?.slug === "string" ? stream.slug : "",
        title: typeof stream?.title === "string" ? stream.title : "",
      })),
      theme: parsed.m === "light" || parsed.m === "dark" ? parsed.m : null,
      language: LANGUAGE_OPTIONS.some((option) => option.id === parsed.l) ? parsed.l : null,
    };
  } catch {
    return null;
  }
}

function translate(language, key, params = {}) {
  const messages = TRANSLATIONS[language] || TRANSLATIONS.tr;
  const fallback = TRANSLATIONS.tr;
  const value = key.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), messages)
    ?? key.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), fallback)
    ?? key;

  return typeof value === "string"
    ? value.replace(/\{(\w+)\}/g, (_, param) => params[param] ?? `{${param}}`)
    : value;
}

function GridSVG({ cols, rows, size = 22, className = "" }) {
  const gap = 2.5;
  const cellW = (size - gap * (cols - 1)) / cols;
  const cellH = (size - gap * (rows - 1)) / rows;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ display: "block" }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        return (
          <rect
            key={i}
            x={c * (cellW + gap)}
            y={r * (cellH + gap)}
            width={cellW}
            height={cellH}
            rx={1}
            fill="currentColor"
          />
        );
      })}
    </svg>
  );
}

function encodeState(streams, gridCount, theme, language) {
  try {
    const d = { g: gridCount, s: streams.map((s) => ({ k: s.slug, t: s.title })), m: theme, l: language };
    return btoa(unescape(encodeURIComponent(JSON.stringify(d))));
  } catch {
    return "";
  }
}

function decodeState(enc) {
  try {
    const d = JSON.parse(decodeURIComponent(escape(atob(enc))));
    return {
      gridCount: d.g,
      streams: d.s.map((s) => ({ slug: s.k, title: s.t })),
      theme: d.m === "light" || d.m === "dark" ? d.m : null,
      language: LANGUAGE_OPTIONS.some((option) => option.id === d.l) ? d.l : null,
    };
  } catch {
    return null;
  }
}

function stripShareConfigFromUrl() {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  if (!url.searchParams.has("cfg")) return;

  url.searchParams.delete("cfg");
  const nextSearch = url.searchParams.toString();
  const nextUrl = `${url.pathname}${nextSearch ? `?${nextSearch}` : ""}${url.hash}`;
  window.history.replaceState({}, "", nextUrl);
}

function getDefaultAppConfig() {
  return {
    theme: getInitialTheme(true),
    language: getInitialLanguage(true),
    gridOption: GRID_OPTIONS[1],
    gridCount: GRID_OPTIONS[1].count,
    streams: DEFAULT_STREAMS.map((stream) => ({ ...stream })),
  };
}

function getInitialAppConfig() {
  const defaultConfig = getDefaultAppConfig();
  const baseTheme = getInitialTheme();
  const baseLanguage = getInitialLanguage();

  if (typeof window === "undefined") {
    return defaultConfig;
  }

  const params = new URLSearchParams(window.location.search);
  const cfg = params.get("cfg");
  const decoded = cfg ? decodeState(cfg) : getStoredAppState();

  if (!decoded) {
    return {
      theme: baseTheme,
      language: baseLanguage,
      gridOption: defaultConfig.gridOption,
      gridCount: defaultConfig.gridCount,
      streams: defaultConfig.streams.map((stream) => ({ ...stream })),
    };
  }

  const gridOption = GRID_OPTIONS.find((option) => option.count === decoded.gridCount) || GRID_OPTIONS[1];
  const streams = decoded.streams.map((stream) => ({
    slug: typeof stream?.slug === "string" ? stream.slug : "",
    title: typeof stream?.title === "string" ? stream.title : "",
  }));

  return {
    theme: decoded.theme || baseTheme,
    language: decoded.language || baseLanguage,
    gridOption,
    gridCount: gridOption.count,
    streams,
  };
}

function getGridMetrics(width, height, cols, rows, gap, preferFullWidth = false) {
  if (!width || !height) {
    return { tileWidth: 0, tileHeight: 0, gridWidth: 0, gridHeight: 0 };
  }

  if (preferFullWidth) {
    const tileWidth = width;
    const tileHeight = tileWidth / VIDEO_RATIO;

    return {
      tileWidth,
      tileHeight,
      gridWidth: tileWidth * cols + gap * (cols - 1),
      gridHeight: tileHeight * rows + gap * (rows - 1),
    };
  }

  const maxTileHeight = (height - gap * (rows - 1)) / rows;
  const heightLimitedTileWidth = maxTileHeight * VIDEO_RATIO;
  const totalWidthFromHeight = heightLimitedTileWidth * cols + gap * (cols - 1);

  let tileWidth;
  let tileHeight;

  if (totalWidthFromHeight <= width) {
    tileHeight = maxTileHeight;
    tileWidth = heightLimitedTileWidth;
  } else {
    tileWidth = (width - gap * (cols - 1)) / cols;
    tileHeight = tileWidth / VIDEO_RATIO;
  }

  return {
    tileWidth,
    tileHeight,
    gridWidth: tileWidth * cols + gap * (cols - 1),
    gridHeight: tileHeight * rows + gap * (rows - 1),
  };
}

function getResponsiveGridLayout(option, width) {
  if (!option) return { cols: 1, rows: 1 };

  let maxCols = option.cols;

  if (width < 640) {
    maxCols = 1;
  } else if (width < 1100) {
    maxCols = Math.min(option.cols, 3);
  }

  const cols = Math.max(1, Math.min(maxCols, option.count));
  const rows = Math.ceil(option.count / cols);

  return { cols, rows };
}

export default function App() {
  const initialAppConfigRef = useRef(getInitialAppConfig());
  const initialAppConfig = initialAppConfigRef.current;
  const [theme, setTheme] = useState(initialAppConfig.theme);
  const [language, setLanguage] = useState(initialAppConfig.language);
  const [gridOption, setGridOption] = useState(initialAppConfig.gridOption);
  const [streams, setStreams] = useState(initialAppConfig.streams);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editStreams, setEditStreams] = useState(() => initialAppConfig.streams.map((stream) => ({ ...stream })));
  const [editGridCount, setEditGridCount] = useState(initialAppConfig.gridCount);
  const [editTheme, setEditTheme] = useState(initialAppConfig.theme);
  const [editLanguage, setEditLanguage] = useState(initialAppConfig.language);
  const [focusedIdx, setFocusedIdx] = useState(null);
  const [activeTab, setActiveTab] = useState("streams");
  const [shareUrl, setShareUrl] = useState("");
  const [shareStatus, setShareStatus] = useState("idle");
  const copyTimer = useRef(null);
  const settingsTimerRef = useRef(null);
  const gridAreaRef = useRef(null);
  const [gridAreaSize, setGridAreaSize] = useState(() => ({
    width: typeof window === "undefined" ? 0 : Math.max(window.innerWidth - 24, 0),
    height: typeof window === "undefined" ? 0 : Math.max(window.innerHeight - 160, 0),
  }));

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = RTL_LANGUAGES.has(language) ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    window.localStorage.setItem(
      APP_STATE_STORAGE_KEY,
      JSON.stringify({
        g: gridOption.count,
        s: streams,
        m: theme,
        l: language,
      })
    );
  }, [gridOption.count, streams, theme, language]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentCfg = params.get("cfg");
    if (!currentCfg) return;

    const activeConfig = encodeState(
      streams.slice(0, gridOption.count).map((stream) => ({
        slug: stream.slug.trim(),
        title: stream.title.trim(),
      })),
      gridOption.count,
      theme,
      language
    );

    if (currentCfg !== activeConfig) {
      stripShareConfigFromUrl();
    }
  }, [gridOption.count, streams, theme, language]);

  useEffect(
    () => () => {
      clearTimeout(copyTimer.current);
      clearTimeout(settingsTimerRef.current);
    },
    []
  );

  useEffect(() => {
    const node = gridAreaRef.current;
    if (!node) return undefined;

    const updateSize = () => {
      const nextWidth = node.clientWidth || Math.max(window.innerWidth - 24, 0);
      const nextHeight = node.clientHeight || Math.max(window.innerHeight - 160, 0);
      setGridAreaSize({ width: nextWidth, height: nextHeight });
    };

    updateSize();

    let observer;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(updateSize);
      observer.observe(node);
    }

    window.addEventListener("resize", updateSize);

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  const normalizedStreams = [...streams];
  while (normalizedStreams.length < gridOption.count) {
    normalizedStreams.push({ slug: "", title: "" });
  }
  const activeStreams = normalizedStreams.slice(0, gridOption.count);
  const activeTheme = showSettings ? editTheme : theme;
  const activeLanguage = showSettings ? editLanguage : language;
  const isRtl = RTL_LANGUAGES.has(activeLanguage);
  const isLightTheme = activeTheme === "light";
  const responsiveGrid = getResponsiveGridLayout(gridOption, gridAreaSize.width);
  const isMobileSingleColumn = gridAreaSize.width < 640 && responsiveGrid.cols === 1;
  const gridGap = 0;
  const availableGridWidth = Math.max(gridAreaSize.width - GRID_SAFE_INSET * 2, 0);
  const availableGridHeight = Math.max(gridAreaSize.height - GRID_SAFE_INSET * 2, 0);
  const gridMetrics = getGridMetrics(
    availableGridWidth,
    availableGridHeight,
    responsiveGrid.cols,
    responsiveGrid.rows,
    gridGap,
    isMobileSingleColumn
  );
  const themeStyles = isLightTheme
    ? {
        root: "bg-slate-100 text-slate-900",
        mesh: "bg-mesh-light",
        gridPattern: "opacity-40",
        glowA: "bg-sky-300/30",
        glowB: "bg-cyan-300/20",
        glowC: "bg-indigo-300/20",
        header: "border-slate-200/80 bg-white/72 backdrop-blur-xl",
        toolbar: "border-slate-200/80 bg-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]",
        toolbarActive: "bg-slate-900 text-white shadow-lg shadow-slate-300/40",
        toolbarInactive: "text-slate-600 hover:bg-slate-900/6 hover:text-slate-900",
        settingsButton: "border-sky-300/40 bg-sky-500/10 text-sky-900 shadow-[0_20px_60px_-36px_rgba(14,165,233,0.45)] hover:bg-sky-500/18",
        liveBadge: "border-sky-300/35 bg-white/80 text-sky-700 shadow-[0_16px_40px_-28px_rgba(14,165,233,0.35)]",
        brandKicker: "text-sky-700/75",
        mainCopy: "text-slate-600",
        cardDefault: "border-slate-200 bg-white/78 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.28)] hover:border-sky-300/45 hover:shadow-[0_22px_44px_-30px_rgba(14,165,233,0.2)]",
        cardFocused: "border-sky-400/60 ring-1 ring-sky-300/50 shadow-[0_20px_46px_-28px_rgba(14,165,233,0.34)]",
        cardTint: "from-sky-200/40 via-white/20 to-cyan-300/10",
        cardShade: "from-white/5 via-transparent to-slate-100/70",
        emptyState: "bg-white/75 text-slate-500",
        emptyIcon: "border-slate-300/70 bg-white/80",
        indexBadge: "border-slate-200/90 bg-white/85 text-slate-600",
        selectedBadge: "border-sky-300/40 bg-sky-500/14 text-sky-800",
        titleKicker: "text-sky-700/80",
        titleText: "text-slate-900",
        drawerBackdrop: "bg-slate-900/30 opacity-100 backdrop-blur-sm",
        drawerPanel: "border-slate-200/80 bg-white/64 backdrop-blur-2xl shadow-2xl shadow-slate-300/30 ring-1 ring-white/60",
        drawerGradient: "from-white/55 via-slate-50/40 to-slate-100/72",
        drawerEdge: "from-sky-300/50 via-slate-300/40 to-transparent",
        drawerHeader: "border-slate-200/80 bg-white/36 backdrop-blur-xl",
        drawerText: "text-slate-600",
        closeButton: "border-slate-200/80 bg-white/70 text-slate-600 hover:bg-white hover:text-slate-900",
        tabActive: "bg-slate-900 text-white shadow-lg shadow-slate-300/35",
        tabInactive: "bg-white/45 text-slate-600 hover:bg-white/70 hover:text-slate-900",
        drawerBody: "bg-white/8 backdrop-blur-lg",
        surface: "border-slate-200/80 bg-white/56 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]",
        surfaceMuted: "text-slate-600",
        surfaceInput: "bg-white/78 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white",
        optionInactive: "border-slate-200/80 bg-white/55 text-slate-700 hover:border-sky-300/40 hover:bg-white/78 hover:text-slate-900",
        shareUrlBox: "border-slate-200/80 bg-white/70 text-slate-700",
        footerBar: "border-slate-200/80 bg-white/38 backdrop-blur-xl",
        secondaryButton: "border-slate-200/80 bg-white/60 text-slate-700 hover:bg-white hover:text-slate-900",
        primaryButton: "bg-slate-900 text-white hover:bg-sky-700",
        statusIdle: "bg-slate-900/6 text-slate-600",
      }
    : {
        root: "bg-slate-950 text-slate-100",
        mesh: "bg-mesh",
        gridPattern: "opacity-30",
        glowA: "bg-cyan-400/15",
        glowB: "bg-sky-500/10",
        glowC: "bg-blue-500/10",
        header: "border-white/10 bg-slate-950/75 backdrop-blur-xl",
        toolbar: "border-white/10 bg-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
        toolbarActive: "bg-white text-slate-950 shadow-lg shadow-cyan-950/15",
        toolbarInactive: "text-slate-400 hover:bg-white/10 hover:text-white",
        settingsButton: "border-cyan-300/20 bg-cyan-400/10 text-cyan-100 shadow-glow hover:bg-cyan-300/20",
        liveBadge: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200 shadow-glow",
        brandKicker: "text-cyan-200/70",
        mainCopy: "text-slate-400",
        cardDefault: "border-white/10 bg-slate-900/80 hover:border-cyan-300/40 hover:shadow-[0_16px_36px_-30px_rgba(15,23,42,0.9)]",
        cardFocused: "border-cyan-300/70 ring-1 ring-cyan-300/40 shadow-[0_18px_44px_-28px_rgba(34,211,238,0.45)]",
        cardTint: "from-white/5 via-white/0 to-cyan-300/10",
        cardShade: "from-slate-950/70 via-transparent to-transparent",
        emptyState: "bg-slate-900/80 text-slate-500",
        emptyIcon: "border-white/10 bg-white/5",
        indexBadge: "border-white/10 bg-slate-950/70 text-slate-300",
        selectedBadge: "border-cyan-300/20 bg-cyan-300/15 text-cyan-100",
        titleKicker: "text-cyan-200/70",
        titleText: "text-white",
        drawerBackdrop: "bg-slate-950/72 opacity-100 backdrop-blur-md",
        drawerPanel: "border-white/10 bg-slate-950/62 backdrop-blur-2xl shadow-2xl shadow-cyan-950/30 ring-1 ring-white/10",
        drawerGradient: "from-slate-900/36 via-slate-950/44 to-slate-950/68",
        drawerEdge: "from-cyan-300/30 via-white/10 to-transparent",
        drawerHeader: "border-white/10 bg-slate-950/22 backdrop-blur-xl",
        drawerText: "text-slate-300",
        closeButton: "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white",
        tabActive: "bg-white text-slate-950 shadow-lg shadow-cyan-950/10",
        tabInactive: "bg-white/10 text-slate-200 hover:bg-white/15 hover:text-white",
        drawerBody: "bg-slate-950/10 backdrop-blur-lg",
        surface: "border-white/10 bg-black/25 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
        surfaceMuted: "text-slate-300",
        surfaceInput: "bg-black/40 border-white/10 text-slate-100 placeholder:text-slate-400 focus:bg-black/55",
        optionInactive: "border-white/10 bg-white/5 text-slate-200 hover:border-cyan-300/30 hover:bg-white/10 hover:text-white",
        shareUrlBox: "border-white/10 bg-slate-950/52 text-slate-200",
        footerBar: "border-white/10 bg-slate-950/28 backdrop-blur-xl",
        secondaryButton: "border-white/10 bg-white/10 text-slate-200 hover:bg-white/15 hover:text-white",
        primaryButton: "bg-white text-slate-950 hover:bg-cyan-100",
        statusIdle: "bg-white/5 text-slate-400",
      };

  const openSettings = () => {
    const padded = [...streams];
    while (padded.length < MAX_STREAMS) padded.push({ slug: "", title: "" });
    setEditStreams(padded);
    setEditGridCount(gridOption.count);
    setEditTheme(theme);
    setEditLanguage(language);
    setShareUrl("");
    setShareStatus("idle");
    setActiveTab("streams");
    clearTimeout(settingsTimerRef.current);
    setShowSettings(true);
    requestAnimationFrame(() => setSettingsOpen(true));
  };

  const closeSettings = () => {
    clearTimeout(settingsTimerRef.current);
    setSettingsOpen(false);
    settingsTimerRef.current = setTimeout(() => {
      setShowSettings(false);
    }, SETTINGS_TRANSITION_MS);
  };

  const updateGridCount = (count) => {
    const opt = GRID_OPTIONS.find((option) => option.count === count) || GRID_OPTIONS[0];
    setEditGridCount(opt.count);
    setGridOption(opt);
    setFocusedIdx(null);
  };

  const updateTheme = (nextTheme) => {
    setEditTheme(nextTheme);
    setTheme(nextTheme);
  };

  const updateLanguage = (nextLanguage) => {
    setEditLanguage(nextLanguage);
    setLanguage(nextLanguage);
  };

  const updateField = (idx, field, val) => {
    const next = [...editStreams];
    next[idx] = { ...next[idx], [field]: val };
    setEditStreams(next);
    setStreams(next.map((stream) => ({ ...stream })));
  };

  const handleShare = () => {
    const validStreams = editStreams.slice(0, editGridCount).map((stream) => ({
      slug: stream.slug.trim(),
      title: stream.title.trim(),
    }));
    const url = window.location.href.split("?")[0] + "?cfg=" + encodeState(validStreams, editGridCount, editTheme, editLanguage);
    setShareUrl(url);
    clearTimeout(copyTimer.current);

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setShareStatus("copied");
          copyTimer.current = setTimeout(() => setShareStatus("idle"), 2500);
        })
        .catch(() => {
          setShareStatus("error");
        });
      return;
    }

    setShareStatus("manual");
  };

  const handleReset = () => {
    const defaults = getDefaultAppConfig();
    stripShareConfigFromUrl();
    window.localStorage.removeItem(APP_STATE_STORAGE_KEY);
    window.localStorage.removeItem(THEME_STORAGE_KEY);
    window.localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    setTheme(defaults.theme);
    setLanguage(defaults.language);
    setGridOption(defaults.gridOption);
    setStreams(defaults.streams.map((stream) => ({ ...stream })));
    setEditTheme(defaults.theme);
    setEditLanguage(defaults.language);
    setEditGridCount(defaults.gridCount);
    setEditStreams(defaults.streams.map((stream) => ({ ...stream })));
    setShareUrl("");
    setShareStatus("idle");
    setFocusedIdx(null);
    setActiveTab("streams");
  };

  const t = (key, params) => translate(activeLanguage, key, params);

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={cn("relative h-screen overflow-hidden", themeStyles.root, activeTheme === "light" ? "theme-light" : "theme-dark")}
    >
      <div className={cn("absolute inset-0", themeStyles.mesh)} />
      <div className={cn("absolute inset-0 panel-grid", themeStyles.gridPattern)} />
      <div className={cn("absolute -left-24 top-8 h-72 w-72 rounded-full blur-3xl", themeStyles.glowA)} />
      <div className={cn("absolute right-0 top-0 h-96 w-96 rounded-full blur-3xl", themeStyles.glowB)} />
      <div className={cn("absolute bottom-0 left-1/3 h-80 w-80 rounded-full blur-3xl", themeStyles.glowC)} />

      <div className="relative flex h-full flex-col overflow-hidden">
        <header className={themeStyles.header}>
          <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className={cn("relative flex h-11 w-11 items-center justify-center rounded-2xl", themeStyles.liveBadge)}>
                  <div className="absolute h-3 w-3 rounded-full bg-rose-400 animate-pulse-soft" />
                  <div className="h-3 w-3 rounded-full bg-rose-400" />
                </div>
                <div>
                  <p className={cn("text-xs font-semibold uppercase tracking-[0.35em]", themeStyles.brandKicker)}>
                    Live Control Deck
                  </p>
                  <h1 className={cn("mt-1 text-2xl font-semibold tracking-tight", themeStyles.titleText)}>
                    MultiTV
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
              <div className={cn("inline-flex flex-wrap items-center gap-2 rounded-2xl border p-2", themeStyles.toolbar)}>
                {GRID_OPTIONS.map((opt) => {
                  const active = gridOption.count === opt.count;
                  return (
                    <button
                      key={opt.count}
                      onClick={() => {
                        setGridOption(opt);
                        setFocusedIdx(null);
                      }}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition duration-200",
                        active ? themeStyles.toolbarActive : themeStyles.toolbarInactive
                      )}
                    >
                      <GridSVG cols={opt.cols} rows={opt.rows} size={18} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={openSettings}
                className={cn("inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition duration-200 hover:-translate-y-0.5", themeStyles.settingsButton)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                {t("settingsButton")}
              </button>
            </div>
          </div>
        </header>

        <main
          ref={gridAreaRef}
          className={cn(
            "flex-1 min-h-0 p-3 sm:p-4 lg:p-5",
            isMobileSingleColumn ? "overflow-y-auto overflow-x-hidden" : "overflow-hidden"
          )}
        >
          <div
            className={cn(
              "mx-auto flex w-full justify-center overflow-visible p-4 sm:p-5",
              isMobileSingleColumn ? "min-h-full items-start" : "h-full items-center"
            )}
          >
            <div
              className="grid shrink-0 overflow-visible"
              style={{
                width: `${gridMetrics.gridWidth}px`,
                height: `${gridMetrics.gridHeight}px`,
                gap: `${gridGap}px`,
                gridTemplateColumns: `repeat(${responsiveGrid.cols}, ${gridMetrics.tileWidth}px)`,
                gridTemplateRows: `repeat(${responsiveGrid.rows}, ${gridMetrics.tileHeight}px)`,
              }}
            >
            {activeStreams.map((stream, idx) => {
              const isFocused = focusedIdx === idx;

              return (
                <button
                  key={`${stream.slug}-${idx}`}
                  type="button"
                  onClick={() => setFocusedIdx(isFocused ? null : idx)}
                  className={cn(
                    "group relative isolate h-full w-full min-h-0 overflow-hidden rounded-none text-left transition duration-300",
                    isFocused ? themeStyles.cardFocused : themeStyles.cardDefault
                  )}
                >
                  <div className={cn("absolute inset-0 bg-gradient-to-br opacity-80", themeStyles.cardTint)} />
                  <div className={cn("absolute inset-0 bg-gradient-to-t", themeStyles.cardShade)} />

                  {stream.slug ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${stream.slug}?autoplay=1&mute=1`}
                      className="relative z-0 h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={stream.title || `Stream ${idx + 1}`}
                    />
                  ) : (
                    <div className={cn("relative z-10 flex h-full flex-col items-center justify-center gap-4 px-6 text-center", themeStyles.emptyState)}>
                      <div className={cn("flex h-16 w-16 animate-float items-center justify-center rounded-2xl border border-dashed", themeStyles.emptyIcon)}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="2" y="3" width="20" height="14" rx="2" />
                          <path d="M8 21h8M12 17v4" />
                        </svg>
                      </div>
                      <div>
                        <div className={cn("text-sm font-semibold uppercase tracking-[0.28em]", themeStyles.surfaceMuted)}>
                          {t("emptySlot")}
                        </div>
                        <p className={cn("mt-2 text-sm leading-6", themeStyles.surfaceMuted)}>
                          {t("emptySlotDescription")}
                        </p>
                      </div>
                    </div>
                  )}

                  {isFocused && (
                    <div className={cn("pointer-events-none absolute right-4 top-4 z-20 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] backdrop-blur-md", themeStyles.selectedBadge)}>
                      {t("selected")}
                    </div>
                  )}

                  {stream.title && (
                    <div className={cn("pointer-events-none absolute inset-x-0 bottom-0 z-20 translate-y-3 bg-gradient-to-t px-4 pb-4 pt-12 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100", isLightTheme ? "from-white via-white/82 to-transparent" : "from-slate-950 via-slate-950/75 to-transparent")}>
                      <p className={cn("text-xs font-medium uppercase tracking-[0.22em]", themeStyles.titleKicker)}>
                        {t("liveStream")}
                      </p>
                      <p className={cn("mt-2 text-base font-semibold", themeStyles.titleText)}>{stream.title}</p>
                    </div>
                  )}
                </button>
              );
            })}
            </div>
          </div>
        </main>

        {showSettings && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <button
              type="button"
              aria-label={t("closeSettings")}
              onClick={closeSettings}
              className={cn(
                "absolute inset-0 transition duration-300",
                settingsOpen ? themeStyles.drawerBackdrop : "bg-slate-950/0 opacity-0"
              )}
            />

            <aside
              className={`absolute inset-y-0 right-0 w-full max-w-3xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                settingsOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
              }`}
            >
              <div className={cn("relative flex h-full w-full flex-col overflow-hidden sm:rounded-l-[32px]", themeStyles.drawerPanel)}>
                <div className={cn("absolute inset-0 bg-gradient-to-b", themeStyles.drawerGradient)} />
                <div className={cn("absolute inset-y-0 left-0 w-px bg-gradient-to-b", themeStyles.drawerEdge)} />

                <div className={cn("relative px-5 pb-5 pt-6 sm:px-7", themeStyles.drawerHeader)}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className={cn("text-xs font-semibold uppercase tracking-[0.35em]", themeStyles.brandKicker)}>
                        {t("controlCenter")}
                      </p>
                      <h2 className={cn("mt-2 text-2xl font-semibold tracking-tight", themeStyles.titleText)}>{t("settingsTitle")}</h2>
                      <p className={cn("mt-2 max-w-2xl text-sm leading-6", themeStyles.drawerText)}>
                        {t("settingsDescription")}
                      </p>
                    </div>

                    <button
                      onClick={closeSettings}
                      className={cn("inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition", themeStyles.closeButton)}
                    >
                      <span className="text-xl leading-none">×</span>
                    </button>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {SETTINGS_TABS.map((tab) => {
                      const active = activeTab === tab;
                      return (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={cn(
                            "rounded-full px-4 py-2 text-sm font-medium transition",
                            active ? themeStyles.tabActive : themeStyles.tabInactive
                          )}
                        >
                          {t(`tabs.${tab}`)}
                        </button>
                      );
                    })}
                  </div>

                  <div className={cn("mt-5 flex flex-wrap items-center gap-3 rounded-[24px] border p-4 justify-between", themeStyles.surface)}>
                    <div className="min-w-[140px]">
                      <p className={cn("text-sm font-semibold", themeStyles.titleText)}>{t("themeTitle")}</p>
                      <p className={cn("mt-1 text-sm", themeStyles.surfaceMuted)}>
                        {t("themeDescription")}
                      </p>
                    </div>
                    <div className={cn("inline-flex flex-wrap items-center gap-2 rounded-full border p-1.5", themeStyles.toolbar)}>
                      {THEME_OPTIONS.map((option) => {
                        const active = editTheme === option.id;
                        return (
                          <button
                            key={option.id}
                            onClick={() => updateTheme(option.id)}
                            className={cn(
                              "rounded-full px-4 py-2 text-sm font-medium transition",
                              active ? themeStyles.tabActive : themeStyles.tabInactive
                            )}
                          >
                            {t(`themes.${option.id}`)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className={cn("mt-4 flex flex-wrap items-center gap-3 rounded-[24px] border p-4 justify-between", themeStyles.surface)}>
                    <div className="min-w-[140px]">
                      <p className={cn("text-sm font-semibold", themeStyles.titleText)}>{t("languageTitle")}</p>
                      <p className={cn("mt-1 text-sm", themeStyles.surfaceMuted)}>
                        {t("languageDescription")}
                      </p>
                    </div>
                    <div className={cn("flex flex-wrap items-center gap-2 rounded-[20px] border p-1.5", themeStyles.toolbar)}>
                      {LANGUAGE_OPTIONS.map((option) => {
                        const active = editLanguage === option.id;
                        return (
                          <button
                            key={option.id}
                            onClick={() => updateLanguage(option.id)}
                            className={cn(
                              "rounded-full px-4 py-2 text-sm font-medium transition",
                              active ? themeStyles.tabActive : themeStyles.tabInactive
                            )}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className={cn("relative flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6", themeStyles.drawerBody)}>
                {activeTab === "streams" && (
                  <div className="space-y-5">
                    <div className={cn("rounded-[28px] border p-4 sm:p-5", themeStyles.surface)}>
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className={cn("text-sm font-semibold", themeStyles.titleText)}>{t("activeSlotCount")}</p>
                          <p className={cn("mt-1 text-sm", themeStyles.surfaceMuted)}>
                            {t("activeSlotDescription", { count: editGridCount })}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {GRID_OPTIONS.map((opt) => {
                            const active = editGridCount === opt.count;
                            return (
                              <button
                                key={opt.count}
                                onClick={() => updateGridCount(opt.count)}
                                className={cn(
                                  "rounded-full px-4 py-2 text-sm font-medium transition",
                                  active ? "bg-cyan-300 text-slate-950" : themeStyles.optionInactive
                                )}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                      {Array.from({ length: MAX_STREAMS }).map((_, idx) => {
                        const dim = idx >= editGridCount;

                        return (
                          <div
                            key={idx}
                            className={cn("rounded-[24px] border p-4 transition", themeStyles.surface, dim ? "opacity-40" : "opacity-100")}
                          >
                            <div className="mb-4 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl border font-mono text-xs font-semibold tracking-[0.25em]", isLightTheme ? "border-slate-200/80 bg-white/80 text-slate-600" : "border-white/10 bg-white/5 text-slate-300")}>
                                  {String(idx + 1).padStart(2, "0")}
                                </div>
                                <div>
                                  <p className={cn("text-sm font-semibold", themeStyles.titleText)}>{t("streamLabel", { index: idx + 1 })}</p>
                                  <p className={cn("text-xs uppercase tracking-[0.24em]", themeStyles.surfaceMuted)}>
                                    {dim ? t("inactive") : t("active")}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <label className="block">
                                <span className={cn("mb-2 block text-xs font-semibold uppercase tracking-[0.24em]", themeStyles.surfaceMuted)}>
                                  {t("videoSlug")}
                                </span>
                                <input
                                  value={editStreams[idx]?.slug || ""}
                                  onChange={(e) => updateField(idx, "slug", e.target.value)}
                                  placeholder="VideoSlug"
                                  disabled={dim}
                                  className={cn("w-full appearance-none rounded-2xl border px-4 py-3 font-mono text-sm caret-cyan-200 outline-none transition focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/20 disabled:cursor-not-allowed", themeStyles.surfaceInput)}
                                />
                              </label>

                              <label className="block">
                                <span className={cn("mb-2 block text-xs font-semibold uppercase tracking-[0.24em]", themeStyles.surfaceMuted)}>
                                  {t("title")}
                                </span>
                                <input
                                  value={editStreams[idx]?.title || ""}
                                  onChange={(e) => updateField(idx, "title", e.target.value)}
                                  placeholder={t("titlePlaceholder")}
                                  disabled={dim}
                                  className={cn("w-full appearance-none rounded-2xl border px-4 py-3 text-sm caret-cyan-200 outline-none transition focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/20 disabled:cursor-not-allowed", themeStyles.surfaceInput)}
                                />
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className={cn("rounded-[24px] border p-4 text-sm leading-6 backdrop-blur-xl", themeStyles.surface, isLightTheme ? "text-slate-700" : "text-slate-200")}>
                      <span className={cn("font-semibold", themeStyles.titleText)}>{t("slugHelpTitle")}</span> {t("slugHelpText")}
                      <span className="mx-1 rounded bg-white/10 px-2 py-1 font-mono text-xs text-cyan-100">
                        watch?v=VideoSlug
                      </span>
                      {t("slugHelpText2")}
                      <span className="ml-1 rounded bg-white/10 px-2 py-1 font-mono text-xs text-cyan-100">
                        youtube.com/embed/{"{slug}"}
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === "share" && (
                  <div className="space-y-5">
                    <div className={cn("rounded-[28px] border p-5 backdrop-blur-xl", themeStyles.surface)}>
                      <p className={cn("text-lg font-semibold", themeStyles.titleText)}>{t("shareTitle")}</p>
                      <p className={cn("mt-2 max-w-2xl text-sm leading-6", themeStyles.surfaceMuted)}>
                        {t("shareDescription")}
                      </p>

                      <button
                        onClick={handleShare}
                        className={cn("mt-5 inline-flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5", themeStyles.primaryButton)}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <circle cx="18" cy="5" r="3" />
                          <circle cx="6" cy="12" r="3" />
                          <circle cx="18" cy="19" r="3" />
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                        {t("createShareUrl")}
                      </button>
                    </div>

                    {shareUrl && (
                      <div className={cn("rounded-[28px] border p-5 backdrop-blur-xl", themeStyles.surface)}>
                        <p className={cn("text-xs font-semibold uppercase tracking-[0.28em]", themeStyles.surfaceMuted)}>
                          {t("generatedUrl")}
                        </p>
                        <div className={cn("mt-4 rounded-2xl border p-4 font-mono text-sm leading-7 break-all", themeStyles.shareUrlBox)}>
                          {shareUrl}
                        </div>
                        <div
                          className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                            shareStatus === "copied"
                              ? "bg-emerald-400/10 text-emerald-300"
                              : shareStatus === "error"
                                ? "bg-rose-400/10 text-rose-300"
                                : themeStyles.statusIdle
                          }`}
                        >
                          {shareStatus === "copied" && (
                            <>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              {t("copied")}
                            </>
                          )}
                          {shareStatus === "manual" && (
                            <>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                              {t("manualCopy")}
                            </>
                          )}
                          {shareStatus === "error" && (
                            <>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                              </svg>
                              {t("copyError")}
                            </>
                          )}
                          {shareStatus === "idle" && (
                            <>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2v20M2 12h20" />
                              </svg>
                              {t("urlReady")}
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    <div className={cn("rounded-[24px] border p-4 text-sm leading-6 backdrop-blur-xl", themeStyles.surface, isLightTheme ? "text-amber-900" : "text-amber-100/85")}>
                      {t("shareHint")}
                    </div>
                  </div>
                )}
                </div>

                <div className={cn("flex flex-col-reverse gap-3 px-5 py-4 sm:flex-row sm:justify-end sm:px-7", themeStyles.footerBar)}>
                  <button
                    onClick={handleReset}
                    className={cn("rounded-2xl border px-5 py-3 text-sm font-semibold transition", themeStyles.secondaryButton)}
                  >
                    {t("reset")}
                  </button>
                  <button
                    onClick={closeSettings}
                    className={cn("rounded-2xl border px-5 py-3 text-sm font-semibold transition", themeStyles.secondaryButton)}
                  >
                    {t("closeSettings")}
                  </button>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
