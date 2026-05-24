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
const SETTINGS_TRANSITION_MS = 320;
const APP_STATE_STORAGE_KEY = "multi-tv-state";
const THEME_STORAGE_KEY = "multi-tv-theme";
const LANGUAGE_STORAGE_KEY = "multi-tv-language";
const ANNOUNCEMENT_STORAGE_KEY = "multi-tv-announcement-seen";
const RTL_LANGUAGES = new Set(["ar"]);
const DEFAULT_USERNAME = "username";
const POPUP_MIN_WIDTH = 360;
const POPUP_MIN_HEIGHT = 240;
const POPUP_OFFSET_STEP = 28;

const TRANSLATIONS = {
  tr: {
    tabs: { streams: "Yayınlar", share: "Paylaş" },
    themes: { dark: "Koyu", light: "Açık" },
    settingsButton: "Ayarlar",
    controlCenter: "Kontrol Merkezi",
    settingsTitle: "Ayarlar",
    handleTitle: "Kullanıcı adı",
    handleDescription: "Header'da görünen @username alanını düzenle.",
    handleLabel: "Kullanıcı adı",
    handlePlaceholder: "username",
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
    liveStream: "Canlı Yayın",
    viewerCountText: "kanalını {viewerCount} kişi izliyor!",
    noViewersText: "şu an online değil!",
    announcementKicker: "Yenilik",
    announcementTitle: "MultiTV yenilendi",
    announcementDescription: "Username ile Kick entegrasyonu eklendi. Artık kullanıcı adını girerek canlı durumu, avatar ve izleyici bilgisini arayüzde görebilirsin. Yayınları sürükle bırak ile sıralama özelliği de eklendi.",
    announcementPrimary: "Tamam",
    dragStream: "Yayını sırala",
    slugHelpTitle: "Slug nasıl bulunur?",
    slugHelpText: "YouTube bağlantısındaki",
    slugHelpText2: "bölümündeki değeri girmen yeterli.",
    shareTitle: "Paylaşılabilir görünüm",
    shareDescription: "Mevcut grid yapısı, tema seçimi ve tüm yayın bilgileri URL içine kodlanır. Linki açan herkes aynı düzeni görür.",
    createShareUrl: "Paylaşım URL'si Oluştur",
    generatedUrl: "Oluşan URL",
    shareHint: "Paylaşım bağlantısı, modal içinde henüz kaydetmediğin değişiklikleri ve dil seçimini de yansıtır.",
    copied: "Panoya kopyalandı",
    manualCopy: "Panoya erişim yok, URL'yi elle kopyalayabilirsin",
    copyError: "Kopyalama başarısız oldu",
    urlReady: "URL hazır",
    openPopup: "Pencerede aç",
    closePopup: "Pencereyi kapat",
    reset: "Resetle",
    closeSettings: "Ayarları kapat",
  },
  en: {
    tabs: { streams: "Streams", share: "Share" },
    themes: { dark: "Dark", light: "Light" },
    settingsButton: "Settings",
    controlCenter: "Control Center",
    settingsTitle: "Settings",
    handleTitle: "Username",
    handleDescription: "Edit the @username text shown in the header.",
    handleLabel: "Username",
    handlePlaceholder: "username",
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
    liveStream: "Live Stream",
    viewerCountText: "has {viewerCount} viewers watching!",
    noViewersText: "is not online right now!",
    announcementKicker: "Update",
    announcementTitle: "MultiTV has been refreshed",
    announcementDescription: "Kick integration with username support has been added. Enter a username to see live status, avatar, and viewer details in the interface. You can also reorder streams with drag and drop.",
    announcementPrimary: "Got it",
    dragStream: "Reorder stream",
    slugHelpTitle: "How to find the slug?",
    slugHelpText: "Use the value in the YouTube link after",
    slugHelpText2: ".",
    shareTitle: "Shareable view",
    shareDescription: "The current grid, selected theme, language, and all stream data are encoded into the URL. Anyone opening the link sees the same setup.",
    createShareUrl: "Create Share URL",
    generatedUrl: "Generated URL",
    shareHint: "The share link also includes unsaved changes and the selected language from the drawer.",
    copied: "Copied to clipboard",
    manualCopy: "Clipboard is unavailable, you can copy the URL manually",
    copyError: "Copy failed",
    urlReady: "URL ready",
    openPopup: "Open in popup",
    closePopup: "Close popup",
    reset: "Reset",
    closeSettings: "Close settings",
  },
  de: {
    tabs: { streams: "Streams", share: "Teilen" },
    themes: { dark: "Dunkel", light: "Hell" },
    settingsButton: "Einstellungen",
    controlCenter: "Kontrollzentrum",
    settingsTitle: "Einstellungen",
    handleTitle: "Benutzername",
    handleDescription: "Bearbeite den im Header angezeigten @username-Text.",
    handleLabel: "Benutzername",
    handlePlaceholder: "username",
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
    liveStream: "Live-Stream",
    viewerCountText: "hat {viewerCount} Zuschauer!",
    noViewersText: "ist gerade nicht online!",
    announcementKicker: "Update",
    announcementTitle: "MultiTV wurde erneuert",
    announcementDescription: "Die Kick-Integration per Benutzername wurde hinzugefuegt. Gib einen Benutzernamen ein, um Live-Status, Avatar und Zuschauerzahl in der Oberflaeche zu sehen. Streams koennen jetzt auch per Drag-and-drop sortiert werden.",
    announcementPrimary: "Verstanden",
    dragStream: "Stream sortieren",
    slugHelpTitle: "Wie findet man den Slug?",
    slugHelpText: "Verwende den Wert im YouTube-Link nach",
    slugHelpText2: ".",
    shareTitle: "Teilbare Ansicht",
    shareDescription: "Das aktuelle Grid, das Thema, die Sprache und alle Stream-Daten werden in die URL kodiert. Jeder mit dem Link sieht dieselbe Konfiguration.",
    createShareUrl: "Freigabe-URL erstellen",
    generatedUrl: "Erzeugte URL",
    shareHint: "Der Freigabelink enthaelt auch ungespeicherte Aenderungen und die gewaehlte Sprache aus dem Drawer.",
    copied: "In die Zwischenablage kopiert",
    manualCopy: "Keine Zwischenablage verfuegbar, du kannst die URL manuell kopieren",
    copyError: "Kopieren fehlgeschlagen",
    urlReady: "URL bereit",
    openPopup: "Im Popup oeffnen",
    closePopup: "Popup schliessen",
    reset: "Zuruecksetzen",
    closeSettings: "Einstellungen schliessen",
  },
  fr: {
    tabs: { streams: "Flux", share: "Partager" },
    themes: { dark: "Sombre", light: "Clair" },
    settingsButton: "Parametres",
    controlCenter: "Centre de controle",
    settingsTitle: "Parametres",
    handleTitle: "Nom d'utilisateur",
    handleDescription: "Modifiez le texte @username affiche dans l'en-tete.",
    handleLabel: "Nom d'utilisateur",
    handlePlaceholder: "username",
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
    liveStream: "En direct",
    viewerCountText: "est regarde par {viewerCount} personnes !",
    noViewersText: "n'est pas en ligne actuellement !",
    announcementKicker: "Nouveaute",
    announcementTitle: "MultiTV a ete mis a jour",
    announcementDescription: "L'integration Kick avec nom d'utilisateur a ete ajoutee. Saisissez un nom d'utilisateur pour voir le statut en direct, l'avatar et le nombre de spectateurs dans l'interface. Vous pouvez aussi reordonner les flux par glisser-deposer.",
    announcementPrimary: "Compris",
    dragStream: "Reordonner le flux",
    slugHelpTitle: "Comment trouver le slug ?",
    slugHelpText: "Utilisez la valeur dans le lien YouTube apres",
    slugHelpText2: ".",
    shareTitle: "Vue partageable",
    shareDescription: "La grille actuelle, le theme, la langue et toutes les donnees des flux sont encodes dans l'URL. Toute personne ouvrant le lien voit la meme configuration.",
    createShareUrl: "Creer l'URL de partage",
    generatedUrl: "URL generee",
    shareHint: "Le lien de partage inclut aussi les modifications non enregistrees et la langue choisie dans le panneau.",
    copied: "Copie dans le presse-papiers",
    manualCopy: "Le presse-papiers est indisponible, vous pouvez copier l'URL manuellement",
    copyError: "La copie a echoue",
    urlReady: "URL prete",
    openPopup: "Ouvrir en fenetre",
    closePopup: "Fermer la fenetre",
    reset: "Reinitialiser",
    closeSettings: "Fermer les parametres",
  },
  zh: {
    tabs: { streams: "直播源", share: "分享" },
    themes: { dark: "深色", light: "浅色" },
    settingsButton: "设置",
    controlCenter: "控制中心",
    settingsTitle: "设置",
    handleTitle: "用户名",
    handleDescription: "编辑头部显示的 @username 文本。",
    handleLabel: "用户名",
    handlePlaceholder: "username",
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
    liveStream: "直播中",
    viewerCountText: "有 {viewerCount} 人正在观看！",
    noViewersText: "当前不在线！",
    announcementKicker: "更新",
    announcementTitle: "MultiTV 已更新",
    announcementDescription: "已加入通过用户名连接 Kick 的功能。输入用户名后，可在界面中查看直播状态、头像和观看人数。现在也可以通过拖放重新排序直播。",
    announcementPrimary: "知道了",
    dragStream: "重新排序直播",
    slugHelpTitle: "如何找到 slug？",
    slugHelpText: "使用 YouTube 链接中",
    slugHelpText2: "后面的值",
    shareTitle: "可分享视图",
    shareDescription: "当前网格、主题、语言以及所有直播数据都会编码进 URL。任何打开该链接的人都会看到相同布局。",
    createShareUrl: "生成分享链接",
    generatedUrl: "生成的 URL",
    shareHint: "分享链接也会包含抽屉中尚未保存的更改以及所选语言。",
    copied: "已复制到剪贴板",
    manualCopy: "无法访问剪贴板，你可以手动复制该 URL",
    copyError: "复制失败",
    urlReady: "URL 已就绪",
    openPopup: "弹出打开",
    closePopup: "关闭弹窗",
    reset: "重置",
    closeSettings: "关闭设置",
  },
  ar: {
    tabs: { streams: "البثوث", share: "مشاركة" },
    themes: { dark: "داكن", light: "فاتح" },
    settingsButton: "الإعدادات",
    controlCenter: "مركز التحكم",
    settingsTitle: "الإعدادات",
    handleTitle: "اسم المستخدم",
    handleDescription: "عدّل نص @username الظاهر في الترويسة.",
    handleLabel: "اسم المستخدم",
    handlePlaceholder: "username",
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
    liveStream: "بث مباشر",
    viewerCountText: "يشاهده {viewerCount} شخص!",
    noViewersText: "ليس متصلا الآن!",
    announcementKicker: "تحديث",
    announcementTitle: "تم تحديث MultiTV",
    announcementDescription: "تمت إضافة تكامل Kick باستخدام اسم المستخدم. أدخل اسم المستخدم لعرض حالة البث والصورة الرمزية وعدد المشاهدين داخل الواجهة. يمكنك الآن أيضا إعادة ترتيب البثوث بالسحب والإفلات.",
    announcementPrimary: "حسنا",
    dragStream: "إعادة ترتيب البث",
    slugHelpTitle: "كيف تجد الـ slug؟",
    slugHelpText: "استخدم القيمة الموجودة في رابط YouTube بعد",
    slugHelpText2: ".",
    shareTitle: "عرض قابل للمشاركة",
    shareDescription: "يتم ترميز الشبكة الحالية والمظهر واللغة وكل بيانات البث داخل الرابط. أي شخص يفتح الرابط سيرى نفس الترتيب.",
    createShareUrl: "إنشاء رابط المشاركة",
    generatedUrl: "الرابط الناتج",
    shareHint: "رابط المشاركة يتضمن أيضاً التغييرات غير المحفوظة واللغة المختارة من اللوحة الجانبية.",
    copied: "تم النسخ إلى الحافظة",
    manualCopy: "الحافظة غير متاحة، يمكنك نسخ الرابط يدوياً",
    copyError: "فشل النسخ",
    urlReady: "الرابط جاهز",
    openPopup: "فتح في نافذة",
    closePopup: "إغلاق النافذة",
    reset: "إعادة تعيين",
    closeSettings: "إغلاق الإعدادات",
  },
};

