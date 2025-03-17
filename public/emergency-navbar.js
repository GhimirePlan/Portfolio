// Emergency navbar script - this will forcibly add a navbar to the page
(function() {
  // Create the navbar HTML
  function createNavbar() {
    const navbar = document.createElement('div');
    navbar.id = 'emergency-navbar';
    navbar.style.cssText = `
      display: flex !important;
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      height: 60px !important;
      z-index: 2147483647 !important;
      background-color: #141b2d !important;
      border-bottom: 4px solid #16f2b3 !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5) !important;
      padding: 0 1.5rem !important;
      align-items: center !important;
      justify-content: space-between !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
      box-sizing: border-box !important;
    `;
    
    navbar.innerHTML = `
      <div style="display: flex; align-items: center;">
        <a href="/" style="color: #16f2b3 !important; font-size: 1.5rem !important; font-weight: bold !important; text-decoration: none !important; line-height: 1.5 !important;">
          Plan Ghimire
        </a>
      </div>
      <div style="display: flex; align-items: center; gap: 1rem;">
        <ul style="display: flex; align-items: center; gap: 0.5rem; list-style: none; margin: 0; padding: 0;">
          <li>
            <a href="https://games.plan.com.np" style="display: block; padding: 0.5rem 0.75rem; color: white !important; text-decoration: none !important; font-size: 0.875rem !important;">
              PlanGames
            </a>
          </li>
          <li>
            <a href="/blog" style="display: block; padding: 0.5rem 0.75rem; color: white !important; text-decoration: none !important; font-size: 0.875rem !important;">
              Blog
            </a>
          </li>
          <li>
            <a href="/test" style="display: block; padding: 0.5rem 0.75rem; color: white !important; text-decoration: none !important; font-size: 0.875rem !important;">
              Test
            </a>
          </li>
        </ul>
      </div>
    `;
    
    return navbar;
  }
  
  // Add the navbar to the body
  function injectNavbar() {
    // Check if navbar already exists
    if (document.getElementById('emergency-navbar')) {
      return;
    }
    
    // Create navbar
    const navbar = createNavbar();
    
    // Add to body
    document.body.insertBefore(navbar, document.body.firstChild);
    
    // Add padding to body to account for navbar
    document.body.style.paddingTop = '80px';
    document.body.style.marginTop = '0';
    
    console.log("Emergency navbar added to page");
  }
  
  // Run when DOM is ready
  function domReady() {
    injectNavbar();
    
    // Ensure it stays visible by checking periodically
    setInterval(function() {
      const navbar = document.getElementById('emergency-navbar');
      if (!navbar) {
        injectNavbar();
      } else {
        // Make sure it's visible and on top
        navbar.style.display = 'flex';
        navbar.style.visibility = 'visible';
        navbar.style.opacity = '1';
        navbar.style.zIndex = '2147483647'; // Maximum z-index value
      }
    }, 500);
  }
  
  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', domReady);
  } else {
    domReady();
  }
  
  // Also run on load
  window.addEventListener('load', domReady);
})(); 