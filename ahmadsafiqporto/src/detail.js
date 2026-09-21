import { supabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
  const loadingState = document.getElementById('loading-state');
  const errorState = document.getElementById('error-state');
  const detailContent = document.getElementById('detail-content');
  const similarSection = document.getElementById('similar-section');

  const mainImage = document.getElementById('main-image');
  const galleryContainer = document.getElementById('gallery-container');
  const featuresContainer = document.getElementById('features-container');

  const projectTitle = document.getElementById('project-title');
  const projectDesc = document.getElementById('project-desc');
  const projectRole = document.getElementById('project-role');
  const techStackContainer = document.getElementById('tech-stack-container');
  const similarContainer = document.getElementById('similar-container');

  // 1. Ambil Parameter Slug atau ID dari URL
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');
  const id = urlParams.get('id');

  try {
    let query = supabase.from('explorations').select('*');

    if (slug) {
      query = query.eq('slug', slug);
    } else if (id) {
      query = query.eq('id', id);
    } else {
      // Jika tidak ada param, ambil item paling pertama
      query = query.limit(1);
    }

    const { data: projectData, error } = await query.single();

    if (error || !projectData) {
      console.error('Error fetching project detail:', error);
      loadingState?.classList.add('hidden');
      errorState?.classList.remove('hidden');
      return;
    }

    // 2. Isi Metadata Page
    document.title = `${projectData.title} - Exploration Detail`;
    projectTitle.textContent = projectData.title;
    projectDesc.textContent = projectData.description || projectData.short_desc || 'Tidak ada deskripsi.';
    projectRole.textContent = projectData.role || 'UI/UX Designer & Developer';

    // 3. Set Gambar Utama
    if (mainImage) {
      mainImage.src = projectData.main_image || '/src/assets/safiqjersey.png';
      mainImage.alt = projectData.title;
    }

    // 4. Set Galeri Gambar Thumbnail (jika ada)
    if (galleryContainer && projectData.gallery_images && Array.isArray(projectData.gallery_images)) {
      galleryContainer.innerHTML = '';
      
      // Tambahkan gambar utama sebagai thumbnail pertama
      const allImages = [projectData.main_image, ...projectData.gallery_images].filter(Boolean);

      allImages.forEach((imgUrl, index) => {
        const thumbBtn = document.createElement('button');
        thumbBtn.className = `w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
          index === 0 ? 'border-black opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
        }`;
        
        const thumbImg = document.createElement('img');
        thumbImg.src = imgUrl;
        thumbImg.className = 'w-full h-full object-cover';
        
        thumbBtn.appendChild(thumbImg);
        
        thumbBtn.addEventListener('click', () => {
          mainImage.src = imgUrl;
          // Reset border & opacity active state
          galleryContainer.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('border-black', 'opacity-100');
            btn.classList.add('border-transparent', 'opacity-60');
          });
          thumbBtn.classList.add('border-black', 'opacity-100');
          thumbBtn.classList.remove('border-transparent', 'opacity-60');
        });

        galleryContainer.appendChild(thumbBtn);
      });
    }

    // 5. Set Badge Fitur (Outlined Pills)
    if (featuresContainer && projectData.features && Array.isArray(projectData.features)) {
      featuresContainer.innerHTML = '';
      projectData.features.forEach(feature => {
        const badge = document.createElement('span');
        badge.className = 'px-4 py-1.5 border border-black/20 text-[#0C0C0D] rounded-full text-xs font-medium tracking-[-0.02em] bg-white/50';
        badge.textContent = feature;
        featuresContainer.appendChild(badge);
      });
    }

    // 6. Set Badge Tech Stack (Dark Pills)
    if (techStackContainer && projectData.tech_stack && Array.isArray(projectData.tech_stack)) {
      techStackContainer.innerHTML = '';
      projectData.tech_stack.forEach(tech => {
        const badge = document.createElement('span');
        badge.className = 'px-4 py-1.5 bg-[#0C0C0D] text-white rounded-full text-xs font-medium tracking-[-0.02em]';
        badge.textContent = tech;
        techStackContainer.appendChild(badge);
      });
    }

    // Tampilkan Konten setelah data siap
    loadingState?.classList.add('hidden');
    detailContent?.classList.remove('hidden');
    similarSection?.classList.remove('hidden');

    // 7. Fetch 3 Similar Explorations untuk Section Bawah
    const { data: similarData } = await supabase
      .from('explorations')
      .select('*')
      .neq('id', projectData.id)
      .limit(3);

    if (similarContainer && similarData && similarData.length > 0) {
      similarContainer.innerHTML = '';
      similarData.forEach(item => {
        const card = document.createElement('a');
        card.href = `detail.html?slug=${item.slug}`;
        card.className = 'group block bg-white rounded-[24px] overflow-hidden border border-black/10 p-[16px] transition-all hover:shadow-md hover:-translate-y-1';
        
        card.innerHTML = `
          <div class="w-full aspect-[16/10] bg-black/5 rounded-[16px] overflow-hidden mb-[16px]">
            <img src="${item.main_image || ''}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          </div>
          <h3 class="text-[18px] font-medium text-[#0C0C0D] tracking-[-0.04em] mb-[4px]">${item.title}</h3>
          <p class="text-[12px] text-[#757575] line-clamp-2">${item.short_desc || item.description || ''}</p>
        `;
        
        similarContainer.appendChild(card);
      });
    }

  } catch (err) {
    console.error('Unexpected error loading detail:', err);
    loadingState?.classList.add('hidden');
    errorState?.classList.remove('hidden');
  }
});
