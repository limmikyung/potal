document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const searchInput = document.getElementById('search-input');
    const categoryList = document.getElementById('category-list');
    const categoryItems = categoryList.querySelectorAll('li');
    const toolCards = document.querySelectorAll('.tool-card');
    const toolSections = document.querySelectorAll('.tool-section');
    const noResults = document.getElementById('no-results');
    
    // State
    let currentFilter = 'all';
    let searchQuery = '';

    // Initialize
    function init() {
        setupEventListeners();
        // Add subtle entrance animation with delay for cards
        toolCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.05}s`;
            card.style.animationFillMode = 'both';
        });
    }

    // Event Listeners
    function setupEventListeners() {
        // Search
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            filterTools();
        });

        // Category Filter + Accordion
        categoryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // If a submenu item was clicked, handle separately
                if (e.target.closest('.submenu')) return;

                // Update active state for top-level items
                categoryItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // Toggle accordion for items with submenu
                if (item.classList.contains('has-submenu')) {
                    const isOpen = item.classList.contains('open');
                    // Close all submenus
                    categoryItems.forEach(i => i.classList.remove('open'));
                    if (!isOpen) item.classList.add('open');
                    // Also apply category filter
                    currentFilter = item.getAttribute('data-filter');
                } else {
                    // Close all submenus when clicking 전체
                    categoryItems.forEach(i => i.classList.remove('open'));
                    currentFilter = item.getAttribute('data-filter');
                }
                filterTools();
            });
        });

        // Submenu item clicks — scroll to tool card
        document.querySelectorAll('.submenu li').forEach(subItem => {
            subItem.addEventListener('click', (e) => {
                e.stopPropagation();
                const toolName = subItem.getAttribute('data-tool');
                const target = Array.from(document.querySelectorAll('.card-title'))
                    .find(el => el.textContent.trim() === toolName);
                if (target) {
                    target.closest('.tool-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
                    target.closest('.tool-card').style.animation = 'none';
                    target.closest('.tool-card').offsetHeight;
                    target.closest('.tool-card').style.animation = 'highlight 0.6s ease';
                }
            });
        });

        // Card Click Effects
        toolCards.forEach(card => {
            card.addEventListener('click', function(e) {
                if (e.target.closest('.action-btn')) {
                    executeTool(this.querySelector('.card-title').textContent);
                    return;
                }
                executeTool(this.querySelector('.card-title').textContent);
            });
        });
    }

    // Filter Logic
    function filterTools() {
        let visibleCount = 0;
        let visibleSections = new Set();

        toolCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const searchData = card.getAttribute('data-name').toLowerCase();
            
            // Check matches
            const categoryMatch = currentFilter === 'all' || currentFilter === category;
            const searchMatch = searchQuery === '' || searchData.includes(searchQuery);
            
            if (categoryMatch && searchMatch) {
                card.classList.remove('hidden');
                visibleCount++;
                visibleSections.add(category);
                
                // Add a small animation when re-appearing
                card.style.animation = 'none';
                card.offsetHeight; // trigger reflow
                card.style.animation = 'fadeIn 0.4s ease-out';
            } else {
                card.classList.add('hidden');
            }
        });

        // Toggle Sections
        toolSections.forEach(section => {
            const sectionId = section.id; // 'class-tools' or 'life-tools'
            const sectionCategory = sectionId === 'class-tools' ? 'class' : 'life';
            
            if (visibleSections.has(sectionCategory) || currentFilter === 'all' && searchQuery === '') {
                section.classList.remove('hidden');
            } else if (!visibleSections.has(sectionCategory) && visibleCount > 0) {
                 // Hide section completely if no items inside it match
                 section.classList.add('hidden');
            } else {
                 section.classList.add('hidden');
            }
            
            // Special case: if filter is specific category but search is active
            if (currentFilter !== 'all' && visibleCount > 0) {
                 if (currentFilter === sectionCategory) {
                     section.classList.remove('hidden');
                 }
            }
        });

        // Show/Hide No Results
        if (visibleCount === 0) {
            noResults.classList.remove('hidden');
            toolSections.forEach(section => section.classList.add('hidden'));
        } else {
            noResults.classList.add('hidden');
        }
    }

    // Mock Tool Execution
    function executeTool(toolName) {
        // Create an alert or notification effect
        const btn = document.querySelector(`.tool-card h3:contains('${toolName}')`)?.parentNode.querySelector('.action-btn');
        if(btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 실행 중...';
            setTimeout(() => {
                btn.innerHTML = originalText;
                alert(`${toolName} 도구를 실행합니다.`);
            }, 500);
        } else {
            alert(`${toolName} 도구를 실행합니다.`);
        }
    }
    
    // Helper for contains selector equivalent
    jQueryLikeContains = (selector, text) => {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).filter(element => element.textContent.includes(text));
    };

    init();
});
