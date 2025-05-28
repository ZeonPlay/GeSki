// Navigasi Burger Menu
const burgerIcon = document.getElementById('burgerIcon');
const sideNav = document.getElementById('sideNav');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const scrollBottomBtn = document.getElementById('scrollBottomBtn');

burgerIcon.addEventListener('click', () => {
  sideNav.classList.toggle('visible');
  sideNav.classList.toggle('hidden');
});

// Fungsi untuk menutup navigasi
function closeSideNav() {
  sideNav.classList.add('hidden');
  sideNav.classList.remove('visible');
}

// Tutup navigasi saat klik di luar navigasi
document.body.addEventListener('click', (e) => {
  if (!sideNav.contains(e.target) && !burgerIcon.contains(e.target)) {
    closeSideNav();
  }
});

// Tutup navigasi saat tombol ESC ditekan
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sideNav.classList.contains('visible')) {
    closeSideNav();
  }
});

// Variabel untuk Skins Editor
const importJson = document.getElementById('importJson');
const loadJsonBtn = document.getElementById('loadJsonBtn');
const skinList = document.getElementById('skinList');
const fileContent = document.getElementById('fileContent');
const addSkinBtn = document.getElementById('addSkinBtn');
const saveJsonBtn = document.getElementById('saveJsonBtn');
const skinForm = document.getElementById('skinForm');
const skinEditorForm = document.getElementById('skinEditorForm');
const formTitle = document.getElementById('formTitle');
const cancelSkinBtn = document.getElementById('cancelSkinBtn');
const skinModal = document.getElementById('skinModal');

const addAnimationsBtn = document.getElementById('addAnimationsBtn');
const addAttachmentsBtn = document.getElementById('addAttachmentsBtn');
const addOverlayBtn = document.getElementById('addOverlayBtn');
const addColorBtn = document.getElementById('addColorBtn');
const optionalFields = document.getElementById('optionalFields');

let skinsData = null;
let editingIndex = null;

const translations = {
  id: {
    // Shared translations
    download: 'Download',
    copy: 'Salin',

    // Tab navigation
    skinTabBtn: 'Skin Splitter & Merger',
    geometryTabBtn: 'Geometry Splitter & Merger',

    // Geometry Splitter & Merger translations
    geometryTitle: 'Geometry Splitter & Merger',
    geometryDescription: 'Upload satu atau lebih file JSON Minecraft untuk split dan merge model-modelnya.',
    geometryFileBtn: 'Pilih JSON File',
    mergeGeometrySelectedBtn: 'Merge Yang Dipilih',
    mergeGeometryFilesBtn: 'Merge Semua File',

    // Skin Splitter & Merger translations
    skinTitle: 'Skin Splitter & Merger',
    skinDescription: 'Upload skins.json untuk split atau merge skin berdasarkan geometry.',
    skinFileBtn: 'Pilih JSON File',
    geometryBtn: 'Upload Geometry.json',
    validateBtn: 'Validasi Geometry',
    mergeSkinSelectedBtn: 'Merge Yang Dipilih',
    mergeSkinAllBtn: 'Merge Semua File',

    addAnimations: "Tambah Animasi",
    addAttachments: "Tambah Lampiran",
    addOverlay: "Tambah Overlay",
    addColor: "Tambah Warna",
    saveSkin: "Simpan Skin",
    cancel: "Batal",
    editSkin: "Edit Skin",
    newSkin: "Tambah Skin Baru",
    localizationName: "Nama Lokal",
    geometry: "Geometri",
    texture: "Tekstur",
    type: "Tipe",
    free: "Gratis",
    paid: "Berbayar",
    animations: "Animasi",
    attachments: "Lampiran",
    overlay: "Overlay",
    color: "Warna",
  },
  en: {
    // Shared translations
    download: 'Download',
    copy: 'Copy',

    // Tab navigation
    skinTabBtn: 'Skin Splitter & Merger',
    geometryTabBtn: 'Geometry Splitter & Merger',

    // Geometry Splitter & Merger translations
    geometryTitle: 'Geometry Splitter & Merger',
    geometryDescription: 'Upload one or more Minecraft JSON files to split and merge the models.',
    geometryFileBtn: 'Select JSON File',
    mergeGeometrySelectedBtn: 'Merge Selected',
    mergeGeometryFilesBtn: 'Merge All Files',

    // Skin Splitter & Merger translations
    skinTitle: 'Skin Splitter & Merger',
    skinDescription: 'Upload skins.json to split or merge skins by geometry.',
    skinFileBtn: 'Select JSON File',
    geometryBtn: 'Upload Geometry.json',
    validateBtn: 'Validate Geometry',
    mergeSkinSelectedBtn: 'Merge Selected',
    mergeSkinAllBtn: 'Merge All Files',

    addAnimations: "Add Animations",
    addAttachments: "Add Attachments",
    addOverlay: "Add Overlay",
    addColor: "Add Color",
    saveSkin: "Save Skin",
    cancel: "Cancel",
    editSkin: "Edit Skin",
    newSkin: "Add New Skin",
    localizationName: "Localization Name",
    geometry: "Geometry",
    texture: "Texture",
    type: "Type",
    free: "Free",
    paid: "Paid",
    animations: "Animations",
    attachments: "Attachments",
    overlay: "Overlay",
    color: "Color",
  }
};

