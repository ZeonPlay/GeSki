// Combined JavaScript for Minecraft Tools
// Includes both Skin Splitter & Merger and Geometry Splitter & Merger functionality

// Skin Splitter & Merger variables
let skinFiles = [];
let filenames = [];
let geometryData = null;

// Geometry Splitter & Merger variables
let jsonList = [];
let versions = [];
let geometryFilenames = [];

// DOM Elements
const skinFileInput = document.getElementById('skinFileInput');
const geometryFileInput = document.getElementById('geometryFileInput');
const geometryFile = document.getElementById('geometryFile');
const skinList = document.getElementById('skinList');
const modelList = document.getElementById('modelList');
const mergeSkinSelectedBtn = document.getElementById('mergeSkinSelectedBtn');
const mergeSkinAllBtn = document.getElementById('mergeSkinAllBtn');
const mergeGeometrySelectedBtn = document.getElementById('mergeGeometrySelectedBtn');
const mergeGeometryFilesBtn = document.getElementById('mergeGeometryFilesBtn');
const validateBtn = document.getElementById('validateBtn');
const validationResult = document.getElementById('validationResult');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Combined translations
const translations = {
  id: {
    // Shared translations
    download: 'Download',
    copy: 'Copy',
    
    // Tab navigation
    skinTabBtn: 'Skin Splitter & Merger',
    geometryTabBtn: 'Geometry Splitter & Merger',
    
    // Skin Splitter & Merger translations
    skinTitle: 'Skin Splitter & Merger',
    skinDescription: 'Upload satu atau lebih file skins.json untuk split dan merge berdasarkan geometry',
    skinFileBtn: 'Pilih JSON File',
    geometryBtn: 'Upload Geometry.json',
    validateBtn: 'Validasi Geometry',
    mergeSkinSelectedBtn: 'Merge Yang Dipilih',
    mergeSkinAllBtn: 'Merge Semua File',
    alertSkinMergeMin: 'Pilih minimal 2 skin untuk merge!',
    alertSkinUploadMin: 'Upload minimal 2 file.',
    alertSkinFailedParse: 'Gagal parse ',
    alertSkinCopySuccess: 'Skin "',
    alertSkinCopyFailed: 'Gagal menyalin ke clipboard.',
    skinDownloaded: ' telah disalin!',
    validationSuccess: '✅ Semua geometry valid!',
    validationError: '❌ Ditemukan {count} geometry tidak valid:',
    missingGeometry: 'Geometry "{geometry}" tidak ditemukan',
    
    // Geometry Splitter & Merger translations
    geometryTitle: 'Geometry Splitter & Merger',
    geometryDescription: 'Upload satu atau lebih file JSON Minecraft untuk split dan merge model-modelnya.',
    geometryFileBtn: 'Pilih JSON File',
    mergeGeometrySelectedBtn: 'Merge Yang Dipilih',
    mergeGeometryFilesBtn: 'Merge Semua File',
    alertGeometryMergeMin: 'Pilih minimal 2 model untuk merge!',
    alertGeometryUploadMin: 'Upload minimal 2 file.',
    alertGeometryFailedParse: 'Gagal parse ',
    alertGeometryCopySuccess: 'JSON "',
    alertGeometryCopyFailed: 'Gagal menyalin ke clipboard.',
    geometryDownloaded: ' telah disalin!'
  },
  en: {
    // Shared translations
    download: 'Download',
    copy: 'Copy',
    
    // Tab navigation
    skinTabBtn: 'Skin Splitter & Merger',
    geometryTabBtn: 'Geometry Splitter & Merger',
    
    // Skin Splitter & Merger translations
    skinTitle: 'Skin Splitter & Merger',
    skinDescription: 'Upload one or more skins.json files to split and merge by geometry',
    skinFileBtn: 'Select JSON File',
    geometryBtn: 'Upload Geometry.json',
    validateBtn: 'Validate Geometry',
    mergeSkinSelectedBtn: 'Merge Selected',
    mergeSkinAllBtn: 'Merge All Files',
    alertSkinMergeMin: 'Select at least 2 skins to merge!',
    alertSkinUploadMin: 'Upload at least 2 files.',
    alertSkinFailedParse: 'Failed to parse ',
    alertSkinCopySuccess: 'Skin "',
    alertSkinCopyFailed: 'Failed to copy to clipboard.',
    skinDownloaded: ' has been copied!',
    validationSuccess: '✅ All geometries are valid!',
    validationError: '❌ Found {count} invalid geometries:',
    missingGeometry: 'Geometry "{geometry}" not found',
    
    // Geometry Splitter & Merger translations
    geometryTitle: 'Geometry Splitter & Merger',
    geometryDescription: 'Upload one or more Minecraft JSON files to split and merge the models.',
    geometryFileBtn: 'Select JSON File',
    mergeGeometrySelectedBtn: 'Merge Selected',
    mergeGeometryFilesBtn: 'Merge All Files',
    alertGeometryMergeMin: 'Select at least 2 models to merge!',
    alertGeometryUploadMin: 'Upload at least 2 files.',
    alertGeometryFailedParse: 'Failed to parse ',
    alertGeometryCopySuccess: 'JSON "',
    alertGeometryCopyFailed: 'Failed to copy to clipboard.',
    geometryDownloaded: ' has been copied!'
  }
};

