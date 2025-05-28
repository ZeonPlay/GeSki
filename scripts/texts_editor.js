const importLang = document.getElementById('importLang');
const loadLangBtn = document.getElementById('loadLangBtn');
const fileContent = document.getElementById('fileContent');
const translationsList = document.getElementById('translationsList');
const searchTranslations = document.getElementById('searchTranslations');
const addTranslationBtn = document.getElementById('addTranslationBtn');
const saveLangBtn = document.getElementById('saveLangBtn');
const translationModal = document.getElementById('translationModal');
const translationForm = document.getElementById('translationForm');
const closeTranslationModal = document.getElementById('closeTranslationModal');
const burgerIcon = document.getElementById('burgerIcon');
const sideNav = document.getElementById('sideNav');
const clickSound = document.getElementById('clickSound');

// Scroll button elements
const scrollTopBtn = document.getElementById('scrollTopBtn');
const scrollBottomBtn = document.getElementById('scrollBottomBtn');


let langData = [];
let editingIndex = null;

// Load .lang file
loadLangBtn.addEventListener('click', () => {
    importLang.click();
});

importLang.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        parseLangFile(e.target.result);
        displayTranslations();
        fileContent.classList.remove('hidden');
    };
    reader.readAsText(file);
});

// Parse .lang file content
function parseLangFile(content) {
    langData = [];
    const lines = content.split('\n');
    
    lines.forEach(line => {
        line = line.trim();
        if (line) {
            if (line.startsWith('##')) {
                // Line comment
                langData.push({
                    type: 'comment',
                    content: line.substring(2).trim()
                });
            } else {
                const commentIndex = line.indexOf('##');
                if (commentIndex !== -1) {
                    // Line with inline comment
                    const mainContent = line.substring(0, commentIndex).trim();
                    const comment = line.substring(commentIndex + 2).trim();
                    const [key, value] = parseTranslationLine(mainContent);
                    
                    if (key && value) {
                        langData.push({
                            type: 'translation',
                            key,
                            value,
                            comment
                        });
                    }
                } else {
                    // Regular translation line
                    const [key, value] = parseTranslationLine(line);
                    if (key && value) {
                        langData.push({
                            type: 'translation',
                            key,
                            value
                        });
                    }
                }
            }
        }
    });
}

function parseTranslationLine(line) {
    const parts = line.split('=');
    if (parts.length >= 2) {
        return [parts[0].trim(), parts.slice(1).join('=').trim()];
    }
    return [];
}

// Display translations
function displayTranslations(filter = '') {
    translationsList.innerHTML = '';
    
    langData.forEach((item, index) => {
        if (matchesFilter(item, filter)) {
            const translationEl = createTranslationElement(item, index);
            translationsList.appendChild(translationEl);
        }
    });
}

function matchesFilter(item, filter) {
    if (!filter) return true;
    const searchTerm = filter.toLowerCase();
    return (
        item.key?.toLowerCase().includes(searchTerm) ||
        item.value?.toLowerCase().includes(searchTerm) ||
        item.comment?.toLowerCase().includes(searchTerm)
    );
}

// Create UI elements
function createTranslationElement(translation, index) {
    const div = document.createElement('div');
    div.className = 'translation-item';
    
    div.innerHTML = `
        <div class="translation-key">${translation.key}</div>
        <div class="translation-value">${translation.value}</div>
        ${translation.comment ? `<div class="translation-comment">## ${translation.comment}</div>` : ''}
        <div class="translation-actions">
            <button onclick="editTranslation(${index})">
                <span class="material-icons">edit</span>
            </button>
            <button onclick="deleteTranslation(${index})">
                <span class="material-icons">delete</span>
            </button>
        </div>
    `;
    
    return div;
}

function createCommentElement(comment, index) {
    const div = document.createElement('div');
    div.className = 'comment-item';
    
    div.innerHTML = `
        ## ${comment.content}
        <button onclick="deleteTranslation(${index})">
            <span class="material-icons">delete</span>
        </button>
    `;
    
    return div;
}

// Event listeners and UI interactions
searchTranslations.addEventListener('input', (e) => {
    displayTranslations(e.target.value);
});

// Update fungsi yang membuka modal
addTranslationBtn.addEventListener('click', () => {
    editingIndex = null;
    translationForm.reset();
    translationModal.classList.remove('hidden');
    document.body.classList.add('modal-open'); // Tambahkan class
});

// Update fungsi yang menutup modal
closeTranslationModal.addEventListener('click', () => {
    translationModal.classList.add('hidden');
    document.body.classList.remove('modal-open'); // Hapus class
});

translationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const key = document.getElementById('translationKey').value;
    const value = document.getElementById('translationValue').value;
    const comment = document.getElementById('translationComment').value;
    
    const translation = {
        type: 'translation',
        key,
        value,
        comment: comment.replace(/^##\s*/, '')
    };
    
    if (editingIndex !== null) {
        langData[editingIndex] = translation;
    } else {
        langData.push(translation);
    }
    
    displayTranslations(searchTranslations.value);
    translationModal.classList.add('hidden');
    document.body.classList.remove('modal-open'); // Hapus class
});

// Save file
saveLangBtn.addEventListener('click', () => {
    let content = '';
    
    langData.forEach(item => {
        if (item.type === 'comment') {
            content += `## ${item.content}\n`;
        } else {
            content += `${item.key}=${item.value}`;
            if (item.comment) {
                content += ` ## ${item.comment}`;
            }
            content += '\n';
        }
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'en_US.lang';
    a.click();
    URL.revokeObjectURL(url);
});

