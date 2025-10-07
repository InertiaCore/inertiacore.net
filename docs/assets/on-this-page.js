(function () {
  const css = `
    /* On This Page Sidebar */
    .on-this-page {
      position: fixed;
      top: 80px;
      right: 0;
      width: 280px;
      height: calc(100vh - 80px);
      background: var(--sidebar-bg, var(--background, #2d3748));
      padding: 2rem 1.5rem 2rem 1.5rem;
      overflow-y: auto;
      z-index: 5;
      box-sizing: border-box;
    }

    .on-this-page::before {
      content: '';
      position: fixed;
      top: 0;
      right: 280px;
      width: 1px;
      height: 100vh;
      background: var(--border-color, var(--borderColor, #4a5568));
      z-index: 5;
    }

    .on-this-page h3 {
      color: var(--text-color-tertiary, var(--textColor, #a0aec0));
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 1rem 0;
      padding: 0;
    }

    .on-this-page ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .on-this-page li {
      margin: 0;
      padding: 0;
    }

    .on-this-page a {
      display: block;
      color: var(--sidebar-link-color, var(--textColor, #cbd5e0));
      text-decoration: none;
      padding: 0.5rem 0;
      font-size: 0.875rem;
      line-height: 1.4;
      border-left: 2px solid transparent;
      padding-left: 0.75rem;
      transition: all 0.2s ease;
    }

    .on-this-page a:hover {
      color: var(--sidebar-link-hover-color, var(--theme-color, #fff));
      border-left-color: var(--border-color, var(--borderColor, #4a5568));
    }

    .on-this-page a.active {
      color: var(--sidebar-link-active-color, var(--theme-color, #fff));
      border-left-color: var(--theme-color, #60a5fa);
      background: var(--sidebar-link-active-bg, rgba(96, 165, 250, 0.1));
    }

    /* Nested items */
    .on-this-page ul ul a {
      padding-left: 1.5rem;
      font-size: 0.8125rem;
      color: var(--text-color-secondary, var(--textColor, #a0aec0));
    }

    .on-this-page ul ul ul a {
      padding-left: 2.25rem;
    }

    /* View as markdown link */
    .view-as-markdown {
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color, var(--borderColor, #4a5568));
    }

    .view-as-markdown a {
      display: inline-flex;
      align-items: center;
      color: var(--theme-color, #60a5fa);
      text-decoration: none;
      font-size: 0.875rem;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--border-color, var(--borderColor, #4a5568));
      border-radius: 0.375rem;
      transition: all 0.2s ease;
    }

    .view-as-markdown a:hover {
      background: var(--sidebar-link-hover-bg, rgba(96, 165, 250, 0.1));
      border-color: var(--theme-color, #60a5fa);
    }

    /* Adjust main content to account for right sidebar */
    .content {
      margin-right: 300px;
    }

    /* Hide on mobile */
    @media (max-width: 1280px) {
      .on-this-page {
        display: none;
      }

      .content {
        margin-right: 0;
      }
    }

    /* Smooth scrolling for anchor links */
    html {
      scroll-behavior: smooth;
    }
  `;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  function removeNestedFromLeftSidebar() {
    // Find the left sidebar
    const leftSidebar = document.querySelector('aside.sidebar');
    if (!leftSidebar) return;

    // Find the main sidebar navigation
    const sidebarNav = leftSidebar.querySelector('.sidebar-nav');
    if (!sidebarNav) return;

    // Store the currently active link before we start removing things
    const currentActiveLink = sidebarNav.querySelector('li.active > a');
    let activeHref = null;
    let activeText = null;

    if (currentActiveLink) {
      activeHref = currentActiveLink.getAttribute('href');
      activeText = currentActiveLink.textContent.trim();
    }

    // Remove ALL auto-generated heading links from the entire sidebar
    // These are any links that contain ?id= (Docsify's auto-generated heading links)
    const allLinks = sidebarNav.querySelectorAll('a[href*="?id="]');
    allLinks.forEach(link => {
      const linkLi = link.parentElement;
      if (linkLi) {
        linkLi.remove();
      }
    });

    // Clean up any empty nested ul elements that might be left behind
    const allUls = sidebarNav.querySelectorAll('ul');
    allUls.forEach(ul => {
      // If the ul has no child li elements or only empty li elements, remove it
      const childLis = ul.querySelectorAll('li');
      const hasValidContent = Array.from(childLis).some(li => {
        return li.querySelector('a') || li.textContent.trim();
      });

      if (!hasValidContent || childLis.length === 0) {
        ul.remove();
      }
    });

    // Clean up any empty li elements
    const allLis = sidebarNav.querySelectorAll('li');
    allLis.forEach(li => {
      const hasLink = li.querySelector('a');
      const hasNestedContent = li.querySelector('ul');
      const hasText = li.textContent.trim();

      if (!hasLink && !hasNestedContent && !hasText) {
        li.remove();
      }
    });

    // Restore active state if we had one and it still exists
    if (activeHref && activeText) {
      const restoredLink = sidebarNav.querySelector(`a[href="${activeHref}"]`);
      if (restoredLink) {
        const li = restoredLink.parentElement;
        if (li) {
          li.classList.add('active');
        }
      } else {
        // Try to find by text content if href doesn't match
        const allRemainingLinks = sidebarNav.querySelectorAll('a');
        for (const link of allRemainingLinks) {
          if (link.textContent.trim() === activeText) {
            const li = link.parentElement;
            if (li) {
              li.classList.add('active');
              break;
            }
          }
        }
      }
    }
  }

  function createOnThisPageSidebar() {
    // Remove existing sidebar
    const existing = document.querySelector('.on-this-page');
    if (existing) {
      existing.remove();
    }

    // Find all headings in the main content
    const headings = document.querySelectorAll('.content h1, .content h2, .content h3, .content h4, .content h5, .content h6');

    if (headings.length === 0) return;

    // Remove nested headings from left sidebar
    removeNestedFromLeftSidebar();

    // Fix left sidebar active state
    updateLeftSidebarActiveState();

    // Create sidebar container
    const sidebar = document.createElement('div');
    sidebar.className = 'on-this-page';

    // Create title
    const title = document.createElement('h3');
    title.textContent = 'ON THIS PAGE';
    sidebar.appendChild(title);

    // Create navigation list
    const nav = document.createElement('ul');

    let currentLevel = 0;
    let currentList = nav;
    const listStack = [nav];

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent.trim();

      // Skip h1 as it's usually the page title
      if (level === 1) return;

      // Generate or get existing ID
      let id = heading.id;
      if (!id) {
        id = text.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/--+/g, '-')
          .trim();
        heading.id = id;
      }

      // Adjust nesting level
      if (level > currentLevel) {
        // Going deeper - create new nested list
        for (let i = currentLevel; i < level - 1; i++) {
          const nestedList = document.createElement('ul');
          const lastLi = currentList.lastElementChild;
          if (lastLi) {
            lastLi.appendChild(nestedList);
          } else {
            currentList.appendChild(nestedList);
          }
          listStack.push(nestedList);
          currentList = nestedList;
        }
      } else if (level < currentLevel) {
        // Going back up - pop from stack
        const diff = currentLevel - level + 1;
        for (let i = 0; i < diff && listStack.length > 1; i++) {
          listStack.pop();
        }
        currentList = listStack[listStack.length - 1];
      }

      currentLevel = level;

      // Create list item and link
      const li = document.createElement('li');
      const link = document.createElement('a');

      // Use the stored route from Docsify
      let currentPath = currentRoute;

      // Remove leading slash if present
      if (currentPath.startsWith('/')) {
        currentPath = currentPath.substring(1);
      }

      // Fallback to window location if route not available
      if (!currentPath) {
        currentPath = window.location.hash.replace('#/', '').split('?')[0];
      }

      // Final fallback
      if (!currentPath) {
        currentPath = 'README';
      }

      link.href = `#/${currentPath}?id=${id}`;
      link.textContent = text;
      link.setAttribute('data-heading-id', id);

      li.appendChild(link);
      currentList.appendChild(li);
    });

    sidebar.appendChild(nav);

    // Add "View as markdown" link
    const markdownLink = createViewAsMarkdownLink();
    if (markdownLink) {
      sidebar.appendChild(markdownLink);
    }

    document.body.appendChild(sidebar);

    // Add scroll spy functionality
    setupScrollSpy();
  }

  function createViewAsMarkdownLink() {
    // Get the base path from the current URL (before the hash)
    const fullUrl = window.location.href;
    const hashIndex = fullUrl.indexOf('#');
    const basePath = hashIndex > -1 ? fullUrl.substring(0, hashIndex) : fullUrl;

    // Extract the path prefix (e.g., /docs/)
    const url = new URL(basePath);
    let pathPrefix = url.pathname;

    // Ensure path prefix ends with /
    if (!pathPrefix.endsWith('/')) {
      pathPrefix += '/';
    }

    // Get current route/path for the markdown file
    let currentPath = currentRoute;
    if (currentPath.startsWith('/')) {
      currentPath = currentPath.substring(1);
    }

    // Handle root/home page
    if (!currentPath || currentPath === '' || currentPath === 'README') {
      currentPath = 'README.md';
    } else if (!currentPath.endsWith('.md')) {
      currentPath = currentPath + '.md';
    }

    // Create the container
    const container = document.createElement('div');
    container.className = 'view-as-markdown';

    // Create the link - use the detected path prefix
    const link = document.createElement('a');
    link.href = `${pathPrefix}${currentPath}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'VIEW AS MARKDOWN';

    container.appendChild(link);
    return container;
  }

  function updateLeftSidebarActiveState() {
    // Let Docsify handle the active state naturally by triggering a small delay
    // The issue might be that our link removal is interfering with Docsify's active state detection
    setTimeout(() => {
      // Find the left sidebar
      const leftSidebar = document.querySelector('aside.sidebar');
      if (!leftSidebar) return;

      const sidebarNav = leftSidebar.querySelector('.sidebar-nav');
      if (!sidebarNav) return;

      // Check if any link is already marked as active by Docsify
      const existingActive = sidebarNav.querySelector('li.active');
      if (existingActive) {
        // Docsify has already set the active state correctly
        return;
      }

      // If no active state is found, manually trigger Docsify's navigation update
      const currentUrl = window.location.hash;
      const matchingLink = sidebarNav.querySelector(`a[href="${currentUrl}"]`);

      if (matchingLink) {
        const li = matchingLink.parentElement;
        if (li) {
          li.classList.add('active');
        }
      } else {
        // Try without the hash
        const pathOnly = currentUrl.replace('#', '');
        const matchingLinkNoHash = sidebarNav.querySelector(`a[href="${pathOnly}"]`);
        if (matchingLinkNoHash) {
          const li = matchingLinkNoHash.parentElement;
          if (li) {
            li.classList.add('active');
          }
        }
      }
    }, 50); // Small delay to let Docsify process first
  }

  function setupScrollSpy() {
    const links = document.querySelectorAll('.on-this-page a[data-heading-id]');
    const headings = Array.from(links).map(link => {
      const id = link.getAttribute('data-heading-id');
      return document.getElementById(id);
    }).filter(Boolean);

    if (headings.length === 0) return;

    function updateActiveLink() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Remove all active classes
      links.forEach(link => link.classList.remove('active'));

      // Find the current heading
      let activeHeading = null;

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        const rect = heading.getBoundingClientRect();

        if (rect.top <= 100) { // 100px offset from top
          activeHeading = heading;
          break;
        }
      }

      // If no heading is above the fold, use the first one
      if (!activeHeading && headings.length > 0) {
        activeHeading = headings[0];
      }

      // Set active link
      if (activeHeading) {
        const activeLink = document.querySelector(`.on-this-page a[data-heading-id="${activeHeading.id}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }

      // Also update the left sidebar active state if it got lost
      updateLeftSidebarActiveState();
    }

    // Throttled scroll handler
    let ticking = false;
    function handleScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveLink();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', handleScroll);
    updateActiveLink(); // Initial call
  }

  // Store current route for URL generation
  let currentRoute = '';

  // Docsify plugin
  function onThisPagePlugin(hook, vm) {
    hook.beforeEach((content) => {
      // Clean up existing sidebar
      const existing = document.querySelector('.on-this-page');
      if (existing) {
        existing.remove();
      }
      return content;
    });

    hook.doneEach(() => {
      // Store the current route from vm
      currentRoute = vm.route.path || '';

      // Use requestAnimationFrame to ensure DOM is fully rendered
      requestAnimationFrame(() => {
        createOnThisPageSidebar();
      });
    });
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(onThisPagePlugin);
})();