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


export const AVAILABLE_PACKAGES = [
  { key: '1month', days: '30' },
  { key: '3month', days: '90' },
  { key: '6month', days: '180' },
  { key: '1year', days: '365' },
  { key: 'unlimited', days: '36500' },
  { key: 'custom', days: '30' },

];


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
    textTabLabel: '✏️ Teks Global (Admin/Log Masuk)',
    tabTema: '🎨 Tema',
    tabReka: '✨ Reka Bentuk',
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
    tabUcapan: '💌 Rekod Ucapan',
    tabAkaun: '⚙️ Akaun',

    // Extracted UI Strings
    loginIdLabel: 'Login ID',
    enterLoginId: 'Masukkan Login ID anda...',
    enterPassword: 'Masukkan kata laluan...',
    adminLoginHint: 'ID Login dan kata laluan diberikan oleh pentadbir.',
    superAdminLoginHint: 'Kali pertama? Masukkan kata laluan pilihan anda untuk menetapkannya.',
    superAdminLoginSuccess: '✅ Log Masuk Berjaya!',
    connError: 'Ralat sambungan. Cuba semula.',
    financialLoading: 'Memuatkan data kewangan...',
    financialNoData: 'Tiada rekod bayaran dijumpai.',
    financialFirstLog: 'Log Bayaran Pertama',
    totalRevenueTitle: 'Jumlah Pendapatan',
    totalTransactionsTitle: 'Jumlah Transaksi Bayaran',
    avgPerPaymentTitle: 'Purata Setiap Bayaran',
    avgPerCoupleTitle: 'Purata Pendapatan / Pasangan',
    manualLogBtn: '＋ Log Bayaran Manual',
    dateLabel: 'Tarikh',
    coupleLabel: 'Pasangan',
    packageLabel: 'Pakej',
    amountLabel: 'Jumlah Bayaran',
    notesLabel: 'Catatan / Nota',
    actionLabel: 'Tindakan',
    updateBtn: '✏️ Kemaskini',
    deleteBtn: '🗑️ Padam',
    exportAllBtn: '📄 Export Semua',
    exportJson: '⬇️ Export Overrides',
    importJson: '⬆️ Import JSON',
    defaultBtn: '↺ Default',
    autoLabel: '(Auto)',
    accessQualTitle: '🎉 Kelayakan Akses',
    accessQualDesc: 'Simpan maklumat ini dan kongsikan kepada pasangan.',
    inviteUrlLabel: 'URL Jemputan',
    adminUrlLabel: 'URL Admin',
    genNewPassBtn: '🔑 Jana Kata Laluan Baru',
    closeBtn: 'Tutup',
    delCoupleTitle: '⚠️ Padam Pasangan?',
    delCoupleDesc1: 'Tindakan ini akan memadam',
    delCoupleDesc2: 'semua data',
    delCoupleDesc3: 'pasangan ini termasuk RSVP, ucapan, dan tetapan laman. Tindakan ini tidak boleh dibuat asal.',
    cancelBtn: 'Batal',
    pkgSubLabel: 'Pakej Langganan',
    expDateLabel: 'Tarikh Tamat Tempoh',
    siteStatusLabel: 'Status Laman Web',
    changePassPanel: '🔐 Tukar Kata Laluan Panel',
    currPassLabel: 'Kata Laluan Semasa *',
    newPassLabel: 'Kata Laluan Baru *',
    confirmPassLabel: 'Sahkan Kata Laluan Baru *',
    passChangedSuccess: '✅ Kata laluan berjaya ditukar!',
    tempPassLabel: 'Kata Laluan Sementara *',
    uploadGalleryBtn: '📁 Muat Naik Gambar Galeri',
    uploading: '⏳ Memuat naik...',
    manualUrlHint: 'Atau masukkan pautan URL gambar secara manual (satu pautan setiap baris):',
    addProgBtn: '＋ Tambah Aturcara',
    addContactBtn: '＋ Tambah Kenalan',
    addGiftBtn: '＋ Tambah Hadiah Baru',
    giftNameLabel: 'Nama Hadiah *',
    shopLinkLabel: 'Link Kedai (Pilihan)',
    publicSearch: 'Carian Awam',
    priceOptional: 'Harga (RM / Pilihan)',
    totalRsvpLabel: 'Jumlah RSVP',
    attendLabel: 'Hadir',
    notAttendLabel: 'Tidak Hadir',
    expectedGuestLabel: 'Jangkaan Tetamu',
    wishesLabel: 'Ucapan',
    refreshBtn: '🔄 Muat Semula',
    noRsvpYet: 'Tiada RSVP lagi.',
    noWishesYet: 'Tiada ucapan lagi.',
    defaultDeleteBtn: '✕ Lalai',
    uploadBtn: '📁 Muat Naik',
    urlLabel: '🔗 URL',
    themeCollection: '✨ Koleksi Tema',
    mustChangePassTitle: '🔐 Wajib Tukar Kata Laluan Semasa',
    mustChangePassDesc: 'Bagi menjamin keselamatan laman web anda, sila tukar kata laluan sementara yang diberikan oleh pentadbir sebelum memulakan tetapan.',
    saveWishBtn: 'Simpan Ucapan',
    saveFeaturesBtn: '✓ Simpan Ciri',
    changeAndStartBtn: '✓ Tukar & Mula Setup',
    addWishBtn: '＋ Tambah Ucapan Manual',
    editWishTitle: '✏️ Kemaskini Ucapan Tetamu',
    addWishTitle: '＋ Tambah Ucapan Manual',
    saved: '✓ Tersimpan',
    selectImageFile: '📁 Pilih Fail Gambar',
    disableImage: 'Nyahaktif Gambar',

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
    superAdminSetupTitle: '👑 Tetapan Pertama Super Admin',
    superAdminUsernameLabel: 'Nama Pengguna Super Admin *',
    enterSuperAdminUsername: 'Masukkan nama pengguna super admin...',
    confirmPasswordLabel: 'Sahkan Kata Laluan *',
    enterConfirmPassword: 'Masukkan semula kata laluan...',
    setupSuperAdminBtn: '🚀 Cipta Akaun Super Admin',
    settingUp: 'Menetapkan...',
    superAdminSetupSuccess: '✅ Nama pengguna {username} telah didaftarkan sebagai Super Admin untuk sistem ini!',
    usernameOrPasswordInvalid: 'Nama pengguna atau kata laluan tidak sah.',
    passwordsDoNotMatch: 'Kata laluan dan pengesahan kata laluan tidak sepadan.',
    // Dynamic Packages
    pkg_1month: '1 Bulan',
    pkg_3month: '3 Bulan',
    pkg_6month: '6 Bulan',
    pkg_1year: '1 Tahun',
    pkg_unlimited: 'Unlimited (Selamanya)',
    pkg_custom: 'Custom (Custom Days)',

    // Add Couple Modal
    addCoupleModalTitle: '➕ Tambah Pasangan Baru',
    groomNameLabel: 'Nama Pengantin Lelaki *',
    brideNameLabel: 'Nama Pengantin Perempuan *',
    weddingDateLabel: 'Tarikh Perkahwinan *',
    themeLabel: 'Tema Asal',
    pkgSubLabel2: 'Pakej Langganan *',
    activeDaysLabel: 'Tempoh Aktif (Hari)',
    regFeeLabel: 'Bayaran Pendaftaran (RM)',
    customPassLabel: 'Kata Laluan (pilihan)',
    customLoginIdLabel: 'Login ID (pilihan — kosongkan untuk jana automatik)',
    creatingStatus: 'Mencipta...',
    createCoupleBtn: '✓ Cipta Pasangan',
    
    // Edit Couple Modal
    editCoupleModalTitle: '✏️ Kemaskini Profil Pasangan',
    savingStatus: 'Menyimpan...',
    updateProfileBtn: '✓ Kemaskini',
    
    // Date Locale
    dateLocale: 'ms-MY',

    // Group Titles
    group_Tabs: 'Navigasi Tab',
    group_HeaderAuth: 'Header & Auth',
    group_SuperAdmin: 'Dashboard Super Admin',
    group_Common: 'Label Biasa',
    group_SectionTitles: 'Tajuk Bahagian',
    group_TextOverrides: 'Urus Teks Jemputan',
    group_LogMasuk: 'Log Masuk',
    group_Kewangan: 'Laporan Kewangan',
    group_PanelSuper: 'Butang & Aksi Super Admin',
    group_PanelAdmin: 'Butang & Aksi Admin',
    group_ModalTambah: 'Modal Tambah/Kemaskini Pasangan',
    group_PakejLangganan: 'Pakej Langganan',
    group_Settings: 'Tetapan Sistem',
    group_Notifications: 'Notifikasi & Pop-up',
    group_Tooltips: 'Tooltip (Teks Hover Butang)',
    group_SuperAdminModals: 'Modal SuperAdmin (Bayaran)',
    group_CredentialModal: 'Modal Kelayakan Akses',
    group_ConfirmModals: 'Modal Pengesahan & Padam',
    group_AccountModal: 'Modal Urus Akaun',
    group_FormPlaceholders: 'Placeholder Borang',

    // Toast & Notification Strings
    jsonImportSuccessToast: 'Lalai JSON Baru Ditetapkan! Semua togol dimulakan semula (OFF).',
    globalTextSavedToast: 'Teks Global Berjaya Disimpan!',
    globalTextSaveErrorToast: 'Gagal menyimpan perubahan teks.',
    jsonImportPromptToast: 'Fail JSON dimuat naik. Klik "Simpan Perubahan" untuk menetapkan sebagai lalai!',
    jsonInvalidFormatToast: 'Format fail tidak sah (bukan objek JSON).',
    jsonReadErrorToast: 'Ralat membaca fail JSON.',

    // Tooltip strings (hover popups on buttons)
    toggleThemeTooltip: 'Tukar Tema (Terang / Gelap)',
    statusOnTooltip: 'Sentiasa Aktif (On)',
    statusOffTooltip: 'Sentiasa Tutup (Off)',
    statusAutoTooltip: 'Auto Nyahaktif apabila tamat tempoh pakej',
    viewInviteTooltip: 'Lihat jemputan',
    editPkgTooltip: 'Kemaskini Pakej & Tarikh',
    editSiteTooltip: 'Ubah Tetapan Laman Web',
    viewCredTooltip: 'Papar Kelayakan Akses',
    deleteTooltip: 'Padam',
    updatePaymentTooltip: 'Kemaskini rekod bayaran',
    deletePaymentTooltip: 'Padam rekod bayaran',
    resetToDefaultTooltip: 'Kembali ke teks lalai',
    toggleEditTooltip: 'Aktifkan / Nyahaktifkan Suntingan Teks',
    togglePhonePreviewTooltip: 'Sembunyikan / Tunjukkan Pratonton Telefon',
    openLiveSiteTooltip: 'Buka laman jemputan langsung di tab baru (simpan dahulu untuk lihat perubahan)',
    visualBuilderSection: '✨ Perekabentuk Visual Skrin',
    recordIphoneVideoTooltip: 'Rakam Video MP4 iPhone 17 Pro',
    refreshPreviewTooltip: 'Muat semula pratonton',
    invitePreviewTooltip: 'Pratonton Jemputan',
    deleteImageTooltip: 'Padam Gambar',
    configImageSearchTooltip: 'Konfigurasi Carian Gambar',
    configPriceSearchTooltip: 'Konfigurasi Carian Harga',
    restoreThemeDefaultTooltip: 'Pulihkan ke lalai tema',
    resetScreenSettingsTooltip: 'Kembalikan semua tetapan skrin ini ke asal',
    resetAllScreensTooltip: 'Set semula semua skrin ke tetapan asal tema',
    copyAccountNoTooltip: 'Salin No. Akaun',
    viewLargeImageTooltip: 'Klik untuk papar gambar besar',
    configSearchTooltip: 'Konfigurasi Carian',
    toggleYoutubePlayerTooltip: 'Sembunyikan / Papar Pemain YouTube',
    bgMusicTitle: 'Muzik Latar',

    // Credential Modal
    passwordLabel: 'Kata Laluan',
    tempPassNotChanged: '[Kata Laluan Sementara - Belum Ditukar]',
    passChangedByUser: '[Kata Laluan Telah Ditukar Oleh Pengguna]',
    copiedToast: 'Disalin!',
    confirmResetPassPrompt: 'Adakah anda pasti mahu menjana kata laluan baru untuk pasangan ini? Ini akan memaksa pasangan menukar kata laluan sekali lagi pada log masuk seterusnya.',

    // Confirm / Delete Modals
    confirmDeleteBtn: 'Ya, Padam',
    delPaymentTitle: '⚠️ Padam Rekod Bayaran?',
    delPaymentDesc: 'Tindakan ini akan memadam rekod bayaran ini. Tindakan ini tidak boleh dibuat asal.',
    coupleUpdatedToast: '✅ Rekod pasangan berjaya dikemaskini!',
    paymentUpdatedToast: '✅ Rekod bayaran berjaya dikemaskini!',
    paymentRecordedToast: '✅ Bayaran manual direkodkan!',
    passChangedSuccessToast: '✅ Kata laluan berjaya ditukar!',
    loadingData: 'Memuatkan data...',
    mustChangePassBadge: 'Tukar Kata Laluan Wajib',
    searchPaymentsPlaceholder: '🔍  Cari rekod bayaran...',

    // AddPaymentModal
    addPaymentModalTitle: '➕ Log Rekod Bayaran Manual',
    coupleNameLabel2: 'Pasangan Pengantin',
    coupleSelectDefault: '— Kegunaan Am / Bayaran Offline —',
    amountLabelFull: 'Jumlah Bayaran (RM) *',
    pkgDescLabel: 'Perihal Pakej / Nama',
    pkgDescPlaceholder: 'cth: Pembaharuan 30 Hari',
    notesOptLabel: 'Catatan (Pilihan)',
    notesPlaceholder: 'Catatan bayaran cth: Resit bank-in, bayaran tunai...',
    recordingStatus: 'Merekod...',
    recordPaymentBtn: '✓ Rekod Bayaran',

    // EditPaymentModal
    editPaymentModalTitle: '✏️ Kemaskini Rekod Bayaran',
    coupleNameLockedLabel: 'Pasangan Pengantin (Tidak Boleh Diubah)',
    editNotesPlaceholder: 'Catatan bayaran...',

    // EditCoupleModal
    pkgNamePlaceholder: 'Nama pakej...',

    // AccountModal
    currPassPlaceholder: 'Masukkan kata laluan semasa...',
    newPassPlaceholder: 'Masukkan kata laluan baru...',
    confirmPassPlaceholder: 'Masukkan semula kata laluan baru...',
    passMismatchError: 'Kata laluan baru dan pengesahan kata laluan tidak sepadan.',
    genericError: 'Ralat berlaku.',
    connErrorRetry: 'Ralat sambungan. Cuba semula.',
    changingPassStatus: 'Menukar...',
    changePassBtn: '✓ Tukar Kata Laluan',
    manageAccountModalTitle: '⚙️ Urus Akaun',

    // Form Placeholders (AddCouple)
    groomPlaceholder: 'cth: Adam',
    bridePlaceholder: 'cth: Hawa',
    randPassPlaceholder: 'Jana Rawak',
    loginIdPlaceholder: 'cth: adam-hawa-2026',
    generalCancelBtn: 'Batal',
    genericRetry: 'Ralat. Cuba semula.',

    // Feature Toggles Modal
    featureTogglesModalTitle: '⚙️ Urus Ciri & Kebenaran Laman',
    featureTogglesDesc: 'Aktifkan atau nyahaktifkan modul dan alat khusus untuk pasangan ini.',
    toggleRsvp: '📨 Modul & Tab RSVP',
    toggleMoney: '💰 Modul Sumbangan Bank & QR',
    toggleGift: '🎁 Modul Senarai Hadiah & Wishlist',
    toggleGallery: '📸 Modul Galeri Foto & Ucapan',
    toggleProgramme: '📋 Modul Aturcara Majlis',
    toggleContact: '📞 Modul Senarai Kenalan Keluarga',
    toggleLocation: '📍 Modul Lokasi & Peta Waze',
    toggleDesignBuilder: '✨ Tab Perekabentuk Visual Skrin',
    toggleMusic: '🎵 Modul Muzik Latar',

    // Wishlist Manager
    wishlistTabAll: 'Semua Hadiah',
    wishlistTabAvailable: 'Belum Dituntut',
    wishlistTabClaimed: 'Telah Dituntut',
    markAsClaimedBtn: '✓ Tanda Dituntut',
    clearClaimBtn: '✕ Padam Tuntutan',
    claimedByGuest: 'Dituntut oleh',
    unclaimedStatus: 'Belum Dituntut',
    claimedStatus: 'Telah Dituntut',
    editWishlistItemTitle: '✏️ Kemaskini Hadiah Wishlist',
    addWishlistItemTitle: '＋ Tambah Hadiah Wishlist',
    claimGuestPrompt: 'Masukkan nama tetamu yang menuntut hadiah ini:',
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
    textTabLabel: '✏️ Global Text (Admin/Login)',
    tabTema: '🎨 Theme',
    tabReka: '✨ Design Builder',
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
    tabUcapan: '💌 Wishes Record',
    tabAkaun: '⚙️ Account',

    // Extracted UI Strings
    loginIdLabel: 'Login ID',
    enterLoginId: 'Enter your Login ID...',
    enterPassword: 'Enter your password...',
    adminLoginHint: 'Login ID and password are provided by the administrator.',
    superAdminLoginHint: 'First time setup? Register your username and password.',
    superAdminLoginSuccess: '✅ Login Successful!',
    superAdminSetupTitle: '👑 Super Admin First-Time Setup',
    superAdminUsernameLabel: 'Super Admin Username *',
    enterSuperAdminUsername: 'Enter super admin username...',
    confirmPasswordLabel: 'Confirm Password *',
    enterConfirmPassword: 'Re-enter password...',
    setupSuperAdminBtn: '🚀 Create Super Admin Account',
    settingUp: 'Setting up...',
    superAdminSetupSuccess: '✅ Username {username} has been registered as the Super Admin for this system!',
    usernameOrPasswordInvalid: 'Invalid username or password.',
    passwordsDoNotMatch: 'Password and confirmation password do not match.',
    connError: 'Connection error. Please try again.',
    financialLoading: 'Loading financial data...',
    financialNoData: 'No payment records found.',
    financialFirstLog: 'Log First Payment',
    totalRevenueTitle: 'Total Revenue',
    totalTransactionsTitle: 'Total Payment Transactions',
    avgPerPaymentTitle: 'Average Per Payment',
    avgPerCoupleTitle: 'Average Revenue / Couple',
    manualLogBtn: '＋ Manual Payment Log',
    dateLabel: 'Date',
    coupleLabel: 'Couple',
    packageLabel: 'Package',
    amountLabel: 'Amount',
    notesLabel: 'Notes',
    actionLabel: 'Action',
    updateBtn: '✏️ Update',
    deleteBtn: '🗑️ Delete',
    exportAllBtn: '📄 Export All',
    exportJson: '⬇️ Export Overrides',
    importJson: '⬆️ Import JSON',
    defaultBtn: '↺ Default',
    autoLabel: '(Auto)',
    accessQualTitle: '🎉 Access Credentials',
    accessQualDesc: 'Save this information and share it with the couple.',
    inviteUrlLabel: 'Invitation URL',
    adminUrlLabel: 'Admin URL',
    genNewPassBtn: '🔑 Generate New Password',
    closeBtn: 'Close',
    delCoupleTitle: '⚠️ Delete Couple?',
    delCoupleDesc1: 'This action will delete',
    delCoupleDesc2: 'all data',
    delCoupleDesc3: 'for this couple including RSVPs, wishes, and site settings. This action cannot be undone.',
    cancelBtn: 'Cancel',
    pkgSubLabel: 'Subscription Package',
    expDateLabel: 'Expiration Date',
    siteStatusLabel: 'Website Status',
    changePassPanel: '🔐 Change Panel Password',
    currPassLabel: 'Current Password *',
    newPassLabel: 'New Password *',
    confirmPassLabel: 'Confirm New Password *',
    passChangedSuccess: '✅ Password changed successfully!',
    tempPassLabel: 'Temporary Password *',
    uploadGalleryBtn: '📁 Upload Gallery Image',
    uploading: '⏳ Uploading...',
    manualUrlHint: 'Or enter image URL manually (one link per line):',
    addProgBtn: '＋ Add Programme',
    addContactBtn: '＋ Add Contact',
    addGiftBtn: '＋ Add New Gift',
    giftNameLabel: 'Gift Name *',
    shopLinkLabel: 'Store Link (Optional)',
    publicSearch: 'Public Search',
    priceOptional: 'Price (RM / Optional)',
    totalRsvpLabel: 'Total RSVP',
    attendLabel: 'Attending',
    notAttendLabel: 'Not Attending',
    expectedGuestLabel: 'Expected Guests',
    wishesLabel: 'Wishes',
    refreshBtn: '🔄 Refresh',
    noRsvpYet: 'No RSVPs yet.',
    noWishesYet: 'No wishes yet.',
    defaultDeleteBtn: '✕ Default',
    uploadBtn: '📁 Upload',
    urlLabel: '🔗 URL',
    themeCollection: '✨ Theme Collection',
    mustChangePassTitle: '🔐 Must Change Current Password',
    mustChangePassDesc: 'To ensure the security of your website, please change the temporary password provided by the administrator before starting configuration.',
    saveWishBtn: 'Save Wish',
    saveFeaturesBtn: '✓ Save Features',
    changeAndStartBtn: '✓ Change & Start Setup',
    addWishBtn: '＋ Add Manual Wish',
    editWishTitle: '✏️ Edit Guest Wish',
    addWishTitle: '＋ Add Manual Wish',
    saved: '✓ Saved',
    selectImageFile: '📁 Select Image File',
    disableImage: 'Disable Image',

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
    // Dynamic Packages
    pkg_1month: '1 Month',
    pkg_3month: '3 Months',
    pkg_6month: '6 Months',
    pkg_1year: '1 Year',
    pkg_unlimited: 'Unlimited (Forever)',
    pkg_custom: 'Custom Days',

    // Add Couple Modal
    addCoupleModalTitle: '➕ Add New Couple',
    groomNameLabel: 'Groom Name *',
    brideNameLabel: 'Bride Name *',
    weddingDateLabel: 'Wedding Date *',
    themeLabel: 'Default Theme',
    pkgSubLabel2: 'Subscription Package *',
    activeDaysLabel: 'Active Duration (Days)',
    regFeeLabel: 'Registration Fee (RM)',
    customPassLabel: 'Password (optional)',
    customLoginIdLabel: 'Login ID (optional — auto-generated)',
    creatingStatus: 'Creating...',
    createCoupleBtn: '✓ Create Couple',
    
    // Edit Couple Modal
    editCoupleModalTitle: '✏️ Edit Couple Profile',
    savingStatus: 'Saving...',
    updateProfileBtn: '✓ Update',
    
    // Date Locale
    dateLocale: 'en-US',

    // Group Titles
    group_Tabs: 'Tab Navigation',
    group_HeaderAuth: 'Header & Auth',
    group_SuperAdmin: 'Super Admin Dashboard',
    group_Common: 'Common Labels',
    group_SectionTitles: 'Section Titles',
    group_TextOverrides: 'Invitation Text Overrides',
    group_LogMasuk: 'Login',
    group_Kewangan: 'Financial Report',
    group_PanelSuper: 'Super Admin Actions',
    group_PanelAdmin: 'Admin Actions',
    group_ModalTambah: 'Add/Edit Couple Modal',
    group_PakejLangganan: 'Subscription Packages',
    group_Settings: 'System Settings',
    group_Notifications: 'Notifications & Popups',
    group_Tooltips: 'Tooltip (Button Hover Text)',
    group_SuperAdminModals: 'SuperAdmin Modals (Payments)',
    group_CredentialModal: 'Access Credentials Modal',
    group_ConfirmModals: 'Confirm / Delete Modals',
    group_AccountModal: 'Manage Account Modal',
    group_FormPlaceholders: 'Form Placeholders',

    // Toast & Notification Strings
    jsonImportSuccessToast: 'New JSON Default Set! All toggles reset to (OFF).',
    globalTextSavedToast: 'Global Text Overrides Saved!',
    globalTextSaveErrorToast: 'Failed to save text overrides.',
    jsonImportPromptToast: 'JSON file uploaded. Click "Save Changes" to set as default!',
    jsonInvalidFormatToast: 'Invalid file format (not a JSON object).',
    jsonReadErrorToast: 'Error reading JSON file.',

    // Tooltip strings (hover popups on buttons)
    toggleThemeTooltip: 'Toggle Theme (Light / Dark)',
    statusOnTooltip: 'Always Active (On)',
    statusOffTooltip: 'Always Inactive (Off)',
    statusAutoTooltip: 'Auto deactivate when package expires',
    viewInviteTooltip: 'View invitation',
    editPkgTooltip: 'Update Package & Date',
    editSiteTooltip: 'Edit Site Settings',
    viewCredTooltip: 'View Access Credentials',
    deleteTooltip: 'Delete',
    updatePaymentTooltip: 'Update payment record',
    deletePaymentTooltip: 'Delete payment record',
    resetToDefaultTooltip: 'Reset to default text',
    toggleEditTooltip: 'Enable / Disable Text Override',
    togglePhonePreviewTooltip: 'Hide / Show Phone Preview',
    openLiveSiteTooltip: 'Open live invitation site in new tab (save first to see changes)',
    visualBuilderSection: '✨ Visual Page Builder',
    recordIphoneVideoTooltip: 'Record iPhone 17 Pro MP4 Video',
    refreshPreviewTooltip: 'Refresh preview',
    invitePreviewTooltip: 'Invitation Preview',
    deleteImageTooltip: 'Delete Image',
    configImageSearchTooltip: 'Configure Image Search',
    configPriceSearchTooltip: 'Configure Price Search',
    restoreThemeDefaultTooltip: 'Restore to theme default',
    resetScreenSettingsTooltip: 'Reset all settings for this screen to default',
    resetAllScreensTooltip: 'Reset all screens to theme default settings',
    copyAccountNoTooltip: 'Copy Account Number',
    viewLargeImageTooltip: 'Click to view large image',
    configSearchTooltip: 'Search Configuration',
    toggleYoutubePlayerTooltip: 'Hide / Show YouTube Player',
    bgMusicTitle: 'Background Music',

    // Credential Modal
    passwordLabel: 'Password',
    tempPassNotChanged: '[Temporary Password — Not Yet Changed]',
    passChangedByUser: '[Password Changed By User]',
    copiedToast: 'Copied!',
    confirmResetPassPrompt: 'Are you sure you want to generate a new password for this couple? This will force them to change their password again on next login.',

    // Confirm / Delete Modals
    confirmDeleteBtn: 'Yes, Delete',
    delPaymentTitle: '⚠️ Delete Payment Record?',
    delPaymentDesc: 'This action will delete this payment record. This cannot be undone.',
    coupleUpdatedToast: '✅ Couple record updated successfully!',
    paymentUpdatedToast: '✅ Payment record updated successfully!',
    paymentRecordedToast: '✅ Manual payment recorded!',
    passChangedSuccessToast: '✅ Password changed successfully!',
    loadingData: 'Loading data...',
    mustChangePassBadge: 'Password Change Required',
    searchPaymentsPlaceholder: '🔍  Search payment records...',

    // AddPaymentModal
    addPaymentModalTitle: '➕ Log Manual Payment Record',
    coupleNameLabel2: 'Couple',
    coupleSelectDefault: '— General / Offline Payment —',
    amountLabelFull: 'Amount (RM) *',
    pkgDescLabel: 'Package Description / Name',
    pkgDescPlaceholder: 'e.g. 30 Day Renewal',
    notesOptLabel: 'Notes (Optional)',
    notesPlaceholder: 'Payment notes e.g. bank receipt, cash payment...',
    recordingStatus: 'Recording...',
    recordPaymentBtn: '✓ Record Payment',

    // EditPaymentModal
    editPaymentModalTitle: '✏️ Update Payment Record',
    coupleNameLockedLabel: 'Couple (Cannot Be Changed)',
    editNotesPlaceholder: 'Payment notes...',

    // EditCoupleModal
    pkgNamePlaceholder: 'Package name...',

    // AccountModal
    currPassPlaceholder: 'Enter current password...',
    newPassPlaceholder: 'Enter new password...',
    confirmPassPlaceholder: 'Re-enter new password...',
    passMismatchError: 'New password and confirmation do not match.',
    genericError: 'An error occurred.',
    connErrorRetry: 'Connection error. Please try again.',
    changingPassStatus: 'Changing...',
    changePassBtn: '✓ Change Password',
    manageAccountModalTitle: '⚙️ Manage Account',

    // Form Placeholders (AddCouple)
    groomPlaceholder: 'e.g. Adam',
    bridePlaceholder: 'e.g. Eve',
    randPassPlaceholder: 'Generate Random',
    loginIdPlaceholder: 'e.g. adam-eve-2026',
    generalCancelBtn: 'Cancel',
    genericRetry: 'Error. Please try again.',

    // Feature Toggles Modal
    featureTogglesModalTitle: '⚙️ Manage Site Features & Permissions',
    featureTogglesDesc: 'Enable or disable specific modules and tools for this couple.',
    toggleRsvp: '📨 RSVP Module & Tab',
    toggleMoney: '💰 Cash Gift & QR Module',
    toggleGift: '🎁 Gift Wishlist & Registry Module',
    toggleGallery: '📸 Photo Gallery & Wishes Module',
    toggleProgramme: '📋 Event Programme Schedule Module',
    toggleContact: '📞 Family Contact List Module',
    toggleLocation: '📍 Location Map & Waze Module',
    toggleDesignBuilder: '✨ Visual Page Builder Tab',
    toggleMusic: '🎵 Background Music Module',

    // Wishlist Manager
    wishlistTabAll: 'All Items',
    wishlistTabAvailable: 'Available',
    wishlistTabClaimed: 'Claimed',
    markAsClaimedBtn: '✓ Mark as Claimed',
    clearClaimBtn: '✕ Clear Claim',
    claimedByGuest: 'Claimed by',
    unclaimedStatus: 'Available',
    claimedStatus: 'Claimed',
    editWishlistItemTitle: '✏️ Edit Wishlist Item',
    addWishlistItemTitle: '＋ Add Wishlist Item',
    claimGuestPrompt: 'Enter the guest name who claimed this gift:',
    // Wish Manager CRUD
    guestNameLabel: 'Guest Name',
    wishMsgLabel: 'Wish & Blessing Message',
    confirmDeleteWish: 'Are you sure you want to delete this wish record?',
  }
} as const;