function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function sanitizeUsername(value) {
  if (typeof value !== "string") return "";
  return value.replace(/^@+/, "").trim();
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

function getInitialAnnouncementVisibility() {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(ANNOUNCEMENT_STORAGE_KEY) !== "true";
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
      username: sanitizeUsername(parsed.u),
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

function encodeState(streams, gridCount, theme, language, username) {
  try {
    const d = { g: gridCount, s: streams.map((s) => ({ k: s.slug, t: s.title })), m: theme, l: language, u: sanitizeUsername(username) };
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
      username: sanitizeUsername(d.u),
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
    username: DEFAULT_USERNAME,
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
      username: defaultConfig.username,
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
    username: decoded.username || defaultConfig.username,
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

function getFixedGridLayout(option) {
  if (!option) return { cols: 1, rows: 1 };
  return { cols: option.cols, rows: option.rows };
}

function reorderStreams(list, fromIndex, toIndex, activeCount) {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= activeCount || toIndex >= activeCount) {
    return { streams: list, indexMap: new Map() };
  }

  const next = [...list];
  while (next.length < activeCount) next.push({ slug: "", title: "" });

  const activeStreams = next.slice(0, activeCount);
  const [moved] = activeStreams.splice(fromIndex, 1);
  activeStreams.splice(toIndex, 0, moved);

  const reordered = [...activeStreams, ...next.slice(activeCount)];
  const indexMap = new Map();
  activeStreams.forEach((stream, nextIndex) => {
    const previousIndex = next.findIndex((candidate, candidateIndex) => (
      candidateIndex < activeCount && candidate === stream
    ));
    if (previousIndex !== -1) {
      indexMap.set(previousIndex, nextIndex);
    }
  });

  return { streams: reordered, indexMap };
}

export default function App() {
  const initialAppConfigRef = useRef(getInitialAppConfig());
  const initialAppConfig = initialAppConfigRef.current;
  const [theme, setTheme] = useState(initialAppConfig.theme);
  const [language, setLanguage] = useState(initialAppConfig.language);
  const [username, setUsername] = useState(initialAppConfig.username);
  const [gridOption, setGridOption] = useState(initialAppConfig.gridOption);
  const [streams, setStreams] = useState(initialAppConfig.streams);
  const [showSettings, setShowSettings] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(getInitialAnnouncementVisibility);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [gridMenuOpen, setGridMenuOpen] = useState(false);
  const [popups, setPopups] = useState([]);
  const [popupInteraction, setPopupInteraction] = useState(null);
  const [editStreams, setEditStreams] = useState(() => initialAppConfig.streams.map((stream) => ({ ...stream })));
  const [editGridCount, setEditGridCount] = useState(initialAppConfig.gridCount);
  const [editTheme, setEditTheme] = useState(initialAppConfig.theme);
  const [editLanguage, setEditLanguage] = useState(initialAppConfig.language);
  const [editUsername, setEditUsername] = useState(initialAppConfig.username);
  const [fetchedAvatar, setFetchedAvatar] = useState(null);
  const [isLiveUser, setIsLiveUser] = useState(false);
  const [hasViewers, setHasViewers] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [activeTab, setActiveTab] = useState("streams");
  const [shareUrl, setShareUrl] = useState("");
  const [shareStatus, setShareStatus] = useState("idle");
  const [draggedStreamIndex, setDraggedStreamIndex] = useState(null);
  const [dragOverStreamIndex, setDragOverStreamIndex] = useState(null);
  const copyTimer = useRef(null);
  const settingsTimerRef = useRef(null);
  const gridAreaRef = useRef(null);
  const gridMenuRef = useRef(null);
  const popupIdRef = useRef(1);
  const popupZIndexRef = useRef(1);
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
        u: sanitizeUsername(username),
      })
    );
  }, [gridOption.count, streams, theme, language, username]);

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
      language,
      username
    );

    if (currentCfg !== activeConfig) {
      stripShareConfigFromUrl();
    }
  }, [gridOption.count, streams, theme, language, username]);

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

  useEffect(() => {
    if (!gridMenuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!gridMenuRef.current?.contains(event.target)) {
        setGridMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setGridMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [gridMenuOpen]);

  useEffect(() => {
    if (!popupInteraction) return undefined;

    const handlePointerMove = (event) => {
      if (event.pointerId !== popupInteraction.pointerId) return;
      if ((event.buttons & 1) !== 1) {
        setPopupInteraction(null);
        return;
      }

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      setPopups((current) =>
        current.map((popup) => {
          if (popup.id !== popupInteraction.id) return popup;

          if (popupInteraction.type === "drag") {
            const nextLeft = clamp(
              popupInteraction.startLeft + (event.clientX - popupInteraction.startX),
              0,
              Math.max(viewportWidth - popup.width, 0)
            );
            const nextTop = clamp(
              popupInteraction.startTop + (event.clientY - popupInteraction.startY),
              0,
              Math.max(viewportHeight - popup.height, 0)
            );

            return {
              ...popup,
              left: nextLeft,
              top: nextTop,
            };
          }

          const nextWidth = clamp(
            popupInteraction.startWidth + (event.clientX - popupInteraction.startX),
            POPUP_MIN_WIDTH,
            Math.max(viewportWidth - popup.left, POPUP_MIN_WIDTH)
          );
          const nextHeight = clamp(
            popupInteraction.startHeight + (event.clientY - popupInteraction.startY),
            POPUP_MIN_HEIGHT,
            Math.max(viewportHeight - popup.top, POPUP_MIN_HEIGHT)
          );

          return {
            ...popup,
            width: nextWidth,
            height: nextHeight,
          };
        })
      );
    };

    const handlePointerUp = (event) => {
      if (typeof event.pointerId === "number" && event.pointerId !== popupInteraction.pointerId) return;
      setPopupInteraction(null);
    };

    document.body.style.userSelect = "none";
    document.body.style.cursor = popupInteraction.type === "drag" ? "grabbing" : "nwse-resize";
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    window.addEventListener("blur", handlePointerUp);

    return () => {
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      window.removeEventListener("blur", handlePointerUp);
    };
  }, [popupInteraction]);

  const normalizedStreams = [...streams];
  while (normalizedStreams.length < gridOption.count) {
    normalizedStreams.push({ slug: "", title: "" });
  }
  const activeStreams = normalizedStreams.slice(0, gridOption.count);

  useEffect(() => {
    const popupEntries = streams
      .slice(0, gridOption.count)
      .map((stream, idx) => ({
        idx,
        slug: stream.slug.trim(),
        title: stream.title.trim(),
      }))
      .filter((stream) => stream.slug);

    setPopups((current) => {
      let changed = false;

      const nextPopups = current
        .map((popup) => {
          const nextStream = popupEntries.find((stream) => stream.idx === popup.streamIdx);
          if (!nextStream) {
            changed = true;
            return null;
          }

          if (popup.slug !== nextStream.slug || popup.title !== nextStream.title) {
            changed = true;
            return {
              ...popup,
              slug: nextStream.slug,
              title: nextStream.title,
            };
          }

          return popup;
        })
        .filter(Boolean);

      return changed ? nextPopups : current;
    });
  }, [streams, gridOption.count]);

  const activeTheme = showSettings ? editTheme : theme;
  const activeLanguage = showSettings ? editLanguage : language;
  const activeUsername = showSettings ? editUsername : username;
  const displayUsername = sanitizeUsername(activeUsername) || DEFAULT_USERNAME;
  const isRtl = RTL_LANGUAGES.has(activeLanguage);
  const isLightTheme = activeTheme === "light";
  const fixedGrid = getFixedGridLayout(gridOption);
  const gridGap = 0;
  const availableGridWidth = Math.max(gridAreaSize.width, 0);
  const availableGridHeight = Math.max(gridAreaSize.height, 0);
  const gridMetrics = getGridMetrics(
    availableGridWidth,
    availableGridHeight,
    fixedGrid.cols,
    fixedGrid.rows,
    gridGap
  );
  const themeStyles = isLightTheme
    ? {
      root: "bg-[#f9f9f9] text-[#0f0f0f]",
      mesh: "bg-mesh-light",
      gridPattern: "hidden",
      glowA: "hidden",
      glowB: "hidden",
      glowC: "hidden",
      header: "relative z-30 overflow-visible border-b border-black/10 bg-white/95 backdrop-blur-md",
      toolbar: "border border-black/10 bg-[#f2f2f2] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]",
      toolbarActive: "bg-[#0f0f0f] text-white shadow-sm",
      toolbarInactive: "text-[#0f0f0f] hover:bg-black/5",
      settingsButton: "border border-[#ff0033] bg-[#ff0033] text-white shadow-[0_16px_30px_-18px_rgba(255,0,51,0.55)] hover:bg-[#e60023]",
      liveBadge: "bg-[#ff0033] text-white shadow-[0_10px_26px_-16px_rgba(255,0,51,0.55)]",
      brandKicker: "text-[#606060]",
      mainCopy: "text-[#606060]",
      cardDefault: "bg-white",
      cardTint: "from-black/5 via-transparent to-black/[0.03]",
      cardShade: "from-transparent via-transparent to-black/30",
      emptyState: "bg-[#f3f3f3] text-[#606060]",
      emptyIcon: "border-black/10 bg-white",
      indexBadge: "border border-black/10 bg-white/92 text-[#606060]",
      titleKicker: "text-[#606060]",
      titleText: "text-[#0f0f0f]",
      drawerBackdrop: "bg-black/45 opacity-100 backdrop-blur-sm",
      drawerPanel: "border-l border-black/10 bg-white shadow-2xl shadow-black/15",
      drawerGradient: "from-white via-[#fafafa] to-[#f7f7f7]",
      drawerEdge: "from-[#ff0033]/30 via-transparent to-transparent",
      drawerHeader: "border-b border-black/10 bg-white/96 backdrop-blur-md",
      drawerText: "text-[#606060]",
      closeButton: "border border-black/10 bg-[#f2f2f2] text-[#0f0f0f] hover:bg-[#e5e5e5]",
      tabActive: "bg-[#0f0f0f] text-white shadow-sm",
      tabInactive: "bg-[#f2f2f2] text-[#0f0f0f] hover:bg-[#e5e5e5]",
      drawerBody: "bg-[#fafafa]",
      surface: "border border-black/10 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]",
      surfaceMuted: "text-[#606060]",
      surfaceInput: "border-black/10 bg-white text-[#0f0f0f] placeholder:text-[#909090] focus:bg-white",
      optionInactive: "border border-black/10 bg-[#f2f2f2] text-[#0f0f0f] hover:bg-[#e5e5e5]",
      shareUrlBox: "border border-black/10 bg-[#f9f9f9] text-[#0f0f0f]",
      footerBar: "border-t border-black/10 bg-white/96",
      secondaryButton: "border border-black/10 bg-[#f2f2f2] text-[#0f0f0f] hover:bg-[#e5e5e5]",
      primaryButton: "bg-[#ff0033] text-white hover:bg-[#e60023]",
      statusIdle: "bg-black/5 text-[#606060]",
    }
    : {
      root: "bg-[#0f0f0f] text-[#f1f1f1]",
      mesh: "bg-mesh",
      gridPattern: "hidden",
      glowA: "hidden",
      glowB: "hidden",
      glowC: "hidden",
      header: "relative z-30 overflow-visible border-b border-white/10 bg-[#0f0f0f]/95 backdrop-blur-md",
      toolbar: "border border-white/10 bg-[#212121]",
      toolbarActive: "bg-white text-[#0f0f0f] shadow-sm",
      toolbarInactive: "text-[#f1f1f1] hover:bg-white/8",
      settingsButton: "border border-[#ff0033] bg-[#ff0033] text-white shadow-[0_16px_30px_-18px_rgba(255,0,51,0.65)] hover:bg-[#e60023]",
      liveBadge: "bg-[#ff0033] text-white shadow-[0_10px_26px_-16px_rgba(255,0,51,0.6)]",
      brandKicker: "text-[#aaaaaa]",
      mainCopy: "text-[#aaaaaa]",
      cardDefault: "bg-[#212121]",
      cardTint: "from-white/5 via-transparent to-black/10",
      cardShade: "from-transparent via-transparent to-black/80",
      emptyState: "bg-[#212121] text-[#aaaaaa]",
      emptyIcon: "border-white/10 bg-[#181818]",
      indexBadge: "border border-white/10 bg-black/35 text-[#f1f1f1]",
      titleKicker: "text-[#ff9090]",
      titleText: "text-[#f1f1f1]",
      drawerBackdrop: "bg-black/70 opacity-100 backdrop-blur-sm",
      drawerPanel: "border-l border-white/10 bg-[#0f0f0f] shadow-2xl shadow-black/50",
      drawerGradient: "from-[#181818] via-[#121212] to-[#0f0f0f]",
      drawerEdge: "from-[#ff0033]/35 via-transparent to-transparent",
      drawerHeader: "border-white/10 bg-[#181818]/95 backdrop-blur-md",
      drawerText: "text-[#aaaaaa]",
      closeButton: "border border-white/10 bg-[#272727] text-[#f1f1f1] hover:bg-[#3a3a3a]",
      tabActive: "bg-white text-[#0f0f0f] shadow-sm",
      tabInactive: "bg-[#272727] text-[#f1f1f1] hover:bg-[#3a3a3a]",
      drawerBody: "bg-[#121212]",
      surface: "border border-white/10 bg-[#181818] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
      surfaceMuted: "text-[#aaaaaa]",
      surfaceInput: "border-white/10 bg-[#121212] text-[#f1f1f1] placeholder:text-[#717171] focus:bg-[#121212]",
      optionInactive: "border border-white/10 bg-[#272727] text-[#f1f1f1] hover:bg-[#3a3a3a]",
      shareUrlBox: "border border-white/10 bg-[#121212] text-[#f1f1f1]",
      footerBar: "border-t border-white/10 bg-[#181818]/98",
      secondaryButton: "border border-white/10 bg-[#272727] text-[#f1f1f1] hover:bg-[#3a3a3a]",
      primaryButton: "bg-[#ff0033] text-white hover:bg-[#e60023]",
      statusIdle: "bg-white/8 text-[#aaaaaa]",
    };

  const openSettings = () => {
    const padded = [...streams];
    while (padded.length < MAX_STREAMS) padded.push({ slug: "", title: "" });
    setEditStreams(padded);
    setEditGridCount(gridOption.count);
    setEditTheme(theme);
    setEditLanguage(language);
    setEditUsername(username);
    setGridMenuOpen(false);
    setShareUrl("");
    setShareStatus("idle");
    setActiveTab("streams");
    clearTimeout(settingsTimerRef.current);
    setShowSettings(true);
    requestAnimationFrame(() => setSettingsOpen(true));
  };

  const closeAnnouncement = () => {
    window.localStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, "true");
    setShowAnnouncement(false);
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
  };

  const updateTheme = (nextTheme) => {
    setEditTheme(nextTheme);
    setTheme(nextTheme);
  };

  const updateLanguage = (nextLanguage) => {
    setEditLanguage(nextLanguage);
    setLanguage(nextLanguage);
  };

  const resetStreamDrag = () => {
    setDraggedStreamIndex(null);
    setDragOverStreamIndex(null);
  };

  const startStreamDrag = (event, idx) => {
    setDraggedStreamIndex(idx);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(idx));
  };

  const reorderVisibleStreams = (fromIndex, toIndex) => {
    const { streams: nextStreams, indexMap } = reorderStreams(streams, fromIndex, toIndex, gridOption.count);
    if (!indexMap.size) return;

    setStreams(nextStreams.map((stream) => ({ ...stream })));
    setEditStreams(nextStreams.map((stream) => ({ ...stream })));
    setPopups((current) =>
      current.map((popup) => (
        indexMap.has(popup.streamIdx)
          ? { ...popup, streamIdx: indexMap.get(popup.streamIdx) }
          : popup
      ))
    );
  };

  const reorderEditableStreams = (fromIndex, toIndex) => {
    const { streams: nextStreams, indexMap } = reorderStreams(editStreams, fromIndex, toIndex, editGridCount);
    if (!indexMap.size) return;

    setEditStreams(nextStreams.map((stream) => ({ ...stream })));
    setStreams(nextStreams.map((stream) => ({ ...stream })));
    setPopups((current) =>
      current.map((popup) => (
        indexMap.has(popup.streamIdx)
          ? { ...popup, streamIdx: indexMap.get(popup.streamIdx) }
          : popup
      ))
    );
  };

  const handleStreamDrop = (event, toIndex, source = "grid") => {
    event.preventDefault();
    const rawIndex = event.dataTransfer.getData("text/plain");
    const fromIndex = rawIndex ? Number(rawIndex) : draggedStreamIndex;
    if (Number.isInteger(fromIndex)) {
      if (source === "settings") {
        reorderEditableStreams(fromIndex, toIndex);
      } else {
        reorderVisibleStreams(fromIndex, toIndex);
      }
    }
    resetStreamDrag();
  };

  const bringPopupToFront = (id) => {
    popupZIndexRef.current += 1;
    const nextZIndex = popupZIndexRef.current;

    setPopups((current) =>
      current.map((popup) => (
        popup.id === id
          ? { ...popup, zIndex: nextZIndex }
          : popup
      ))
    );
  };

  const openPopup = (stream, streamIdx) => {
    const slug = stream.slug.trim();
    if (!slug || typeof window === "undefined") return;

    const existingPopup = popups.find((popup) => popup.streamIdx === streamIdx);
    if (existingPopup) {
      bringPopupToFront(existingPopup.id);
      return;
    }

    popupZIndexRef.current += 1;
    const width = clamp(Math.round(window.innerWidth * 0.36), POPUP_MIN_WIDTH, 720);
    const height = clamp(Math.round(width / VIDEO_RATIO) + 52, POPUP_MIN_HEIGHT, 520);
    const offset = popups.length * POPUP_OFFSET_STEP;

    setPopups((current) => [
      ...current,
      {
        id: popupIdRef.current++,
        streamIdx,
        slug,
        title: stream.title.trim(),
        left: clamp(72 + offset, 0, Math.max(window.innerWidth - width, 0)),
        top: clamp(96 + offset, 0, Math.max(window.innerHeight - height, 0)),
        width,
        height,
        zIndex: popupZIndexRef.current,
      },
    ]);
  };

  const closePopup = (id) => {
    setPopups((current) => current.filter((popup) => popup.id !== id));
    setPopupInteraction((current) => (current?.id === id ? null : current));
  };

  const startPopupDrag = (event, popup) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    bringPopupToFront(popup.id);
    setPopupInteraction({
      id: popup.id,
      pointerId: event.pointerId,
      type: "drag",
      startX: event.clientX,
      startY: event.clientY,
      startLeft: popup.left,
      startTop: popup.top,
    });
  };

  const startPopupResize = (event, popup) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    bringPopupToFront(popup.id);
    setPopupInteraction({
      id: popup.id,
      pointerId: event.pointerId,
      type: "resize",
      startX: event.clientX,
      startY: event.clientY,
      startWidth: popup.width,
      startHeight: popup.height,
    });
  };

  const updateUsername = (nextUsername) => {
    const sanitized = sanitizeUsername(nextUsername);
    setEditUsername(sanitized);
    setUsername(sanitized);
  };

  useEffect(() => {
    const sanitized = sanitizeUsername(username);
    if (!sanitized) {
      setFetchedAvatar(null);
      setIsLiveUser(false);
      setHasViewers(false);
      setViewerCount(0);
      return;
    }

    const controller = new AbortController();
    const url = `https://multi-tv.ahmetkaplan.org/kick.php?user=${encodeURIComponent(sanitized)}`;

    fetch(url, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        const avatar = data?.avatar ?? null;
        const live = Boolean(data?.live);
        const vc = Number(data?.viewer_count) || 0;

        setFetchedAvatar(avatar);
        setIsLiveUser(live);
        setViewerCount(vc);
        setHasViewers(vc > 0);
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        setFetchedAvatar(null);
        setIsLiveUser(false);
        setViewerCount(0);
        setHasViewers(false);
      });

    return () => controller.abort();
  }, [username]);

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
    const url = window.location.href.split("?")[0] + "?cfg=" + encodeState(validStreams, editGridCount, editTheme, editLanguage, editUsername);
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
    setUsername(defaults.username);
    setGridOption(defaults.gridOption);
    setStreams(defaults.streams.map((stream) => ({ ...stream })));
    setEditTheme(defaults.theme);
    setEditLanguage(defaults.language);
    setEditUsername(defaults.username);
    setEditGridCount(defaults.gridCount);
    setEditStreams(defaults.streams.map((stream) => ({ ...stream })));
    setShareUrl("");
    setShareStatus("idle");
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
          <div className="flex items-center justify-between gap-5 px-6 py-3">
            <div className="flex flex-1 items-center gap-4">
              <div className="flex items-center gap-3">
                {fetchedAvatar !== null && displayUsername !== "username" ? (
                  <img src={fetchedAvatar}
                    alt={`${displayUsername}'s avatar`}
                    className={isLiveUser ? "relative flex h-16 w-16 rounded-full border-[3px] border-[solid] border-[#53fc18]" : "relative flex h-16 w-16 rounded-full filter grayscale"}
                  />
                ) : (
                  <div className={cn("relative flex h-10 w-[60px] items-center justify-center rounded-[14px]", themeStyles.liveBadge)}>
                    <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                      <rect width="20" height="14" rx="5" fill="currentColor" opacity="0.16" />
                      <path d="M8 4.2L13.8 7L8 9.8V4.2Z" fill="white" />
                    </svg>
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className={cn("text-2xl font-semibold tracking-tight", themeStyles.titleText)}>
                      MultiTV
                    </h1>
                  </div>
                  <p className={cn("mt-1 text-sm", themeStyles.mainCopy)}>
                    <b>@{displayUsername}</b>
                    {displayUsername !== "username" && (<>
                      {hasViewers ? (<> {t("viewerCountText", { viewerCount })}</>) : (<> {t("noViewersText")}</>)}
                    </>)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div ref={gridMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setGridMenuOpen((current) => !current)}
                  className={cn("inline-flex h-11 items-center gap-3 rounded-full px-4 text-sm font-medium transition duration-200", themeStyles.toolbar)}
                >
                  <GridSVG cols={gridOption.cols} rows={gridOption.rows} size={18} />
                  {gridOption.label}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={cn("transition duration-200", gridMenuOpen ? "rotate-180" : "")}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {gridMenuOpen && (
                  <div className={cn("absolute right-0 top-full z-[60] mt-2 min-w-[180px] rounded-2xl p-2", themeStyles.surface)}>
                    {GRID_OPTIONS.map((opt) => {
                      const active = gridOption.count === opt.count;

                      return (
                        <button
                          key={opt.count}
                          type="button"
                          onClick={() => {
                            setGridOption(opt);
                            setGridMenuOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition duration-200",
                            active ? themeStyles.toolbarActive : themeStyles.toolbarInactive
                          )}
                        >
                          <GridSVG cols={opt.cols} rows={opt.rows} size={18} />
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className={cn("inline-flex h-11 items-center gap-1 rounded-full p-1", themeStyles.toolbar)}>
                {THEME_OPTIONS.map((option) => {
                  const active = activeTheme === option.id;
                  const isLightOption = option.id === "light";

                  return (
                    <button
                      key={option.id}
                      onClick={() => updateTheme(option.id)}
                      aria-label={t(`themes.${option.id}`)}
                      title={t(`themes.${option.id}`)}
                      className={cn(
                        "inline-flex h-9 w-9 items-center justify-center rounded-full transition duration-200",
                        active ? themeStyles.toolbarActive : themeStyles.toolbarInactive
                      )}
                    >
                      {isLightOption ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="4" />
                          <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21 14.2A8.5 8.5 0 0 1 9.8 3a9.2 9.2 0 1 0 11.2 11.2Z" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={openSettings}
                className={cn("inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition duration-200", themeStyles.settingsButton)}
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
          className="flex-1 min-h-0 overflow-auto px-6 py-5"
        >
          <div className="mx-auto flex h-full w-full max-w-[1760px] items-center justify-center overflow-visible">
            <div
              className="grid shrink-0 overflow-visible"
              style={{
                width: `${gridMetrics.gridWidth}px`,
                height: `${gridMetrics.gridHeight}px`,
                gap: `${gridGap}px`,
                gridTemplateColumns: `repeat(${fixedGrid.cols}, ${gridMetrics.tileWidth}px)`,
                gridTemplateRows: `repeat(${fixedGrid.rows}, ${gridMetrics.tileHeight}px)`,
              }}
            >
              {activeStreams.map((stream, idx) => {
                return (
                  <div
                    key={`${stream.slug}-${idx}`}
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = "move";
                      setDragOverStreamIndex(idx);
                    }}
                    onDragLeave={() => {
                      if (dragOverStreamIndex === idx) setDragOverStreamIndex(null);
                    }}
                    onDrop={(event) => handleStreamDrop(event, idx)}
                    className={cn(
                      "group relative isolate h-full w-full min-h-0 overflow-hidden text-left transition duration-300",
                      dragOverStreamIndex === idx && draggedStreamIndex !== idx ? "ring-2 ring-[#ff0033] ring-inset" : "",
                      draggedStreamIndex === idx ? "opacity-60" : "",
                      themeStyles.cardDefault
                    )}
                  >
                    <div className={cn("absolute inset-0 bg-gradient-to-br opacity-80", themeStyles.cardTint)} />
                    <div className={cn("absolute inset-0 bg-gradient-to-t", themeStyles.cardShade)} />
                    {draggedStreamIndex !== null && (
                      <div
                        className="absolute inset-0 z-[15]"
                        onDragOver={(event) => {
                          event.preventDefault();
                          event.dataTransfer.dropEffect = "move";
                          setDragOverStreamIndex(idx);
                        }}
                        onDragLeave={() => {
                          if (dragOverStreamIndex === idx) setDragOverStreamIndex(null);
                        }}
                        onDrop={(event) => handleStreamDrop(event, idx)}
                      />
                    )}
                    <div className={cn("absolute left-3 top-3 z-20 inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm", themeStyles.indexBadge)}>
                      <span className={cn("h-2 w-2 rounded-full", stream.slug ? "bg-[#ff0033]" : isLightTheme ? "bg-black/25" : "bg-white/30")} />
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <button
                      type="button"
                      draggable
                      onDragStart={(event) => startStreamDrag(event, idx)}
                      onDragEnd={resetStreamDrag}
                      title={t("dragStream")}
                      aria-label={t("dragStream")}
                      className={cn("absolute left-3 top-10 z-30 inline-flex h-8 w-8 cursor-grab items-center justify-center rounded-full transition active:cursor-grabbing", themeStyles.closeButton)}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 6.5A1.5 1.5 0 1 1 6.5 5 1.5 1.5 0 0 1 8 6.5Zm0 5.5a1.5 1.5 0 1 1-1.5-1.5A1.5 1.5 0 0 1 8 12Zm0 5.5A1.5 1.5 0 1 1 6.5 16 1.5 1.5 0 0 1 8 17.5Zm9.5-11A1.5 1.5 0 1 1 16 5a1.5 1.5 0 0 1 1.5 1.5Zm0 5.5a1.5 1.5 0 1 1-1.5-1.5A1.5 1.5 0 0 1 17.5 12Zm0 5.5A1.5 1.5 0 1 1 16 16a1.5 1.5 0 0 1 1.5 1.5Z" />
                      </svg>
                    </button>
                    {stream.slug && (
                      <button
                        type="button"
                        onClick={() => openPopup(stream, idx)}
                        title={t("openPopup")}
                        aria-label={t("openPopup")}
                        className={cn("absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full transition", themeStyles.closeButton)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 3h7v7" />
                          <path d="M10 14L21 3" />
                          <path d="M21 14v7h-7" />
                          <path d="M3 10L14 21" />
                        </svg>
                      </button>
                    )}

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
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="5" width="18" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M11 9L15 11L11 13V9Z" fill="currentColor" />
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

                    {stream.title && (
                      <div className={cn("pointer-events-none absolute inset-x-0 bottom-0 z-20 translate-y-3 bg-gradient-to-t px-4 pb-4 pt-14 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100", isLightTheme ? "from-white via-white/88 to-transparent" : "from-black via-black/86 to-transparent")}>
                        <p className={cn("text-xs font-medium uppercase tracking-[0.22em]", themeStyles.titleKicker)}>
                          {t("liveStream")}
                        </p>
                        <p className={cn("mt-2 text-base font-semibold", themeStyles.titleText)}>{stream.title}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {popups.length > 0 && (
          <div className="pointer-events-none fixed inset-0 z-40">
            {popups.map((popup) => (
              <div
                key={popup.id}
                className={cn("pointer-events-auto absolute flex flex-col overflow-hidden rounded-2xl shadow-2xl", themeStyles.surface)}
                style={{
                  left: popup.left,
                  top: popup.top,
                  width: popup.width,
                  height: popup.height,
                  zIndex: popup.zIndex,
                }}
                onPointerDown={() => bringPopupToFront(popup.id)}
              >
                <div
                  className={cn("flex h-12 cursor-move touch-none items-center justify-between gap-3 px-4", themeStyles.toolbar)}
                  onPointerDown={(event) => startPopupDrag(event, popup)}
                >
                  <div className="min-w-0">
                    <p className={cn("truncate text-sm font-semibold", themeStyles.titleText)}>
                      {popup.title || t("streamLabel", { index: popup.streamIdx + 1 })}
                    </p>
                    <p className={cn("mt-0.5 text-xs", themeStyles.surfaceMuted)}>{t("liveStream")}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => closePopup(popup.id)}
                    onPointerDown={(event) => event.stopPropagation()}
                    title={t("closePopup")}
                    aria-label={t("closePopup")}
                    className={cn("inline-flex h-9 w-9 items-center justify-center rounded-full transition", themeStyles.closeButton)}
                  >
                    <span className="text-lg leading-none">×</span>
                  </button>
                </div>

                <div className="relative min-h-0 flex-1 bg-black">
                  {popupInteraction?.id === popup.id && (
                    <div className="absolute inset-0 z-10 bg-transparent" />
                  )}

                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${popup.slug}?autoplay=1&mute=0`}
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={popup.title || `Popup Stream ${popup.streamIdx + 1}`}
                  />

                  <button
                    type="button"
                    aria-label="Resize popup"
                    onPointerDown={(event) => {
                      event.stopPropagation();
                      startPopupResize(event, popup);
                    }}
                    className="absolute bottom-0 right-0 z-20 h-5 w-5 cursor-se-resize touch-none"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={cn("ml-auto mt-auto", themeStyles.surfaceMuted)}>
                      <path d="M6 14L14 6" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M10 14L14 10" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showAnnouncement && (
          <div className="fixed inset-0 z-[65] flex items-center justify-center px-4 py-6">
            <button
              type="button"
              aria-label={t("announcementPrimary")}
              onClick={closeAnnouncement}
              className={cn("absolute inset-0", themeStyles.drawerBackdrop)}
            />

            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="announcement-title"
              className={cn("relative w-full max-w-[460px] overflow-hidden rounded-[20px] p-6 shadow-2xl", themeStyles.drawerPanel)}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-b", themeStyles.drawerGradient)} />
              <div className={cn("absolute inset-x-0 top-0 h-px bg-gradient-to-r", themeStyles.drawerEdge)} />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", themeStyles.liveBadge)}>
                    <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                      <rect width="22" height="16" rx="5" fill="currentColor" opacity="0.16" />
                      <path d="M8.5 4.6L15 8L8.5 11.4V4.6Z" fill="white" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    onClick={closeAnnouncement}
                    aria-label={t("announcementPrimary")}
                    className={cn("inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition", themeStyles.closeButton)}
                  >
                    <span className="text-lg leading-none">×</span>
                  </button>
                </div>

                <p className={cn("mt-5 text-xs font-semibold uppercase tracking-[0.28em]", themeStyles.brandKicker)}>
                  {t("announcementKicker")}
                </p>
                <h2 id="announcement-title" className={cn("mt-2 text-2xl font-semibold tracking-tight", themeStyles.titleText)}>
                  {t("announcementTitle")}
                </h2>
                <p className={cn("mt-3 text-sm leading-6", themeStyles.surfaceMuted)}>
                  {t("announcementDescription")}
                </p>

                <button
                  type="button"
                  onClick={closeAnnouncement}
                  className={cn("mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition", themeStyles.primaryButton)}
                >
                  {t("announcementPrimary")}
                </button>
              </div>
            </div>
          </div>
        )}

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
              className={`absolute inset-y-0 right-0 w-full max-w-[1040px] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${settingsOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                }`}
            >
              <div className={cn("relative flex h-full w-full flex-col overflow-hidden rounded-l-[16px]", themeStyles.drawerPanel)}>
                <div className={cn("absolute inset-0 bg-gradient-to-b", themeStyles.drawerGradient)} />
                <div className={cn("absolute inset-y-0 left-0 w-px bg-gradient-to-b", themeStyles.drawerEdge)} />

                <div className={cn("relative px-7 pb-5 pt-6", themeStyles.drawerHeader)}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={cn("flex h-11 w-[68px] items-center justify-center rounded-[16px]", themeStyles.liveBadge)}>
                        <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                          <rect width="20" height="14" rx="5" fill="currentColor" opacity="0.16" />
                          <path d="M8 4.2L13.8 7L8 9.8V4.2Z" fill="white" />
                        </svg>
                      </div>
                      <div>
                        <p className={cn("text-xs font-semibold uppercase tracking-[0.35em]", themeStyles.brandKicker)}>
                          {t("controlCenter")}
                        </p>
                        <h2 className={cn("mt-2 text-2xl font-semibold tracking-tight", themeStyles.titleText)}>{t("settingsTitle")}</h2>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn("rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]", isLightTheme ? "bg-[#ff0033]/10 text-[#ff0033]" : "bg-[#ff0033]/15 text-white")}>
                        STUDIO
                      </span>
                      <button
                        onClick={closeSettings}
                        className={cn("inline-flex h-11 w-11 items-center justify-center rounded-full transition", themeStyles.closeButton)}
                      >
                        <span className="text-xl leading-none">×</span>
                      </button>
                    </div>
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

                  <div className={cn("mt-5 flex flex-wrap items-center gap-3 rounded-[20px] p-4 justify-between", themeStyles.surface)}>
                    <div className="min-w-[180px]">
                      <p className={cn("text-sm font-semibold", themeStyles.titleText)}>{t("handleTitle")}</p>
                      <p className={cn("mt-1 text-sm", themeStyles.surfaceMuted)}>
                        {t("handleDescription")}
                      </p>
                    </div>
                    <label className="block min-w-[260px] flex-1">
                      <span className={cn("mb-2 block text-xs font-semibold uppercase tracking-[0.24em]", themeStyles.surfaceMuted)}>
                        {t("handleLabel")}
                      </span>
                      <div className={cn("flex items-center rounded-2xl border px-4 py-3", themeStyles.surfaceInput)}>
                        <span className={cn("mr-2 text-sm font-semibold", themeStyles.surfaceMuted)}>@</span>
                        <input
                          value={editUsername}
                          onChange={(e) => updateUsername(e.target.value)}
                          placeholder={t("handlePlaceholder")}
                          className="w-full appearance-none bg-transparent text-sm outline-none"
                        />
                      </div>
                    </label>
                  </div>

                  <div className={cn("mt-4 flex flex-wrap items-center gap-3 rounded-[20px] p-4 justify-between", themeStyles.surface)}>
                    <div className="min-w-[140px]">
                      <p className={cn("text-sm font-semibold", themeStyles.titleText)}>{t("languageTitle")}</p>
                      <p className={cn("mt-1 text-sm", themeStyles.surfaceMuted)}>
                        {t("languageDescription")}
                      </p>
                    </div>
                    <div className={cn("flex flex-wrap items-center gap-2 rounded-full p-1.5", themeStyles.toolbar)}>
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

                <div className={cn("relative z-10 min-h-0 flex-1 overflow-y-auto px-7 py-6", themeStyles.drawerBody)}>
                  {activeTab === "streams" && (
                    <div className="space-y-5">
                      <div className={cn("rounded-[20px] p-5", themeStyles.surface)}>
                        <div className="flex items-center justify-between gap-4">
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
                                    active ? themeStyles.primaryButton : themeStyles.optionInactive
                                  )}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {Array.from({ length: MAX_STREAMS }).map((_, idx) => {
                          const dim = idx >= editGridCount;

                          return (
                            <div
                              key={idx}
                              onDragOver={(event) => {
                                if (dim) return;
                                event.preventDefault();
                                event.dataTransfer.dropEffect = "move";
                                setDragOverStreamIndex(idx);
                              }}
                              onDragLeave={() => {
                                if (dragOverStreamIndex === idx) setDragOverStreamIndex(null);
                              }}
                              onDrop={(event) => {
                                if (!dim) handleStreamDrop(event, idx, "settings");
                              }}
                              className={cn(
                                "rounded-[20px] p-4 transition",
                                themeStyles.surface,
                                dim ? "opacity-40" : "opacity-100",
                                dragOverStreamIndex === idx && draggedStreamIndex !== idx && !dim ? "ring-2 ring-[#ff0033] ring-inset" : "",
                                draggedStreamIndex === idx ? "opacity-60" : ""
                              )}
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
                              {!dim && (
                                <button
                                  type="button"
                                  draggable
                                  onDragStart={(event) => startStreamDrag(event, idx)}
                                  onDragEnd={resetStreamDrag}
                                  title={t("dragStream")}
                                  aria-label={t("dragStream")}
                                  className={cn("inline-flex h-9 w-9 cursor-grab items-center justify-center rounded-full transition active:cursor-grabbing", themeStyles.closeButton)}
                                >
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 6.5A1.5 1.5 0 1 1 6.5 5 1.5 1.5 0 0 1 8 6.5Zm0 5.5a1.5 1.5 0 1 1-1.5-1.5A1.5 1.5 0 0 1 8 12Zm0 5.5A1.5 1.5 0 1 1 6.5 16 1.5 1.5 0 0 1 8 17.5Zm9.5-11A1.5 1.5 0 1 1 16 5a1.5 1.5 0 0 1 1.5 1.5Zm0 5.5a1.5 1.5 0 1 1-1.5-1.5A1.5 1.5 0 0 1 17.5 12Zm0 5.5A1.5 1.5 0 1 1 16 16a1.5 1.5 0 0 1 1.5 1.5Z" />
                                  </svg>
                                </button>
                              )}
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
                                    className={cn("w-full appearance-none rounded-2xl border px-4 py-3 font-mono text-sm caret-[#ff0033] outline-none transition focus:border-[#ff0033]/40 focus:ring-2 focus:ring-[#ff0033]/15 disabled:cursor-not-allowed", themeStyles.surfaceInput)}
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
                                    className={cn("w-full appearance-none rounded-2xl border px-4 py-3 text-sm caret-[#ff0033] outline-none transition focus:border-[#ff0033]/40 focus:ring-2 focus:ring-[#ff0033]/15 disabled:cursor-not-allowed", themeStyles.surfaceInput)}
                                  />
                                </label>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className={cn("rounded-[20px] p-4 text-sm leading-6", themeStyles.surface, isLightTheme ? "text-[#606060]" : "text-[#aaaaaa]")}>
                        <span className={cn("font-semibold", themeStyles.titleText)}>{t("slugHelpTitle")}</span> {t("slugHelpText")}
                        <span className={cn("mx-1 rounded-full px-2.5 py-1 font-mono text-xs", isLightTheme ? "bg-black/5 text-[#0f0f0f]" : "bg-white/10 text-white")}>
                          watch?v=VideoSlug
                        </span>
                        {t("slugHelpText2")}
                      </div>
                    </div>
                  )}

                  {activeTab === "share" && (
                    <div className="space-y-5">
                      <div className={cn("rounded-[20px] p-5", themeStyles.surface)}>
                        <p className={cn("text-lg font-semibold", themeStyles.titleText)}>{t("shareTitle")}</p>
                        <p className={cn("mt-2 max-w-2xl text-sm leading-6", themeStyles.surfaceMuted)}>
                          {t("shareDescription")}
                        </p>

                        <button
                          onClick={handleShare}
                          className={cn("mt-5 inline-flex items-center gap-3 rounded-full px-5 py-3 text-sm font-semibold transition", themeStyles.primaryButton)}
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
                        <div className={cn("rounded-[20px] p-5", themeStyles.surface)}>
                          <p className={cn("text-xs font-semibold uppercase tracking-[0.28em]", themeStyles.surfaceMuted)}>
                            {t("generatedUrl")}
                          </p>
                          <div className={cn("mt-4 rounded-2xl border p-4 font-mono text-sm leading-7 break-all", themeStyles.shareUrlBox)}>
                            {shareUrl}
                          </div>
                          <div
                            className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${shareStatus === "copied"
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

                      <div className={cn("rounded-[20px] p-4 text-sm leading-6", themeStyles.surface, isLightTheme ? "text-[#7c2d12]" : "text-[#f5c2a8]")}>
                        {t("shareHint")}
                      </div>
                    </div>
                  )}
                </div>

                <div className={cn("relative z-10 shrink-0 flex justify-end gap-3 px-7 py-4", themeStyles.footerBar)}>
                  <button
                    onClick={handleReset}
                    className={cn("rounded-full px-5 py-3 text-sm font-semibold transition", themeStyles.secondaryButton)}
                  >
                    {t("reset")}
                  </button>
                  <button
                    onClick={closeSettings}
                    className={cn("rounded-full px-5 py-3 text-sm font-semibold transition", themeStyles.primaryButton)}
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
