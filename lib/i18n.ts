export type Lang = 'ms' | 'en';

export function formatPackageName(pkg: string | undefined, lang: Lang): string {
  if (!pkg) return '';
  if (lang !== 'en') return pkg;
  return pkg
    .replace('Demo Selamanya', 'Demo Forever')
    .replace('Selamanya', 'Forever')
    .replace('1 Bulan', '1 Month')
    .replace('3 Bulan', '3 Months')
    .replace('6 Bulan', '6 Months')
    .replace('1 Tahun', '1 Year')
    .replace('30 Hari', '30 Days')
    .replace('Bulan', 'Months')
    .replace('Hari', 'Days')
    .replace('Pembaharuan Pakej', 'Package Renewal');
}

export const ADMIN_DICT = {
  ms: {
    // Header & Tabs
    weddingTitle: 'Panel Pengantin',
    superAdminTitle: 'Super Admin Panel',
    manageAccount: '⚙️ Urus Akaun',
    logout: 'Log Keluar',
    lightMode: '☀️ Terang',
    darkMode: '🌙 Gelap',
    saveChanges: 'Simpan Perubahan',
    saving: 'Menyimpan...',
    unsavedChanges: 'Terdapat perubahan yang belum disimpan!',
    websiteLang: 'Bahasa Laman Web',
    liveSite: '🌐 Laman Langsung ↗',
    
    // Tabs
    tabTema: '🎨 Tema',
    tabLatar: '🖼️ Latar',
    tabSkrin: '📱 Skrin',
    tabTeks: '✏️ Teks',
    tabMaklumat: '💍 Maklumat',
    tabMedia: '📸 Media',
    tabAturcara: '📋 Aturcara',
    tabKenalan: '📞 Kenalan',
    tabLokasi: '📍 Lokasi',
    tabKewangan: '💰 Kewangan',
    tabHadiah: '🎁 Hadiah',
    tabRsvp: '📨 RSVP',
    tabAkaun: '⚙️ Akaun',

    // Text Overrides Section
    textOverridesSection: '✏️ Sunting Teks Laman Web',
    textOverridesDesc: 'Tulis teks kustom untuk menggantikan teks lalai di laman jemputan anda. Kosongkan untuk guna teks asal.',
    textGroupGate: '🚪 Skrin Pembukaan',
    textGroupHero: '💌 Kad Jemputan',
    textGroupParents: '👨‍👩‍👦 Bahagian Keluarga',
    textGroupCountdown: '⏱️ Kiraan Mundur',
    textGroupProgramme: '📋 Aturcara',
    textGroupGallery: '📸 Galeri & Ucapan',
    textGroupMessage: '💝 Mesej Pasangan',
    textGroupClosing: '🙏 Penutup',
    textGroupNav: '🧭 Navigasi & Popup',
    textGroupRsvp: '📨 Popup RSVP',
    textGroupCalendar: '📅 Popup Kalendar',
    textGroupContact: '📞 Popup Hubungi',
    textGroupLocation: '📍 Popup Lokasi',
    textGroupMoney: '💰 Popup Sumbangan',
    textGroupGift: '🎁 Popup Hadiah',

    // Section Titles in Admin
    themeSection: '🎨 Pilih Tema',
    backgroundSection: '🖼️ Latar Belakang',
    sectionVisibility: '📱 Urus Skrin',
    sectionVisibilityDesc: 'Aktifkan atau nyahaktifkan setiap bahagian laman jemputan anda.',
    weddingDetails: '💍 Maklumat Perkahwinan',
    mediaSection: '📸 Foto & Video',
    programmeSection: '📋 Aturcara Majlis',
    contactSection: '📞 Senarai Kenalan',
    locationSection: '📍 Lokasi & Peta',
    moneySection: '💰 Sumbangan Bank & QR',
    giftSection: '🎁 Urus Hadiah',
    rsvpSection: '📨 Senarai RSVP',
    accountSection: '⚙️ Tetapan Akaun',

    // Common labels
    groom: 'Pengantin Lelaki',
    bride: 'Pengantin Perempuan',
    shortName: 'Nama Panggilan',
    fullName: 'Nama Penuh',
    fatherName: 'Nama Bapa',
    motherName: 'Nama Ibu',
    weddingDate: 'Tarikh Majlis',
    weddingDay: 'Hari',
    weddingTime: 'Masa Majlis',
    receptionTime: 'Masa Ketibaan',
    venue: 'Lokasi / Dewan',
    venueAddress: 'Alamat Penuh',

    // Super Admin Dashboard
    couplesTab: '👥 Pasangan',
    accountingTab: '💰 Laporan Kewangan',
    totalCouples: 'Jumlah Pasangan',
    activeCouples: 'Laman Aktif',
    expiredOffCouples: 'Laman Tamat Tempoh / Off',
    totalRsvp: 'Jumlah RSVP',
    totalRevenue: 'Jumlah Pendapatan',
    addCouple: '＋ Tambah Pasangan',
    addPayment: '＋ Rekod Bayaran',
    searchPlaceholder: '🔍 Cari nama, ID, lokasi...',
    accessEditor: 'Editor',
    resetPassword: 'Tukar Pass',
    delete: 'Padam',
    confirmDelete: 'Adakah anda pasti untuk memadam pasangan ini?',
    coupleHeader: 'Pasangan',
    loginIdHeader: 'Login ID',
    packageHeader: 'Pakej',
    expiryHeader: 'Tamat Tempoh (Baki)',
    statusModeHeader: 'Status Mode',
    actionsHeader: 'Tindakan',
    statusActive: '✓ Aktif',
    statusWarn: '⚠️ Hampir Tamat',
    statusExpired: '✗ Tamat Tempoh / Off',
    daysLeft: 'hari baki',
    noCouplesFound: 'Tiada pasangan dijumpai.',
    addFirstCouple: 'Tambah Pasangan Pertama',
    
    // Auth login
    loginHeader: 'Log Masuk',
    password: 'Kata Laluan',
    loginBtn: 'Log Masuk',
    loggingIn: 'Masuk...',
  },
  en: {
    // Header & Tabs
    weddingTitle: 'Couple Admin',
    superAdminTitle: 'Super Admin Panel',
    manageAccount: '⚙️ Manage Account',
    logout: 'Log Out',
    lightMode: '☀️ Light',
    darkMode: '🌙 Dark',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    unsavedChanges: 'You have unsaved changes!',
    websiteLang: 'Website Language',
    liveSite: '🌐 Live Site ↗',

    // Tabs
    tabTema: '🎨 Theme',
    tabLatar: '🖼️ Background',
    tabSkrin: '📱 Sections',
    tabTeks: '✏️ Text',
    tabMaklumat: '💍 Details',
    tabMedia: '📸 Media',
    tabAturcara: '📋 Timeline',
    tabKenalan: '📞 Contacts',
    tabLokasi: '📍 Location',
    tabKewangan: '💰 Cash Gift',
    tabHadiah: '🎁 Gift Registry',
    tabRsvp: '📨 RSVP List',
    tabAkaun: '⚙️ Account',

    // Text Overrides Section
    textOverridesSection: '✏️ Edit Website Text',
    textOverridesDesc: 'Write custom text to override default labels on your invitation site. Leave blank to use the default.',
    textGroupGate: '🚪 Gate Screen',
    textGroupHero: '💌 Invitation Card',
    textGroupParents: '👨‍👩‍👦 Parents Section',
    textGroupCountdown: '⏱️ Countdown',
    textGroupProgramme: '📋 Programme',
    textGroupGallery: '📸 Gallery & Wishes',
    textGroupMessage: '💝 Couple Message',
    textGroupClosing: '🙏 Closing',
    textGroupNav: '🧭 Navigation & Popups',
    textGroupRsvp: '📨 RSVP Popup',
    textGroupCalendar: '📅 Calendar Popup',
    textGroupContact: '📞 Contact Popup',
    textGroupLocation: '📍 Location Popup',
    textGroupMoney: '💰 Cash Gift Popup',
    textGroupGift: '🎁 Gift Registry Popup',

    // Section Titles in Admin
    themeSection: '🎨 Choose Theme',
    backgroundSection: '🖼️ Background Image',
    sectionVisibility: '📱 Manage Sections',
    sectionVisibilityDesc: 'Enable or disable each section of your invitation site.',
    weddingDetails: '💍 Wedding Details',
    mediaSection: '📸 Photo & Video',
    programmeSection: '📋 Event Schedule',
    contactSection: '📞 Contact List',
    locationSection: '📍 Location & Map',
    moneySection: '💰 Bank & QR Contribution',
    giftSection: '🎁 Gift Registry Management',
    rsvpSection: '📨 RSVP List',
    accountSection: '⚙️ Account Settings',

    // Common labels
    groom: 'Groom',
    bride: 'Bride',
    shortName: 'Short Name',
    fullName: 'Full Name',
    fatherName: 'Father\'s Name',
    motherName: 'Mother\'s Name',
    weddingDate: 'Wedding Date',
    weddingDay: 'Day',
    weddingTime: 'Event Time',
    receptionTime: 'Reception Time',
    venue: 'Venue Name',
    venueAddress: 'Full Address',

    // Super Admin Dashboard
    couplesTab: '👥 Couples',
    accountingTab: '💰 Financial Report',
    totalCouples: 'Total Couples',
    activeCouples: 'Active Sites',
    expiredOffCouples: 'Expired / Off Sites',
    totalRsvp: 'Total RSVPs',
    totalRevenue: 'Total Revenue',
    addCouple: '＋ Add Couple',
    addPayment: '＋ Record Payment',
    searchPlaceholder: '🔍 Search name, ID, venue...',
    accessEditor: 'Edit Site',
    resetPassword: 'Reset Pass',
    delete: 'Delete',
    confirmDelete: 'Are you sure you want to delete this couple account?',
    coupleHeader: 'Couple',
    loginIdHeader: 'Login ID',
    packageHeader: 'Package',
    expiryHeader: 'Expiry (Remaining)',
    statusModeHeader: 'Status Mode',
    actionsHeader: 'Actions',
    statusActive: '✓ Active',
    statusWarn: '⚠️ Nearing Expiry',
    statusExpired: '✗ Expired / Off',
    daysLeft: 'days left',
    noCouplesFound: 'No couples found.',
    addFirstCouple: 'Add First Couple',

    // Auth login
    loginHeader: 'Sign In',
    password: 'Password',
    loginBtn: 'Log In',
    loggingIn: 'Signing in...',
  }
} as const;