// Tab functionality
function setupTabs() {
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
}

function getSystemLanguage() {
  const lang = (navigator.language || navigator.userLanguage).toLowerCase();
  return lang.startsWith('id') ? 'id' : 'en';
}

function applyTranslation(lang) {
  const translation = translations[lang];
  
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    if (translation[key]) {
      element.textContent = translation[key];
    }
  });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  const lang = getSystemLanguage();
  applyTranslation(lang);
  setupTabs();

  // Sembunyikan tombol validasi dan upload geometry.json saat pertama kali load
  document.querySelector('.validation-section').classList.add('hidden');
});

// ==========================================
// Skin Splitter & Merger Functionality
// ==========================================

skinFileInput.addEventListener('change', function(e) {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  skinFiles = [];
  filenames = [];
  skinList.innerHTML = '';
  clearValidation();

  let filesProcessed = 0;
  let parseFailed = false;

  files.forEach((file, i) => {
    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const jsonData = JSON5.parse(evt.target.result);

        if (!jsonData.skins || !Array.isArray(jsonData.skins)) {
          throw new Error('Format skins.json tidak valid');
        }

        skinFiles.push({
          filename: file.name,
          serialize_name: jsonData.serialize_name || 'custom_skin',
          localization_name: jsonData.localization_name || 'Custom Skin',
          skins: jsonData.skins
        });

        filenames.push(file.name);
      } catch (err) {
        parseFailed = true;
        alert(`${translations[getSystemLanguage()].alertSkinFailedParse}${file.name}: ${err.message}`);
      }

      filesProcessed++;

      if (filesProcessed === files.length) {
        if (!parseFailed) {
          generateSkinList();
          document.querySelector('.skin-merge-wrapper').style.display = 'flex';
          document.querySelector('.validation-section').classList.remove('hidden'); // Tampilkan tombol validasi dan upload geometry.json
        } else {
          document.querySelector('.skin-merge-wrapper').style.display = 'none';
          document.querySelector('.validation-section').classList.add('hidden'); // Sembunyikan tombol validasi dan upload geometry.json
        }
      }
    };
    reader.readAsText(file);
  });
});

geometryFile.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      geometryData = JSON5.parse(evt.target.result);
      alert('Geometry.json berhasil diupload!');
      clearValidation();
    } catch(err) {
      alert('Gagal parsing geometry.json: ' + err.message);
    }
  };
  reader.readAsText(file);
});

