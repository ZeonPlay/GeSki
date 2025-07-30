document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const fileInput = document.getElementById('fileInput');
    const convertBtn = document.getElementById('convertBtn');
    const output = document.getElementById('output');
    const downloadLink = document.getElementById('downloadLink');
    const fileLabel = document.querySelector('label[for="fileInput"] span:last-child');
    
    let parsedData = null;
    let currentFileName = '';
  
    // File input change handler
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      // Update UI
      convertBtn.disabled = true;
      downloadLink.classList.add('hidden');
      output.value = '';
      currentFileName = file.name.replace(/\.[^/.]+$/, ''); // Remove file extension
      fileLabel.textContent = file.name;
      
      // Read file
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          parsedData = JSON.parse(e.target.result);
          convertBtn.disabled = false;
          
          // Auto-scroll to output area
          output.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (error) {
          showError('File bukan JSON valid. Silakan unggah file JSON yang sesuai.');
          console.error('Error parsing JSON:', error);
        }
      };
      
      reader.onerror = () => {
        showError('Gagal membaca file. Silakan coba lagi.');
      };
      
      reader.readAsText(file);
    });
  
    // Convert button click handler
    convertBtn.addEventListener('click', () => {
      if (!parsedData) {
        showError('Tidak ada data untuk dikonversi.');
        return;
      }
      
      try {
        const geoArr = parsedData['minecraft:geometry'];
        if (!Array.isArray(geoArr) || !geoArr.length) {
          throw new Error('Format file tidak sesuai. Diharapkan objek utama "minecraft:geometry".');
        }
        
        const { description = {}, bones = [] } = geoArr[0];
        const identifier = description.identifier || currentFileName || 'geometry.unknown';
        const keyName = identifier;
    
        // Create new format with forced format_version 1.11.0
        const result = {
          format_version: '1.11.0',
          [keyName]: {
            texturewidth: description.texture_width || 128,
            textureheight: description.texture_height || 128,
            visible_bounds_width: description.visible_bounds_width || 0,
            visible_bounds_height: description.visible_bounds_height || 0,
            visible_bounds_offset: description.visible_bounds_offset || [0, 0, 0],
            bones
          }
        };
        
        // Format JSON with 2-space indentation
        const jsonString = JSON.stringify(result, null, 2);
        output.value = jsonString;
    
        // Create download link
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Update download link
        const downloadText = downloadLink.querySelector('span:last-child');
        downloadLink.href = url;
        downloadLink.download = `${keyName}.json`;
        downloadText.textContent = `Download ${keyName}.json`;
        downloadLink.classList.remove('hidden');
        
        // Scroll to download link
        downloadLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
      } catch (error) {
        showError(error.message || 'Terjadi kesalahan saat mengonversi file.');
        console.error('Conversion error:', error);
      }
    });
    
    // Helper function to show error messages
    function showError(message) {
      output.value = `Error: ${message}`;
      output.style.borderColor = '#ef4444';
      setTimeout(() => {
        output.style.borderColor = '';
      }, 3000);
    }
    
    // Initialize tooltips
    initializeTooltips();
  });
  
  // Initialize tooltips for Material Icons
  function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('.tooltip-trigger');
    
    tooltipElements.forEach(element => {
      const tooltipText = element.getAttribute('data-tooltip');
      if (!tooltipText) return;
      
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = tooltipText;
      
      element.style.position = 'relative';
      element.appendChild(tooltip);
      
      // Position tooltip on hover
      element.addEventListener('mouseenter', () => {
        const rect = element.getBoundingClientRect();
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
        tooltip.style.top = `${rect.height + 8}px`;
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';
      });
      
      element.addEventListener('mouseleave', () => {
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '0';
      });
    });
  }