export const INVITATION_DICT = {
  ms: {
    // Gate
    openInvitation: 'Open Invitation',
    walimatulurus: 'Wedding Invitation',
    dearGuest: 'Dear Valued Guest:',

    // Hero
    celebratingLove: 'Celebrating Love',
    saveTheDate: 'Save The Date',
    heroDateLabel: 'EVENT DATE',
    heroVenueLabel: 'VENUE LOCATION',

    // Parents
    cordialInvitation: 'Cordial Invitation',
    parentsInviting: 'With Joy and Gratitude, We',
    inviteSentence: 'Warmly invite you to celebrate the wedding of our beloved children',
    parentsRoleGroom: 'Groom\'s Family',
    parentsRoleBride: 'Bride\'s Family',
    parentsInviteLine1: 'Warmly Invite',
    parentsInviteLine2: 'Our Valued Guests',
    parentsInviteLine3: 'To The Wedding Reception Of Our Children',

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
    galleryNoWishes: 'No wishes yet. Be the first to leave a wish! 💌',
    galleryWishThanks: 'Thank you for your warm wish!',
    galleryWishNamePlaceholder: 'Enter your name...',
    galleryWishLabel: 'Wish / Blessing Message',

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

    contactHeader: '📞 Family Contact',
    call: 'Call',
    whatsapp: 'WhatsApp',

    locationHeader: '📍 Event Location',
    openWaze: 'Open Waze',
    openGoogleMaps: 'Open Google Maps',

    moneyHeader: '💰 Cash Gift Contribution',
    bankAccount: 'Bank Account',
    accountNo: 'Account Number',
    copyAccountNo: '📋 Copy Account No',
    copied: '✅ Copied to Clipboard!',

    giftHeader: '🎁 Gift Registry & Wishlist',
    suggestGift: '＋ Suggest New Gift',
    buyLink: 'Buy Online ↗',
    claimedBy: 'Claimed by',
    giftName: 'Gift Name',
    shopLink: 'Store Link URL',
    fetchImage: '🔄 Fetch Image',
    fetchPrice: '🔄 Fetch Price',
    priceLabel: 'Price',
    uploadImage: '📁 Upload Image File',
    submitGift: 'Submit Gift',
    copyAccountNoTooltip: 'Copy Account Number to Clipboard',
    viewLargeImageTooltip: 'Click to view full image',
    configSearchTooltip: 'Configure Search',
    configPriceSearchTooltip: 'Configure Price Search',
    toggleYoutubePlayerTooltip: 'Toggle YouTube Audio Player',
    bgMusicTitle: 'Background Music',
  },
  en: {
    // Gate
    openInvitation: 'Open Invitation',
    walimatulurus: 'Wedding Invitation',
    dearGuest: 'Dear Valued Guest:',

    // Hero
    celebratingLove: 'Celebrating Love',
    saveTheDate: 'Save The Date',
    heroDateLabel: 'EVENT DATE',
    heroVenueLabel: 'VENUE LOCATION',

    // Parents
    cordialInvitation: 'Cordial Invitation',
    parentsInviting: 'With Joy and Gratitude, We',
    inviteSentence: 'Warmly invite you to celebrate the wedding of our beloved children',
    parentsRoleGroom: 'Groom\'s Family',
    parentsRoleBride: 'Bride\'s Family',
    parentsInviteLine1: 'Warmly Invite',
    parentsInviteLine2: 'Our Valued Guests',
    parentsInviteLine3: 'To The Wedding Reception Of Our Children',

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
    galleryNoWishes: 'No wishes yet. Be the first to leave a wish! 💌',
    galleryWishThanks: 'Thank you for your warm wish!',
    galleryWishNamePlaceholder: 'Enter your name...',
    galleryWishLabel: 'Wish / Blessing Message',

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

    contactHeader: '📞 Family Contact',
    call: 'Call',
    whatsapp: 'WhatsApp',

    locationHeader: '📍 Event Location',
    openWaze: 'Open Waze',
    openGoogleMaps: 'Open Google Maps',

    moneyHeader: '💰 Cash Gift Contribution',
    bankAccount: 'Bank Account',
    accountNo: 'Account Number',
    copyAccountNo: '📋 Copy Account No',
    copied: '✅ Copied to Clipboard!',

    giftHeader: '🎁 Gift Registry & Wishlist',
    suggestGift: '＋ Suggest New Gift',
    buyLink: 'Buy Online ↗',
    claimedBy: 'Claimed by',
    giftName: 'Gift Name',
    shopLink: 'Store Link URL',
    fetchImage: '🔄 Fetch Image',
    fetchPrice: '🔄 Fetch Price',
    priceLabel: 'Price',
    uploadImage: '📁 Upload Image File',
    submitGift: 'Submit Gift',
    copyAccountNoTooltip: 'Copy Account Number to Clipboard',
    viewLargeImageTooltip: 'Click to view full image',
    configSearchTooltip: 'Configure Search',
    configPriceSearchTooltip: 'Configure Price Search',
    toggleYoutubePlayerTooltip: 'Toggle YouTube Audio Player',
    bgMusicTitle: 'Background Music',
  }
} as const;

