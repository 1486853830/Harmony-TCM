// ========================================
// Component Loader
// Dynamically loads reusable HTML components
// ========================================

class ComponentLoader {
    constructor() {
        this.components = {
            'navbar': 'components/navbar.html',
            'footer': 'components/footer.html'
        };
    }

    async loadComponent(name) {
        const path = this.components[name];
        if (!path) {
            console.error(`Component "${name}" not found`);
            return null;
        }

        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error(`Error loading component "${name}":`, error);
            return null;
        }
    }

    async insertComponent(name, targetSelector) {
        const content = await this.loadComponent(name);
        if (content) {
            const target = document.querySelector(targetSelector);
            if (target) {
                target.innerHTML = content;
                return true;
            }
        }
        return false;
    }

    async loadAll() {
        const promises = [];
        
        for (const [name, selector] of Object.entries(this.components)) {
            promises.push(this.insertComponent(name, `[data-component="${name}"]`));
        }

        const results = await Promise.all(promises);
        const successCount = results.filter(r => r).length;
        
        console.log(`Loaded ${successCount}/${results.length} components`);
        
        // Set active navigation link based on current page
        this.setActiveNavLink();
        
        return successCount === results.length;
    }

    setActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            if (href) {
                // Check if current path matches href
                if (currentPath.endsWith(href) || 
                    (currentPath.endsWith('/') && href === 'index.html') ||
                    (currentPath.endsWith('index.html') && href === 'index.html')) {
                    link.classList.add('active');
                }
            }
        });
    }
}

// Initialize component loader when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    const loader = new ComponentLoader();
    await loader.loadAll();
    
    // Dispatch custom event when components are loaded
    document.dispatchEvent(new CustomEvent('componentsLoaded'));
});