function clearValidation() {
  document.querySelectorAll('.skin-item').forEach(item => {
    item.classList.remove('valid-geometry', 'invalid-geometry');
  });
  validationResult.style.display = 'none';
}

function generateSkinList() {
  skinList.innerHTML = '';

  skinFiles.forEach((fileData, fileIndex) => {
    const section = document.createElement('div');
    section.className = 'file-section';

    const title = document.createElement('h2');
    title.textContent = fileData.filename;
    section.appendChild(title);

    fileData.skins.forEach((skin, skinIndex) => {
      const item = document.createElement('div');
      item.className = 'skin-item';
      item.dataset.fileIndex = fileIndex;
      item.dataset.skinIndex = skinIndex;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.dataset.fileIndex = fileIndex;
      checkbox.dataset.skinIndex = skinIndex;

      const label = document.createElement('span');
      label.textContent = skin.geometry || `skin_${skinIndex}`;
      if (skin.localization_name) {
        label.textContent += ` (${skin.localization_name})`;
      }

      const btnWrapper = document.createElement('div');
      btnWrapper.style.display = 'flex';
      btnWrapper.style.gap = '8px';

      const downloadBtn = document.createElement('button');
      downloadBtn.textContent = translations[getSystemLanguage()].download;
      downloadBtn.addEventListener('click', () => {
        downloadSkin(fileIndex, skinIndex);
      });

      const copyBtn = document.createElement('button');
      copyBtn.textContent = translations[getSystemLanguage()].copy;
      copyBtn.addEventListener('click', () => {
        copySkin(fileIndex, skinIndex);
      });

      btnWrapper.appendChild(downloadBtn);
      btnWrapper.appendChild(copyBtn);

      item.appendChild(checkbox);
      item.appendChild(label);
      item.appendChild(btnWrapper);
      section.appendChild(item);
    });

    skinList.appendChild(section);
  });
}