export const INVITATION_DICT = {
  ms: {
    // Gate
    openInvitation: 'Buka Jemputan',
    walimatulurus: 'Walimatulurus',
    dearGuest: 'Kepada YBhg. Dato\'/Datin/Tuan/Puan/Encik/Cik:',

    // Hero
    celebratingLove: 'Meraikan Cinta',
    saveTheDate: 'Simpan Tarikh Ini',
    heroDateLabel: 'Tarikh',
    heroVenueLabel: 'Tempat Majlis',

    // Parents
    cordialInvitation: 'Undangan Mesra',
    parentsInviting: 'Dengan Penuh Kesyukuran Kami',
    inviteSentence: 'Menjemput Dato\' / Datin / Tuan / Puan / Encik / Cik ke majlis perkahwinan anakanda kami',
    parentsRoleGroom: 'Keluarga Pengantin Lelaki',
    parentsRoleBride: 'Keluarga Pengantin Perempuan',
    parentsInviteLine1: 'Menjemput',
    parentsInviteLine2: 'Dato\' / Datin / Tuan / Puan / Encik / Cik',
    parentsInviteLine3: 'ke Majlis Perkahwinan Anak Kami',

    // Countdown
    countdownTitle: 'Kiraan Mundur Majlis',
    days: 'Hari',
    hours: 'Jam',
    minutes: 'Minit',
    seconds: 'Saat',
    addToCalendar: '📅 Tambah ke Kalendar',
    countdownEventPassed: 'Majlis telah berlangsung!',

    // Programme
    eventSchedule: 'Aturcara Majlis',

    // Gallery & Wishes
    galleryTitle: 'Galeri Kenangan',
    wishesTitle: 'Ucapan & Doa Restu',
    sendWish: '✏️ Hantar Ucapan',
    yourName: 'Nama Anda',
    yourWish: 'Tuliskan ucapan & doa restu...',
    submitWish: 'Hantar Ucapan',
    sending: 'Menghantar...',
    galleryNoWishes: 'Tiada ucapan lagi. Jadilah yang pertama! 💌',
    galleryWishThanks: 'Terima kasih atas ucapan anda!',
    galleryWishNamePlaceholder: 'Nama...',
    galleryWishLabel: 'Ucapan / Doa',

    // Couple Message
    fromUs: 'Dari Kami Berdua',

    // Closing
    thankYou: 'Terima Kasih',

    // Floating Nav & Popups
    navRsvp: 'RSVP',
    navCalendar: 'Kalendar',
    navContact: 'Hubungi',
    navLocation: 'Lokasi',
    navMoney: 'Sumbangan',
    navGift: 'Hadiah',

    // Popups
    rsvpHeader: '📨 Pengesahan Kehadiran (RSVP)',
    rsvpAttendance: 'Adakah anda akan hadir?',
    attendingYes: 'Ya, Saya Akan Hadir',
    attendingNo: 'Maaf, Tidak Dapat Hadir',
    paxCount: 'Jumlah Jangkaan Tetamu (Pax)',
    submitRsvp: 'Hantar RSVP',

    calendarHeader: '📅 Simpan Tarikh',
    googleCalendar: 'Google Calendar',
    appleCalendar: 'Apple / Outlook Calendar',

    contactHeader: '📞 Hubungi Keluarga',
    call: 'Telefon',
    whatsapp: 'WhatsApp',

    locationHeader: '📍 Lokasi Majlis',
    openWaze: 'Waze',
    openGoogleMaps: 'Google Maps',

    moneyHeader: '💰 Sumbangan Ikhlas',
    bankAccount: 'Akaun Bank',
    accountNo: 'Nombor Akaun',
    copyAccountNo: '📋 Salin No Akaun',
    copied: '✅ Disalin!',

    giftHeader: '🎁 Senarai Hadiah',
    suggestGift: '＋ Cadang Hadiah Baru',
    buyLink: 'Beli ↗',
    claimedBy: 'Dituntut oleh',
    giftName: 'Nama Hadiah',
    shopLink: 'Link Kedai',
    fetchImage: '🔄 Dapatkan Gambar',
    fetchPrice: '🔄 Harga',
    priceLabel: 'Harga',
    uploadImage: '📁 Pilih Fail Gambar',
    submitGift: 'Hantar Cadangan',
  },
  en: {
    // Gate
    openInvitation: 'Open Invitation',
    walimatulurus: 'Wedding Ceremony',
    dearGuest: 'Dear Valued Guest:',

    // Hero
    celebratingLove: 'Celebrating Love',
    saveTheDate: 'Save The Date',
    heroDateLabel: 'Date',
    heroVenueLabel: 'Venue',

    // Parents
    cordialInvitation: 'Cordial Invitation',
    parentsInviting: 'With Joy and Gratitude, We',
    inviteSentence: 'Warmly invite you to celebrate the wedding of our beloved children',
    parentsRoleGroom: 'Groom\'s Family',
    parentsRoleBride: 'Bride\'s Family',
    parentsInviteLine1: 'Warmly invite you',
    parentsInviteLine2: 'Our Valued Guests',
    parentsInviteLine3: 'to celebrate the wedding of our children',

    // Countdown
    countdownTitle: 'Event Countdown',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    addToCalendar: '📅 Add to Calendar',
    countdownEventPassed: 'The event has taken place!',

    // Programme
    eventSchedule: 'Event Schedule',

    // Gallery & Wishes
    galleryTitle: 'Photo Gallery',
    wishesTitle: 'Wishes & Blessings',
    sendWish: '✏️ Send a Wish',
    yourName: 'Your Name',
    yourWish: 'Write your blessings & warm wishes...',
    submitWish: 'Send Wish',
    sending: 'Sending...',
    galleryNoWishes: 'No wishes yet. Be the first! 💌',
    galleryWishThanks: 'Thank you for your warm wish!',
    galleryWishNamePlaceholder: 'Your name...',
    galleryWishLabel: 'Wish / Blessing',

    // Couple Message
    fromUs: 'From Both of Us',

    // Closing
    thankYou: 'Thank You',

    // Floating Nav & Popups
    navRsvp: 'RSVP',
    navCalendar: 'Calendar',
    navContact: 'Contact',
    navLocation: 'Location',
    navMoney: 'Cash Gift',
    navGift: 'Gifts',

    // Popups
    rsvpHeader: '📨 Attendance RSVP',
    rsvpAttendance: 'Will you be attending?',
    attendingYes: 'Yes, I Will Attend',
    attendingNo: 'Sorry, Unable to Attend',
    paxCount: 'Number of Guests (Pax)',
    submitRsvp: 'Submit RSVP',

    calendarHeader: '📅 Save The Date',
    googleCalendar: 'Google Calendar',
    appleCalendar: 'Apple / Outlook Calendar',

    contactHeader: '📞 Contact Family',
    call: 'Call',
    whatsapp: 'WhatsApp',

    locationHeader: '📍 Event Location',
    openWaze: 'Waze',
    openGoogleMaps: 'Google Maps',

    moneyHeader: '💰 Cash Contribution',
    bankAccount: 'Bank Account',
    accountNo: 'Account Number',
    copyAccountNo: '📋 Copy Account No',
    copied: '✅ Copied!',

    giftHeader: '🎁 Gift Registry',
    suggestGift: '＋ Suggest New Gift',
    buyLink: 'Buy ↗',
    claimedBy: 'Claimed by',
    giftName: 'Gift Name',
    shopLink: 'Store Link',
    fetchImage: '🔄 Get Image',
    fetchPrice: '🔄 Price',
    priceLabel: 'Price',
    uploadImage: '📁 Upload Image File',
    submitGift: 'Submit Gift',
  }
} as const;