// Fungsi untuk mendapatkan bahasa sistem
function getSystemLanguage() {
  const lang = (navigator.language || navigator.userLanguage).toLowerCase();
  return lang.startsWith("id") ? "id" : "en";
}

// Trigger klik pada input file saat tombol "Muat File" diklik
loadJsonBtn.addEventListener('click', () => {
  importJson.click(); // Memicu klik pada input file
});

// Fungsi untuk memuat file JSON setelah file dipilih
importJson.addEventListener('change', () => {
  const file = importJson.files[0];
  if (!file) {
    alert('Pilih file skins.json terlebih dahulu!');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      // Gunakan JSON5 untuk parsing file
      skinsData = JSON5.parse(e.target.result);
      // Tampilkan root properties
      displayRootProperties(skinsData);
      // Tampilkan daftar skin
      displaySkins(skinsData.skins);
      fileContent.classList.remove('hidden');
    } catch (err) {
      alert('File JSON tidak valid atau tidak didukung!');
      console.error(err);
    }
  };
  reader.readAsText(file);
});

// Fungsi untuk menampilkan daftar skin
function displaySkins(skins) {
  skinList.innerHTML = ''; // Kosongkan daftar sebelumnya
  skins.forEach((skin, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${skin.localization_name} (${skin.type})`;
    li.dataset.index = index;

    // Tambahkan tombol edit dan hapus
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => openSkinForm(index));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Hapus';
    deleteBtn.addEventListener('click', () => deleteSkin(index));

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    skinList.appendChild(li);
  });
}

// Fungsi untuk membuka modal formulir skin
function openSkinForm(index = null) {
  editingIndex = index;
  optionalFields.innerHTML = ''; // Kosongkan properti opsional sebelumnya

  if (index !== null) {
    const skin = skinsData.skins[index];
    formTitle.textContent = translations[getSystemLanguage()].editSkin;
    skinEditorForm.localizationName.value = skin.localization_name || '';
    skinEditorForm.geometry.value = skin.geometry || '';
    skinEditorForm.texture.value = skin.texture || '';
    skinEditorForm.type.value = skin.type || 'free';
    skinEditorForm.hideArmor.value = skin.hide_armor ? 'true' : 'false';
    skinEditorForm.enableAttachables.value = skin.enable_attachables !== undefined ? 
      (skin.enable_attachables ? 'true' : 'false') : 'none';

    // Tambahkan validasi untuk setiap properti opsional
    if (skin.animations && Array.isArray(skin.animations)) {
      addAnimationsBtn.click();
      document.getElementById('animations').value = skin.animations.join(', ');
    } else if (skin.animations && typeof skin.animations === 'string') {
      addAnimationsBtn.click();
      document.getElementById('animations').value = skin.animations;
    }

    if (skin.attachments && Array.isArray(skin.attachments)) {
      addAttachmentsBtn.click();
      document.getElementById('attachments').value = skin.attachments.join(', ');
    } else if (skin.attachments && typeof skin.attachments === 'string') {
      addAttachmentsBtn.click();
      document.getElementById('attachments').value = skin.attachments;
    }

    if (skin.overlay) {
      addOverlayBtn.click();
      document.getElementById('overlay').value = skin.overlay;
    }

    if (skin.color) {
      addColorBtn.click();
      document.getElementById('color').value = skin.color;
    }
  } else {
    formTitle.textContent = translations[getSystemLanguage()].newSkin;
    skinEditorForm.reset();
    skinEditorForm.hideArmor.value = 'false';
    skinEditorForm.enableAttachables.value = 'none';
  }

  document.body.classList.add('modal-open');
  skinModal.classList.remove('hidden');
}

// Fungsi untuk menyimpan skin
skinEditorForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newSkin = {
    localization_name: skinEditorForm.localizationName.value,
    geometry: skinEditorForm.geometry.value,
    texture: skinEditorForm.texture.value,
    type: skinEditorForm.type.value,
    hide_armor: skinEditorForm.hideArmor.value === 'true',
  };

  if (skinEditorForm.enableAttachables.value !== 'none') {
    newSkin.enable_attachables = skinEditorForm.enableAttachables.value === 'true';
  }

  // Proses properti opsional dengan validasi
  if (document.getElementById('animations')) {
    const animationsValue = document.getElementById('animations').value.trim();
    if (animationsValue) {
      try {
        // Coba parse sebagai JSON jika string valid JSON
        newSkin.animations = JSON.parse(animationsValue);
      } catch {
        // Jika bukan JSON valid, split dengan koma
        newSkin.animations = animationsValue.split(',').map(item => item.trim());
      }
    }
  }

  if (document.getElementById('attachments')) {
    const attachmentsValue = document.getElementById('attachments').value.trim();
    if (attachmentsValue) {
      try {
        newSkin.attachments = JSON.parse(attachmentsValue);
      } catch {
        newSkin.attachments = attachmentsValue.split(',').map(item => item.trim());
      }
    }
  }

  if (document.getElementById('overlay')) {
    newSkin.overlay = document.getElementById('overlay').value.trim();
  }

  if (document.getElementById('color')) {
    newSkin.color = document.getElementById('color').value;
  }

  if (editingIndex !== null) {
    skinsData.skins[editingIndex] = newSkin;
  } else {
    skinsData.skins.push(newSkin);
  }

  displaySkins(skinsData.skins);
  skinModal.classList.add('hidden');
  document.body.classList.remove('modal-open');
});

// Fungsi untuk membatalkan pengeditan
cancelSkinBtn.addEventListener('click', () => {
  skinModal.classList.add('hidden'); // Sembunyikan modal
  document.body.classList.remove('modal-open'); // Buka scroll halaman utama
});

// Fungsi untuk menghapus skin
function deleteSkin(index) {
  if (confirm('Apakah Anda yakin ingin menghapus skin ini?')) {
    skinsData.skins.splice(index, 1);
    displaySkins(skinsData.skins);
  }
}

// Fungsi untuk menyimpan dan mengunduh file JSON
saveJsonBtn.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(skinsData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'skins.json';
  a.click();
  URL.revokeObjectURL(url);
});

// Tambahkan event listener untuk tombol "Tambah Skin Baru"
addSkinBtn.addEventListener('click', () => {
  openSkinForm(); // Panggil fungsi untuk membuka formulir tanpa index (menambah skin baru)
});

// Fungsi untuk menambahkan properti Animations
addAnimationsBtn.addEventListener('click', () => {
  if (!document.getElementById('animationsField')) {
    const wrapper = document.createElement('div');
    wrapper.id = 'animationsField';
    wrapper.innerHTML = `
      <label for="animations">Animations:</label>
      <textarea id="animations" name="animations" rows="3" placeholder="Pisahkan dengan koma"></textarea>
      <button type="button" class="remove-btn">Hapus</button>
    `;
    optionalFields.appendChild(wrapper);

    // Tombol hapus
    wrapper.querySelector('.remove-btn').addEventListener('click', () => {
      wrapper.remove();
    });
  }
});

// Fungsi untuk menambahkan properti Attachments
addAttachmentsBtn.addEventListener('click', () => {
  if (!document.getElementById('attachmentsField')) {
    const wrapper = document.createElement('div');
    wrapper.id = 'attachmentsField';
    wrapper.innerHTML = `
      <label for="attachments">Attachments:</label>
      <textarea id="attachments" name="attachments" rows="3" placeholder="Pisahkan dengan koma"></textarea>
      <button type="button" class="remove-btn">Hapus</button>
    `;
    optionalFields.appendChild(wrapper);

    // Tombol hapus
    wrapper.querySelector('.remove-btn').addEventListener('click', () => {
      wrapper.remove();
    });
  }
});

// Fungsi untuk menambahkan properti Overlay
addOverlayBtn.addEventListener('click', () => {
  if (!document.getElementById('overlayField')) {
    const wrapper = document.createElement('div');
    wrapper.id = 'overlayField';
    wrapper.innerHTML = `
      <label for="overlay">Overlay:</label>
      <input type="text" id="overlay" name="overlay" placeholder="Masukkan path overlay">
      <button type="button" class="remove-btn">Hapus</button>
    `;
    optionalFields.appendChild(wrapper);

    // Tombol hapus
    wrapper.querySelector('.remove-btn').addEventListener('click', () => {
      wrapper.remove();
    });
  }
});

// Fungsi untuk menambahkan properti Color
addColorBtn.addEventListener('click', () => {
  if (!document.getElementById('colorField')) {
    const wrapper = document.createElement('div');
    wrapper.id = 'colorField';
    wrapper.innerHTML = `
      <label for="color">Color:</label>
      <input type="color" id="color" name="color">
      <button type="button" class="remove-btn">Hapus</button>
    `;
    optionalFields.appendChild(wrapper);

    // Tombol hapus
    wrapper.querySelector('.remove-btn').addEventListener('click', () => {
      wrapper.remove();
    });
  }
});

// Fungsi untuk menerapkan terjemahan
function applyTranslation(lang) {
  const translation = translations[lang];
  
  // Terjemahkan elemen dengan atribut data-translate
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    if (translation[key]) {
      element.textContent = translation[key];
    }
  });
}

// Ambil elemen audio
const clickSound = document.getElementById('clickSound');

// Fungsi untuk memutar suara klik
function playClickSound() {
  clickSound.currentTime = 0; // Reset audio ke awal
  clickSound.play();
}

// Tambahkan event listener ke semua tombol
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('click', playClickSound);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const lang = getSystemLanguage();
  applyTranslation(lang);
});

// Tambahkan fungsi untuk menampilkan root properties
function displayRootProperties(data) {
  const rootPropertiesDiv = document.createElement('div');
  rootPropertiesDiv.id = 'rootProperties';
  rootPropertiesDiv.className = 'root-properties';
  
  rootPropertiesDiv.innerHTML = `
    <div class="root-property-item">
      <label for="serializeName">Serialize Name:</label>
      <input type="text" id="serializeName" value="${data.serialize_name || ''}" 
        onchange="updateRootProperty('serialize_name', this.value)">
    </div>
    <div class="root-property-item">
      <label for="localizationName">Root Localization Name:</label>
      <input type="text" id="rootLocalizationName" value="${data.localization_name || ''}"
        onchange="updateRootProperty('localization_name', this.value)">
    </div>
  `;

  // Sisipkan sebelum daftar skin
  const fileContent = document.getElementById('fileContent');
  const skinList = document.getElementById('skinList');
  fileContent.insertBefore(rootPropertiesDiv, skinList);
}

// Fungsi untuk mengupdate root property
function updateRootProperty(propertyName, value) {
  if (skinsData) {
    skinsData[propertyName] = value;
  }
}

// Scroll behavior
function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Show/hide top button
    if (scrollTop > windowHeight * 0.3) {
        scrollTopBtn.classList.remove('hidden');
    } else {
        scrollTopBtn.classList.add('hidden');
    }
    
    // Show/hide bottom button
    if (scrollTop < documentHeight - windowHeight * 1.3) {
        scrollBottomBtn.classList.remove('hidden');
    } else {
        scrollBottomBtn.classList.add('hidden');
    }
}

// Smooth scroll functions
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    playClickSound();
}

function scrollToBottom() {
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
    });
    playClickSound();
}

// Event listeners
window.addEventListener('scroll', handleScroll, { passive: true });
scrollTopBtn.addEventListener('click', scrollToTop);
scrollBottomBtn.addEventListener('click', scrollToBottom);

// Initial check
handleScroll();