function downloadSkin(fileIndex, skinIndex) {
  const fileData = skinFiles[fileIndex];
  const skin = fileData.skins[skinIndex];
  
  const skinData = {
    serialize_name: fileData.serialize_name,
    localization_name: fileData.localization_name,
    skins: [skin]
  };
  
  const blob = new Blob([JSON.stringify(skinData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `skin_${skin.geometry ? skin.geometry.replace(/[^a-z0-9]/gi, '_') : skinIndex}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function copySkin(fileIndex, skinIndex) {
  const fileData = skinFiles[fileIndex];
  const skin = fileData.skins[skinIndex];
  
  const skinData = {
    serialize_name: fileData.serialize_name,
    localization_name: fileData.localization_name,
    skins: [skin]
  };
  
  const text = JSON.stringify(skinData, null, 2);
  
  navigator.clipboard.writeText(text)
    .then(() => {
      const skinName = skin.geometry || skin.localization_name || `skin_${skinIndex}`;
      alert(`${translations[getSystemLanguage()].alertSkinCopySuccess}${skinName}${translations[getSystemLanguage()].skinDownloaded}`);
    })
    .catch(() => {
      alert(translations[getSystemLanguage()].alertSkinCopyFailed);
    });
}

validateBtn.addEventListener('click', function() {
  if (!geometryData) {
    alert('Upload geometry.json terlebih dahulu!');
    return;
  }

  if (skinFiles.length === 0) {
    alert('Upload skins.json terlebih dahulu!');
    return;
  }

  validateGeometry();
});

function validateGeometry() {
  clearValidation();
  
  const allGeometryKeys = new Set();
  // Collect all geometry keys from the geometry file
  for (const key in geometryData) {
    if (key !== 'format_version') {
      allGeometryKeys.add(key);
    }
  }

  const invalidEntries = [];
  let validCount = 0;

  skinFiles.forEach((file, fileIndex) => {
    file.skins.forEach((skin, skinIndex) => {
      const item = document.querySelector(
        `.skin-item[data-file-index="${fileIndex}"][data-skin-index="${skinIndex}"]`
      );

      if (!skin.geometry) {
        invalidEntries.push({
          file: file.filename,
          skin: skin.localization_name || `Skin ${skinIndex}`,
          geometry: '(tidak ada geometry)'
        });
        item.classList.add('invalid-geometry');
      } else if (allGeometryKeys.has(skin.geometry)) {
        item.classList.add('valid-geometry');
        validCount++;
      } else {
        invalidEntries.push({
          file: file.filename,
          skin: skin.localization_name || skin.geometry,
          geometry: skin.geometry
        });
        item.classList.add('invalid-geometry');
      }
    });
  });

  showValidationResult(invalidEntries, validCount);
}

function showValidationResult(invalidEntries, validCount) {
  validationResult.style.display = 'block';
  validationResult.className = invalidEntries.length > 0 ? 'validation-error' : 'validation-success';

  if (invalidEntries.length === 0) {
    validationResult.innerHTML = `
      <div>${translations[getSystemLanguage()].validationSuccess}</div>
      <div>Total valid: ${validCount}</div>
    `;
    return;
  }

  let html = `
    <div>
      <strong>${translations[getSystemLanguage()].validationError.replace('{count}', invalidEntries.length)}</strong>
      <div>Total valid: ${validCount}</div>
      <div class="validation-list">
  `;
  
  invalidEntries.forEach(entry => {
    html += `
      <div class="validation-item">
        <span class="warning-icon">⚠️</span>
        <div>
          <strong>${entry.file}</strong><br>
          Skin: ${entry.skin}<br>
          ${translations[getSystemLanguage()].missingGeometry.replace('{geometry}', entry.geometry)}
        </div>
      </div>`;
  });
  
  html += '</div></div>';
  validationResult.innerHTML = html;
}

mergeSkinSelectedBtn.addEventListener('click', function() {
  const checkedBoxes = document.querySelectorAll('#skinList input[type="checkbox"]:checked');
  
  if (checkedBoxes.length < 2) {
    alert(translations[getSystemLanguage()].alertSkinMergeMin);
    return;
  }

  const mergedSkins = [];
  let mainFileData = null;

  checkedBoxes.forEach(checkbox => {
    const fileIndex = parseInt(checkbox.dataset.fileIndex);
    const skinIndex = parseInt(checkbox.dataset.skinIndex);
    
    if (!mainFileData) {
      mainFileData = skinFiles[fileIndex];
    }
    
    mergedSkins.push(skinFiles[fileIndex].skins[skinIndex]);
  });

  const mergedData = {
    serialize_name: mainFileData.serialize_name,
    localization_name: mainFileData.localization_name,
    skins: mergedSkins
  };

  const blob = new Blob([JSON.stringify(mergedData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'skins.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

mergeSkinAllBtn.addEventListener('click', function() {
  if (skinFiles.length < 2) {
    alert(translations[getSystemLanguage()].alertSkinUploadMin);
    return;
  }

  const allSkins = [];
  skinFiles.forEach(fileData => {
    allSkins.push(...fileData.skins);
  });

  const mergedData = {
    serialize_name: skinFiles[0].serialize_name,
    localization_name: skinFiles[0].localization_name,
    skins: allSkins
  };

  const blob = new Blob([JSON.stringify(mergedData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'merged.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// ==========================================
// Geometry Splitter & Merger Functionality
// ==========================================

geometryFileInput.addEventListener('change', function(e) {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  jsonList = [];
  versions = [];
  geometryFilenames = [];
  modelList.innerHTML = '';

  let loaded = 0;
  files.forEach((file, i) => {
    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const js = JSON5.parse(evt.target.result);
        jsonList.push(js);
        versions.push(js.format_version);
        geometryFilenames.push(file.name);
      } catch(err) {
        alert(translations[getSystemLanguage()].alertGeometryFailedParse + file.name + ': ' + err);
      }
      loaded++;
      if (loaded === files.length) {
        generateModelList();
        document.querySelector('.geometry-merge-wrapper').style.display = 'flex';
      }
    };
    reader.readAsText(file);
  });
});

function generateModelList() {
  modelList.innerHTML = '';

  jsonList.forEach((json, idx) => {
    const version = json.format_version;
    const fname = geometryFilenames[idx];

    const section = document.createElement('div');
    section.className = 'file-section';

    const title = document.createElement('h2');
    title.textContent = fname;
    section.appendChild(title);

    Object.keys(json).forEach(key => {
      if (key === 'format_version') return;

      const item = document.createElement('div');
      item.className = 'model-item';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = key;
      checkbox.dataset.fileIndex = idx;

      const label = document.createElement('span');
      label.textContent = key;

      const downloadBtn = document.createElement('button');
      downloadBtn.textContent = translations[getSystemLanguage()].download;
      downloadBtn.addEventListener('click', () => {
        downloadModel(key, json[key], version);
      });

      const copyBtn = document.createElement('button');
      copyBtn.textContent = translations[getSystemLanguage()].copy;
      copyBtn.style.marginLeft = '8px';
      copyBtn.addEventListener('click', () => {
        copyModel(key, json[key], version);
      });

      const btnWrapper = document.createElement('div');
      btnWrapper.appendChild(downloadBtn);
      btnWrapper.appendChild(copyBtn);

      item.appendChild(checkbox);
      item.appendChild(label);
      item.appendChild(btnWrapper);
      section.appendChild(item);
    });

    modelList.appendChild(section);
  });

  applyTranslation(getSystemLanguage());
}

function downloadModel(key, modelData, version) {
  const obj = { format_version: version, [key]: modelData };
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${key.replace(/[:\/\\]/g, '_')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function copyModel(key, modelData, version) {
  const obj = { format_version: version, [key]: modelData };
  const text = JSON.stringify(obj, null, 2);
  navigator.clipboard.writeText(text)
    .then(() => alert(translations[getSystemLanguage()].alertGeometryCopySuccess + key + translations[getSystemLanguage()].geometryDownloaded))
    .catch(() => alert(translations[getSystemLanguage()].alertGeometryCopyFailed));
}

mergeGeometrySelectedBtn.addEventListener('click', () => {
  const checked = Array.from(
    document.querySelectorAll('#modelList input[type=checkbox]:checked')
  );
  
  if (checked.length < 2) {
    alert(translations[getSystemLanguage()].alertGeometryMergeMin);
    return;
  }

  const merged = {};
  let maxVersion = "0.0.0";

  checked.forEach(cb => {
    const key = cb.value;
    const fileIdx = parseInt(cb.dataset.fileIndex);
    const json = jsonList[fileIdx];
    const version = json.format_version;

    merged[key] = json[key];
    if (compareVersion(version, maxVersion) > 0) {
      maxVersion = version;
    }
  });

  const final = { format_version: maxVersion, ...merged };
  const blob = new Blob([JSON.stringify(final, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'geometry.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

mergeGeometryFilesBtn.addEventListener('click', () => {
  if (jsonList.length < 2) {
    alert(translations[getSystemLanguage()].alertGeometryUploadMin);
    return;
  }

  const merged = {};
  let maxVersion = "0.0.0";

  jsonList.forEach((json, idx) => {
    const version = json.format_version;
    if (compareVersion(version, maxVersion) > 0) {
      maxVersion = version;
    }

    Object.keys(json).forEach(k => {
      if (k !== 'format_version') {
        merged[k] = json[k];
      }
    });
  });

  const final = { format_version: maxVersion, ...merged };
  const blob = new Blob([JSON.stringify(final, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'geometry.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

function compareVersion(v1, v2) {
  const a = v1.split('.').map(n => parseInt(n));
  const b = v2.split('.').map(n => parseInt(n));
  for (let i = 0; i < 3; i++) {
    const diff = (a[i] || 0) - (b[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}