// Helper: get invitation text with overrides
export function getInvitationText(lang: Lang, overrides?: Record<string, string>) {
  const base = INVITATION_DICT[lang];
  if (!overrides || Object.keys(overrides).length === 0) return base;
  return { ...base, ...overrides } as typeof base;
}

// All overridable invitation text keys grouped for the admin editor
export const INVITATION_TEXT_KEYS = [
  {
    group: 'textGroupGate',
    keys: ['openInvitation', 'walimatulurus', 'dearGuest'],
  },
  {
    group: 'textGroupHero',
    keys: ['celebratingLove', 'saveTheDate', 'heroDateLabel', 'heroVenueLabel'],
  },
  {
    group: 'textGroupParents',
    keys: ['cordialInvitation', 'parentsInviting', 'inviteSentence', 'parentsRoleGroom', 'parentsRoleBride', 'parentsInviteLine1', 'parentsInviteLine2', 'parentsInviteLine3'],
  },
  {
    group: 'textGroupCountdown',
    keys: ['countdownTitle', 'days', 'hours', 'minutes', 'seconds', 'addToCalendar', 'countdownEventPassed'],
  },
  {
    group: 'textGroupProgramme',
    keys: ['eventSchedule'],
  },
  {
    group: 'textGroupGallery',
    keys: ['galleryTitle', 'wishesTitle', 'sendWish', 'yourName', 'yourWish', 'submitWish', 'sending', 'galleryNoWishes', 'galleryWishThanks', 'galleryWishNamePlaceholder', 'galleryWishLabel'],
  },
  {
    group: 'textGroupMessage',
    keys: ['fromUs'],
  },
  {
    group: 'textGroupClosing',
    keys: ['thankYou'],
  },
  {
    group: 'textGroupNav',
    keys: ['navRsvp', 'navCalendar', 'navContact', 'navLocation', 'navMoney', 'navGift'],
  },
  {
    group: 'textGroupRsvp',
    keys: ['rsvpHeader', 'rsvpAttendance', 'attendingYes', 'attendingNo', 'paxCount', 'submitRsvp'],
  },
  {
    group: 'textGroupCalendar',
    keys: ['calendarHeader', 'googleCalendar', 'appleCalendar'],
  },
  {
    group: 'textGroupContact',
    keys: ['contactHeader', 'call', 'whatsapp'],
  },
  {
    group: 'textGroupLocation',
    keys: ['locationHeader', 'openWaze', 'openGoogleMaps'],
  },
  {
    group: 'textGroupMoney',
    keys: ['moneyHeader', 'bankAccount', 'accountNo', 'copyAccountNo', 'copied'],
  },
  {
    group: 'textGroupGift',
    keys: ['giftHeader', 'suggestGift', 'buyLink', 'claimedBy', 'giftName', 'shopLink', 'fetchImage', 'fetchPrice', 'priceLabel', 'uploadImage', 'submitGift'],
  },
];