// Update fungsi edit
function editTranslation(index) {
    editingIndex = index;
    const item = langData[index];
    
    if (item.type === 'translation') {
        document.getElementById('translationKey').value = item.key;
        document.getElementById('translationValue').value = item.value;
        document.getElementById('translationComment').value = item.comment || '';
        translationModal.classList.remove('hidden');
        document.body.classList.add('modal-open'); // Tambahkan class
    }
}

// Tambahkan event listener untuk ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !translationModal.classList.contains('hidden')) {
        translationModal.classList.add('hidden');
        document.body.classList.remove('modal-open'); // Hapus class
    }
});

function deleteTranslation(index) {
    if (confirm('Hapus terjemahan ini?')) {
        langData.splice(index, 1);
        displayTranslations(searchTranslations.value);
    }
}

// Tambahkan event listeners untuk sidebar navigation
burgerIcon.addEventListener('click', () => {
    sideNav.classList.toggle('hidden');
    sideNav.classList.toggle('visible');
});

// Fungsi untuk menutup navigasi
function closeSideNav() {
    sideNav.classList.remove('visible');
    sideNav.classList.add('hidden');
}

// Tutup navigasi saat klik di luar navigasi
document.body.addEventListener('click', (e) => {
    if (!sideNav.contains(e.target) && !burgerIcon.contains(e.target)) {
        closeSideNav();
    }
});

// Tutup navigasi saat tombol ESC ditekan
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSideNav();
    }
});

// Fungsi untuk memutar suara klik
function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play();
}

// Tambahkan event listener ke semua tombol
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', playClickSound, { passive: true });
    });
}, { passive: true });

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

// Tambahkan fungsi untuk generate lang dari skins.json
async function generateLangFromSkins() {
    try {
        // Buka file picker untuk skins.json
        const [fileHandle] = await window.showOpenFilePicker({
            types: [{
                description: 'Skins JSON',
                accept: {
                    'application/json': ['.json']
                }
            }]
        });
        
        const file = await fileHandle.getFile();
        const content = await file.text();
        const skinsData = JSON.parse(content);

        // Buat data lang
        langData = [];

        // Tambahkan root skinpack entry
        langData.push({
            type: 'translation',
            key: `skinpack.${skinsData.serialize_name}`,
            value: skinsData.localization_name || skinsData.serialize_name,
            comment: 'Pack name that appears in the store'
        });

        // Tambahkan setiap skin entry
        skinsData.skins.forEach(skin => {
            langData.push({
                type: 'translation',
                key: `skin.${skinsData.serialize_name}.${skin.localization_name}`,
                value: skin.localization_name.replace(/_/g, ' '),
                comment: `Skin name for ${skin.geometry || 'geometry.humanoid.custom'}`
            });
        });

        // Tampilkan di editor
        displayTranslations();
        fileContent.classList.remove('hidden');

    } catch (err) {
        console.error('Error generating lang:', err);
        alert('Gagal membuat file lang. Pastikan format skins.json valid!');
    }
}

// Tambahkan event listener
document.getElementById('generateFromSkinsBtn').addEventListener('click', generateLangFromSkins);