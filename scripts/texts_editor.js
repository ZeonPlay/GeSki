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

addTranslationBtn.addEventListener('click', () => {
    editingIndex = null;
    translationForm.reset();
    translationModal.classList.remove('hidden');
});

closeTranslationModal.addEventListener('click', () => {
    translationModal.classList.add('hidden');
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

function editTranslation(index) {
    editingIndex = index;
    const item = langData[index];
    
    if (item.type === 'translation') {
        document.getElementById('translationKey').value = item.key;
        document.getElementById('translationValue').value = item.value;
        document.getElementById('translationComment').value = item.comment || '';
        translationModal.classList.remove('hidden');
    }
}

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