// Helper: get admin text with global overrides
export function getAdminText(lang: Lang, overrides?: Record<string, string>) {
  const base = ADMIN_DICT[lang];
  if (!overrides || Object.keys(overrides).length === 0) return base;
  return { ...base, ...overrides } as typeof base;
}

// All overridable admin text keys grouped for the super admin editor
export const ADMIN_TEXT_KEYS = [
  {
    group: 'Tabs',
    keys: ['tabTema', 'tabLatar', 'tabSkrin', 'tabTeks', 'tabMaklumat', 'tabMedia', 'tabAturcara', 'tabKenalan', 'tabLokasi', 'tabKewangan', 'tabHadiah', 'tabRsvp', 'tabAkaun']
  },
  {
    group: 'Header & Auth',
    keys: ['weddingTitle', 'superAdminTitle', 'manageAccount', 'logout', 'lightMode', 'darkMode', 'saveChanges', 'saving', 'unsavedChanges', 'websiteLang', 'liveSite', 'loginHeader', 'password', 'loginBtn', 'loggingIn']
  },
  {
    group: 'Super Admin Dashboard',
    keys: ['couplesTab', 'accountingTab', 'totalCouples', 'activeCouples', 'expiredOffCouples', 'totalRsvp', 'totalRevenue', 'addCouple', 'addPayment', 'searchPlaceholder', 'accessEditor', 'resetPassword', 'delete', 'confirmDelete', 'coupleHeader', 'loginIdHeader', 'packageHeader', 'expiryHeader', 'statusModeHeader', 'actionsHeader', 'statusActive', 'statusWarn', 'statusExpired', 'daysLeft', 'noCouplesFound', 'addFirstCouple']
  },
  {
    group: 'Common Labels',
    keys: ['groom', 'bride', 'shortName', 'fullName', 'fatherName', 'motherName', 'weddingDate', 'weddingDay', 'weddingTime', 'receptionTime', 'venue', 'venueAddress', 'quote', 'quoteSource', 'coupleMessageTitle', 'coupleMessage', 'closingTitle', 'closingText', 'showClosingPhoto', 'youtubeUrl', 'mapEmbedUrl', 'wazeLink', 'googleMapsLink', 'bankName', 'bankAccountName', 'bankAccountNo', 'bankQrUrl']
  },
  {
    group: 'Section Titles',
    keys: ['themeSection', 'backgroundSection', 'sectionVisibility', 'sectionVisibilityDesc', 'weddingDetails', 'mediaSection', 'programmeSection', 'contactSection', 'locationSection', 'moneySection', 'giftSection', 'rsvpSection', 'accountSection']
  },
  {
    group: 'Text Overrides Section',
    keys: ['textOverridesSection', 'textOverridesDesc', 'textGroupGate', 'textGroupHero', 'textGroupParents', 'textGroupCountdown', 'textGroupProgramme', 'textGroupGallery', 'textGroupMessage', 'textGroupClosing', 'textGroupNav', 'textGroupRsvp', 'textGroupCalendar', 'textGroupContact', 'textGroupLocation', 'textGroupMoney', 'textGroupGift']
  }
];
