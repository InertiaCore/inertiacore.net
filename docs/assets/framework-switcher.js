(function () {
  const css = `
    .fw-switcher {
      display: flex;
      gap: 0;
      margin: 1rem 0;
      background: #4a5074;
      border-radius: 0.5rem;
      padding: 0.25rem;
      width: fit-content;
    }

    .fw-switcher button {
      border: none;
      background: transparent;
      color: rgba(255, 255, 255, 0.7);
      padding: 0.5rem 1.5rem;
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 400;
      transition: all 0.2s ease;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    }

    .fw-switcher button:hover {
      color: rgba(255, 255, 255, 0.9);
    }

    .fw-switcher button[aria-pressed="true"] {
      background: #3a3f5c;
      color: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .fw-switcher button[aria-pressed="true"]:hover {
      background: #3a3f5c;
      color: white;
    }

    .fw-group {
      margin: 1.5rem 0;
    }

    .fw-hidden {
      display: none !important;
    }

    /* Framework group styling - preserve PrismJS syntax highlighting */
    .fw-group pre {
      margin-top: 0;
    }

    /* Ensure PrismJS styles take precedence over any framework switcher styles */
    .fw-group pre code[class*="lang-"],
    .fw-group pre code[class*="language-"] {
      /* Let PrismJS handle all styling for syntax highlighted code */
    }

    /* Only apply basic styling to non-highlighted code blocks */
    .fw-group pre:not([class*="lang-"]) {
      border-radius: 0.5rem;
    }
  `;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const CONFIG = {
    storageKey: "docsify-fw",
    frameworks: ["react", "vue", "svelte", "svelte4", "svelte5"],
    defaultFramework: "react",
    // More flexible pattern to catch various markers
    markerPattern: /^\s*(?:\/\/\s*|#\s*|<!--\s*)?framework:\s*(react|vue|svelte[45]?|vuex)(?:\s*-->)?/i,
    labelPattern: /^(React|Vue|Svelte(?:\s*[45])?):?\s*$/i,
    maxLinesToCheck: 5
  };

  let currentFramework = localStorage.getItem(CONFIG.storageKey) || CONFIG.defaultFramework;

  function setFramework(framework) {
    if (currentFramework === framework) return;

    currentFramework = framework;
    localStorage.setItem(CONFIG.storageKey, framework);
    updateAllGroups();
    updateAllSwitchers();
  }

  function normalizeFrameworkName(name) {
    const normalized = name.toLowerCase().replace(/\s+/g, '');

    // Handle common variations and typos
    if (normalized === 'vuex') return 'vue';
    if (normalized === 'svelte4') return 'svelte4';
    if (normalized === 'svelte5') return 'svelte5';
    if (normalized === 'svelte') return 'svelte';
    if (normalized === 'vue3') return 'vue';
    if (normalized === 'react') return 'react';

    return normalized;
  }

  function detectFramework(codeElement) {
    // Check if already detected and cached
    if (codeElement.dataset.framework) {
      return codeElement.dataset.framework;
    }

    // Check class names first
    for (const framework of CONFIG.frameworks) {
      if (codeElement.classList.contains(framework)) {
        codeElement.dataset.framework = framework;
        return framework;
      }
    }

    const content = codeElement.textContent || "";
    const lines = content.split(/\r?\n/);

    // Check first few lines for framework markers
    for (let i = 0; i < Math.min(lines.length, CONFIG.maxLinesToCheck); i++) {
      const line = lines[i];

      if (!line.trim()) continue;

      // Check for comment-style markers
      const markerMatch = line.match(CONFIG.markerPattern);
      if (markerMatch) {
        const fw = normalizeFrameworkName(markerMatch[1]);
        if (CONFIG.frameworks.includes(fw)) {
          codeElement.dataset.framework = fw;
          return fw;
        }
      }

      // Check for label-style markers
      const labelMatch = line.match(CONFIG.labelPattern);
      if (labelMatch) {
        const framework = normalizeFrameworkName(labelMatch[1]);
        if (CONFIG.frameworks.includes(framework)) {
          codeElement.dataset.framework = framework;
          return framework;
        }
      }

      // Stop at first non-empty, non-comment line
      if (!line.trim().startsWith('//') &&
          !line.trim().startsWith('#') &&
          !line.trim().startsWith('<!--')) {
        break;
      }
    }

    // Check if previous sibling is a paragraph with framework label
    const prevElement = codeElement.parentElement?.previousElementSibling;
    if (prevElement && prevElement.tagName === 'P') {
      const text = prevElement.textContent?.trim() || '';
      const labelMatch = text.match(CONFIG.labelPattern);
      if (labelMatch) {
        const framework = normalizeFrameworkName(labelMatch[1]);
        if (CONFIG.frameworks.includes(framework)) {
          codeElement.dataset.framework = framework;
          return framework;
        }
      }
    }

    return null;
  }

  function stripMarkerLine(codeElement) {
    if (codeElement.dataset.markerStripped === "true") return;

    const content = codeElement.textContent || "";
    const lines = content.split(/\r?\n/);

    for (let i = 0; i < Math.min(lines.length, CONFIG.maxLinesToCheck); i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      // Strip comment-style markers
      if (CONFIG.markerPattern.test(line)) {
        lines.splice(i, 1);
        codeElement.textContent = lines.join("\n");
        codeElement.dataset.markerStripped = "true";
        return;
      }

      // Strip label-style markers
      if (CONFIG.labelPattern.test(line)) {
        lines.splice(i, 1);
        codeElement.textContent = lines.join("\n");
        codeElement.dataset.markerStripped = "true";
        return;
      }

      // Stop at first non-empty, non-comment line
      if (!line.trim().startsWith('//') &&
          !line.trim().startsWith('#') &&
          !line.trim().startsWith('<!--')) {
        break;
      }
    }

    codeElement.dataset.markerStripped = "true";
  }

  function formatFrameworkName(framework) {
    const names = {
      react: "React",
      vue: "Vue",
      svelte: "Svelte",
      svelte4: "Svelte 4",
      svelte5: "Svelte 5"
    };
    return names[framework] || framework.charAt(0).toUpperCase() + framework.slice(1);
  }

  function createSwitcher(onSelect, selectedFramework, availableFrameworks) {
    const container = document.createElement("div");
    container.className = "fw-switcher";

    // Only create buttons for frameworks that are actually present
    availableFrameworks.forEach(framework => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = formatFrameworkName(framework);
      button.dataset.framework = framework;
      button.setAttribute("aria-pressed", String(framework === selectedFramework));
      button.setAttribute("aria-label", `Switch to ${formatFrameworkName(framework)} examples`);

      button.addEventListener("click", (e) => {
        e.preventDefault();
        onSelect(framework);
      });

      container.appendChild(button);
    });

    return container;
  }

  function updateGroupVisibility(groupElement) {
    const codeBlocks = groupElement.querySelectorAll("pre > code");
    let visibleFramework = null;
    let hasVisibilityChanges = false;

    codeBlocks.forEach(codeBlock => {
      const framework = codeBlock.dataset.framework || detectFramework(codeBlock);
      if (framework) {
        const preElement = codeBlock.parentElement;
        const shouldHide = framework !== currentFramework;
        const wasHidden = preElement.classList.contains("fw-hidden");

        if (shouldHide) {
          preElement.classList.add("fw-hidden");
        } else {
          preElement.classList.remove("fw-hidden");
          visibleFramework = framework;
        }

        // Track if visibility changed
        if (wasHidden !== shouldHide) {
          hasVisibilityChanges = true;
        }
      }
    });

    // If current framework isn't available in this group, show the first available one
    if (!visibleFramework && codeBlocks.length > 0) {
      const availableFrameworks = getAvailableFrameworks(groupElement);
      if (availableFrameworks.length > 0) {
        const firstFramework = availableFrameworks[0];
        codeBlocks.forEach(codeBlock => {
          const framework = codeBlock.dataset.framework || detectFramework(codeBlock);
          if (framework === firstFramework) {
            codeBlock.parentElement.classList.remove("fw-hidden");
            hasVisibilityChanges = true;
          }
        });
      }
    }

    // Re-highlight newly visible code blocks
    if (hasVisibilityChanges && window.Prism && window.Prism.highlightAllUnder) {
      window.Prism.highlightAllUnder(groupElement);
    }
  }

  function getAvailableFrameworks(groupElement) {
    const frameworks = new Set();
    const codeBlocks = groupElement.querySelectorAll("pre > code");

    codeBlocks.forEach(codeBlock => {
      const framework = codeBlock.dataset.framework || detectFramework(codeBlock);
      if (framework) {
        frameworks.add(framework);
      }
    });

    // Return frameworks in the preferred order
    return CONFIG.frameworks.filter(fw => frameworks.has(fw));
  }

  function updateAllGroups() {
    const groups = document.querySelectorAll(".fw-group");
    groups.forEach(updateGroupVisibility);
  }

  function updateAllSwitchers() {
    const groups = document.querySelectorAll(".fw-group");

    groups.forEach(groupElement => {
      const switcher = groupElement.querySelector(".fw-switcher");
      if (!switcher) return;

      const availableFrameworks = getAvailableFrameworks(groupElement);

      // Update button visibility and selection
      switcher.querySelectorAll("button").forEach(button => {
        const framework = button.dataset.framework;

        // Hide button if framework not available
        if (!availableFrameworks.includes(framework)) {
          button.style.display = 'none';
        } else {
          button.style.display = '';

          // Update selection state
          const isSelected = framework === currentFramework;
          button.setAttribute("aria-pressed", String(isSelected));
        }
      });

      // If current framework isn't available, select the first available one for this group
      if (!availableFrameworks.includes(currentFramework) && availableFrameworks.length > 0) {
        const firstButton = switcher.querySelector(`button[data-framework="${availableFrameworks[0]}"]`);
        if (firstButton) {
          firstButton.setAttribute("aria-pressed", "true");
        }
      }
    });
  }

  function isAdjacentBlock(batch, codeBlock) {
    if (batch.length === 0) return false;

    const lastBlock = batch[batch.length - 1];
    const lastPre = lastBlock.parentElement;
    const currentPre = codeBlock.parentElement;

    // Check if they're siblings and close together
    if (lastPre.parentNode !== currentPre.parentNode) {
      return false;
    }

    let sibling = lastPre.nextSibling;
    let distance = 0;

    while (sibling && sibling !== currentPre) {
      // Count only element nodes that aren't empty text
      if (sibling.nodeType === Node.ELEMENT_NODE) {
        // Skip empty paragraphs
        if (sibling.tagName === 'P' && !sibling.textContent.trim()) {
          sibling = sibling.nextSibling;
          continue;
        }
        // Skip paragraphs with just framework labels
        if (sibling.tagName === 'P') {
          const text = sibling.textContent?.trim() || '';
          if (CONFIG.labelPattern.test(text)) {
            sibling = sibling.nextSibling;
            continue;
          }
        }
        distance++;
        // Reduce distance threshold to ensure proper grouping
        if (distance > 1) {
          return false;
        }
      }
      sibling = sibling.nextSibling;
    }

    return sibling === currentPre;
  }

  function processPage() {
    // Clear any existing processing
    const existingGroups = document.querySelectorAll(".fw-group");
    existingGroups.forEach(group => {
      const codeBlocks = group.querySelectorAll("pre > code");
      codeBlocks.forEach(block => {
        delete block.dataset.framework;
        delete block.dataset.markerStripped;
      });
    });

    // Find all ungrouped code blocks
    const allCodeBlocks = Array.from(document.querySelectorAll("pre > code"))
      .filter(codeBlock => !codeBlock.closest(".fw-group"));

    let currentBatch = [];
    let batchFrameworks = new Set();

    const createGroupFromBatch = () => {
      if (currentBatch.length < 2) {
        currentBatch = [];
        batchFrameworks.clear();
        return;
      }

      const preElements = currentBatch.map(code => code.parentElement);
      const parentElement = preElements[0].parentNode;

      // Create the group
      const group = document.createElement("div");
      group.className = "fw-group";

      // Insert group before the first pre element
      parentElement.insertBefore(group, preElements[0]);

      // Get available frameworks for this group (in preferred order)
      const availableFrameworks = CONFIG.frameworks.filter(fw => batchFrameworks.has(fw));

      // Determine which framework to show initially
      let selectedFramework = currentFramework;
      if (!availableFrameworks.includes(currentFramework) && availableFrameworks.length > 0) {
        selectedFramework = availableFrameworks[0];
      }

      // Create and add switcher with only available frameworks
      const switcher = createSwitcher(setFramework, selectedFramework, availableFrameworks);
      group.appendChild(switcher);

      // Collect all elements between first and last pre (including framework labels)
      let current = preElements[0];
      const lastPre = preElements[preElements.length - 1];
      const elementsToMove = [];

      while (current && current !== lastPre.nextSibling) {
        const next = current.nextSibling;

        // Include framework label paragraphs
        if (current.tagName === 'P') {
          const text = current.textContent?.trim() || '';
          if (CONFIG.labelPattern.test(text)) {
            elementsToMove.push(current);
          }
        } else if (preElements.includes(current)) {
          elementsToMove.push(current);
        }

        current = next;
      }

      // Move all collected elements to the group
      elementsToMove.forEach(element => {
        group.appendChild(element);
      });

      // Set initial visibility
      const codeBlocks = group.querySelectorAll("pre > code");
      codeBlocks.forEach(codeBlock => {
        const framework = codeBlock.dataset.framework || detectFramework(codeBlock);
        if (framework) {
          const preElement = codeBlock.parentElement;
          if (framework !== selectedFramework) {
            preElement.classList.add("fw-hidden");
          }
        }
      });

      // Re-trigger PrismJS highlighting for moved code blocks
      if (window.Prism && window.Prism.highlightAllUnder) {
        window.Prism.highlightAllUnder(group);
      } else if (window.Prism && window.Prism.highlightAll) {
        window.Prism.highlightAll();
      }

      currentBatch = [];
      batchFrameworks.clear();
    };

    // Process all code blocks
    for (let i = 0; i < allCodeBlocks.length; i++) {
      const codeBlock = allCodeBlocks[i];
      const framework = detectFramework(codeBlock);

      if (framework) {
        stripMarkerLine(codeBlock);

        // Check if this should be part of current batch
        const isAdjacent = currentBatch.length === 0 || isAdjacentBlock(currentBatch, codeBlock);

        if (isAdjacent) {
          // Additional check: ensure we're not merging different framework sets
          // If we already have all frameworks in the batch, start a new group
          if (batchFrameworks.size >= 3 && !batchFrameworks.has(framework)) {
            createGroupFromBatch();
            currentBatch = [codeBlock];
            batchFrameworks.clear();
            batchFrameworks.add(framework);
          } else {
            currentBatch.push(codeBlock);
            batchFrameworks.add(framework);
          }
        } else {
          createGroupFromBatch();
          currentBatch = [codeBlock];
          batchFrameworks.clear();
          batchFrameworks.add(framework);
        }
      } else {
        createGroupFromBatch();
      }
    }

    createGroupFromBatch();
  }

  // Docsify plugin
  function frameworkSwitcherPlugin(hook, vm) {
    hook.init(() => {
      // Validate stored framework on init
      if (!CONFIG.frameworks.includes(currentFramework)) {
        currentFramework = CONFIG.defaultFramework;
        localStorage.setItem(CONFIG.storageKey, currentFramework);
      }
    });

    hook.doneEach(() => {
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        processPage();
      });
    });
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(frameworkSwitcherPlugin);
})();