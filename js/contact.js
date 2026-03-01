// ========================================
// Contact Page JavaScript - Social Links Only
// ========================================

document.addEventListener('componentsLoaded', function() {
    initSocialLinks();
});

// Initialize social link interactions
function initSocialLinks() {
    const socialCards = document.querySelectorAll('.social-card');
    
    socialCards.forEach(card => {
        card.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // For external links, let default behavior work
            if (href && !href.startsWith('#')) {
                return;
            }
            
            // For WeChat or other app links that might not work
            if (href && href.startsWith('weixin://')) {
                // Check if WeChat is installed
                setTimeout(() => {
                    // If still on page after timeout, show message
                    if (!document.hidden) {
                        showWeChatMessage();
                    }
                }, 500);
            }
        });
    });
}

// Show WeChat fallback message
function showWeChatMessage() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('wechatModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'wechatModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <h3>WeChat</h3>
                <p>If WeChat didn't open automatically, please:</p>
                <ol>
                    <li>Open WeChat app</li>
                    <li>Search for: <strong>@HarmonyTCM</strong></li>
                    <li>Or scan our QR code</li>
                </ol>
                <p class="wechat-id">WeChat ID: HarmonyTCM</p>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Close button
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    modal.style.display = 'flex';
}