// Helper: get invitation text with overrides
export function getInvitationText(lang?: Lang, overrides?: Record<string, string>) {
  const currentLang = lang || 'en';
  const base = INVITATION_DICT[currentLang] || INVITATION_DICT['en'];
  if (!overrides || Object.keys(overrides).length === 0) return base;
  return { ...base, ...overrides } as typeof base;
}

// Helper: get admin text with global overrides
export function getAdminText(lang?: Lang, overrides?: Record<string, string>) {
  const currentLang = lang || 'en';
  const base = ADMIN_DICT[currentLang] || ADMIN_DICT['en'];
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
    keys: ['thankYou', 'toggleYoutubePlayerTooltip', 'bgMusicTitle'],
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
    keys: ['moneyHeader', 'bankAccount', 'accountNo', 'copyAccountNo', 'copied', 'copyAccountNoTooltip'],
  },
  {
    group: 'textGroupGift',
    keys: ['giftHeader', 'suggestGift', 'buyLink', 'claimedBy', 'giftName', 'shopLink', 'fetchImage', 'fetchPrice', 'priceLabel', 'uploadImage', 'submitGift', 'viewLargeImageTooltip', 'configSearchTooltip', 'configPriceSearchTooltip'],
  },
];

// All overridable admin text keys grouped for the super admin editor
export const ADMIN_TEXT_KEYS = [
  {
    group: 'group_Tabs',
    keys: ['textTabLabel', 'couplesTab', 'accountingTab', 'tabTema', 'tabLatar', 'tabSkrin', 'tabTeks', 'tabMaklumat', 'tabMedia', 'tabAturcara', 'tabKenalan', 'tabLokasi', 'tabKewangan', 'tabHadiah', 'tabRsvp', 'tabAkaun']
  },
  {
    group: 'group_HeaderAuth',
    keys: ['weddingTitle', 'superAdminTitle', 'manageAccount', 'logout', 'lightMode', 'darkMode', 'saveChanges', 'saving', 'unsavedChanges', 'websiteLang', 'liveSite', 'loginHeader', 'password', 'loginBtn', 'loggingIn']
  },
  {
    group: 'group_SuperAdmin',
    keys: ['couplesTab', 'accountingTab', 'totalCouples', 'activeCouples', 'expiredOffCouples', 'totalRsvp', 'totalRevenue', 'addCouple', 'addPayment', 'searchPlaceholder', 'accessEditor', 'resetPassword', 'delete', 'confirmDelete', 'coupleHeader', 'loginIdHeader', 'packageHeader', 'expiryHeader', 'statusModeHeader', 'actionsHeader', 'statusActive', 'statusWarn', 'statusExpired', 'daysLeft', 'noCouplesFound', 'addFirstCouple']
  },
  {
    group: 'group_Common',
    keys: ['groom', 'bride', 'shortName', 'fullName', 'fatherName', 'motherName', 'weddingDate', 'weddingDay', 'weddingTime', 'receptionTime', 'venue', 'venueAddress', 'quote', 'quoteSource', 'coupleMessageTitle', 'coupleMessage', 'closingTitle', 'closingText', 'showClosingPhoto', 'youtubeUrl', 'mapEmbedUrl', 'wazeLink', 'googleMapsLink', 'bankName', 'bankAccountName', 'bankAccountNo', 'bankQrUrl']
  },
  {
    group: 'group_SectionTitles',
    keys: ['themeSection', 'backgroundSection', 'sectionVisibility', 'sectionVisibilityDesc', 'weddingDetails', 'mediaSection', 'programmeSection', 'contactSection', 'locationSection', 'moneySection', 'giftSection', 'rsvpSection', 'accountSection']
  },
  {
    group: 'group_TextOverrides',
    keys: ['textOverridesSection', 'textOverridesDesc', 'textGroupGate', 'textGroupHero', 'textGroupParents', 'textGroupCountdown', 'textGroupProgramme', 'textGroupGallery', 'textGroupMessage', 'textGroupClosing', 'textGroupNav', 'textGroupRsvp', 'textGroupCalendar', 'textGroupContact', 'textGroupLocation', 'textGroupMoney', 'textGroupGift']
  },
  {
    group: 'group_LogMasuk',
    keys: ['loginIdLabel', 'enterLoginId', 'enterPassword', 'adminLoginHint', 'superAdminLoginHint', 'superAdminLoginSuccess', 'connError']
  },
  {
    group: 'group_Kewangan',
    keys: ['financialLoading', 'financialNoData', 'financialFirstLog', 'totalRevenueTitle', 'totalTransactionsTitle', 'avgPerPaymentTitle', 'avgPerCoupleTitle', 'manualLogBtn', 'dateLabel', 'coupleLabel', 'packageLabel', 'amountLabel', 'notesLabel', 'actionLabel', 'updateBtn', 'deleteBtn']
  },
  {
    group: 'group_PanelSuper',
    keys: ['exportAllBtn', 'exportJson', 'importJson', 'defaultBtn', 'autoLabel', 'accessQualTitle', 'accessQualDesc', 'inviteUrlLabel', 'adminUrlLabel', 'genNewPassBtn', 'closeBtn', 'delCoupleTitle', 'delCoupleDesc1', 'delCoupleDesc2', 'delCoupleDesc3', 'cancelBtn']
  },
  {
    group: 'group_PanelAdmin',
    keys: ['pkgSubLabel', 'expDateLabel', 'siteStatusLabel', 'changePassPanel', 'currPassLabel', 'newPassLabel', 'confirmPassLabel', 'passChangedSuccess', 'tempPassLabel', 'uploadGalleryBtn', 'uploading', 'manualUrlHint', 'addProgBtn', 'addContactBtn', 'addGiftBtn', 'giftNameLabel', 'shopLinkLabel', 'publicSearch', 'priceOptional', 'totalRsvpLabel', 'attendLabel', 'notAttendLabel', 'expectedGuestLabel', 'wishesLabel', 'refreshBtn', 'noRsvpYet', 'noWishesYet', 'defaultDeleteBtn', 'uploadBtn', 'urlLabel', 'themeCollection', 'mustChangePassTitle', 'mustChangePassDesc', 'saveWishBtn', 'saveFeaturesBtn', 'changeAndStartBtn', 'addWishBtn', 'editWishTitle', 'addWishTitle', 'saved', 'selectImageFile', 'disableImage', 'giftSection', 'wishlistTabAll', 'editWishlistItemTitle', 'addWishlistItemTitle']
  },
  {
    group: 'group_Settings',
    keys: ['dateLocale']
  },
  {
    group: 'group_PakejLangganan',
    keys: AVAILABLE_PACKAGES.map(p => 'pkg_' + p.key)
  },
  {
    group: 'group_ModalTambah',
    keys: ['addCoupleModalTitle', 'groomNameLabel', 'brideNameLabel', 'weddingDateLabel', 'themeLabel', 'pkgSubLabel2', 'activeDaysLabel', 'regFeeLabel', 'customPassLabel', 'customLoginIdLabel', 'creatingStatus', 'createCoupleBtn', 'editCoupleModalTitle', 'savingStatus', 'updateProfileBtn']
  },
  {
    group: 'group_Notifications',
    keys: ['jsonImportSuccessToast', 'globalTextSavedToast', 'globalTextSaveErrorToast', 'jsonImportPromptToast', 'jsonInvalidFormatToast', 'jsonReadErrorToast']
  },
  {
    group: 'group_Tooltips',
    keys: ['toggleThemeTooltip', 'statusOnTooltip', 'statusOffTooltip', 'statusAutoTooltip', 'viewInviteTooltip', 'editPkgTooltip', 'editSiteTooltip', 'viewCredTooltip', 'deleteTooltip', 'updatePaymentTooltip', 'deletePaymentTooltip', 'resetToDefaultTooltip', 'toggleEditTooltip', 'togglePhonePreviewTooltip', 'openLiveSiteTooltip', 'visualBuilderSection', 'recordIphoneVideoTooltip', 'refreshPreviewTooltip', 'invitePreviewTooltip', 'deleteImageTooltip', 'configImageSearchTooltip', 'configPriceSearchTooltip', 'restoreThemeDefaultTooltip', 'resetScreenSettingsTooltip', 'resetAllScreensTooltip', 'copyAccountNoTooltip', 'viewLargeImageTooltip', 'configSearchTooltip', 'toggleYoutubePlayerTooltip', 'bgMusicTitle']
  },
  {
    group: 'group_CredentialModal',
    keys: ['passwordLabel', 'tempPassNotChanged', 'passChangedByUser', 'copiedToast', 'confirmResetPassPrompt']
  },
  {
    group: 'group_ConfirmModals',
    keys: ['confirmDeleteBtn', 'delPaymentTitle', 'delPaymentDesc', 'coupleUpdatedToast', 'paymentUpdatedToast', 'paymentRecordedToast', 'passChangedSuccessToast', 'loadingData', 'mustChangePassBadge', 'searchPaymentsPlaceholder']
  },
  {
    group: 'group_SuperAdminModals',
    keys: ['addPaymentModalTitle', 'coupleNameLabel2', 'coupleSelectDefault', 'amountLabelFull', 'pkgDescLabel', 'pkgDescPlaceholder', 'notesOptLabel', 'notesPlaceholder', 'recordingStatus', 'recordPaymentBtn', 'editPaymentModalTitle', 'coupleNameLockedLabel', 'editNotesPlaceholder', 'pkgNamePlaceholder']
  },
  {
    group: 'group_AccountModal',
    keys: ['manageAccountModalTitle', 'currPassPlaceholder', 'newPassPlaceholder', 'confirmPassPlaceholder', 'passMismatchError', 'genericError', 'connErrorRetry', 'changingPassStatus', 'changePassBtn']
  },
  {
    group: 'group_FormPlaceholders',
    keys: ['groomPlaceholder', 'bridePlaceholder', 'randPassPlaceholder', 'loginIdPlaceholder', 'generalCancelBtn', 'genericRetry']
  }
];
