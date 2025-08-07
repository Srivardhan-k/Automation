// Auto DM Reply System JavaScript

// Application data
let appData = {
  platforms: [
    {"id": "instagram", "name": "Instagram", "connected": true, "icon": "instagram", "color": "#E4405F"},
    {"id": "youtube", "name": "YouTube", "connected": false, "icon": "youtube", "color": "#FF0000"},
    {"id": "pinterest", "name": "Pinterest", "connected": true, "icon": "image", "color": "#BD081C"},
    {"id": "facebook", "name": "Facebook", "connected": false, "icon": "facebook", "color": "#1877F2"},
    {"id": "whatsapp", "name": "WhatsApp", "connected": true, "icon": "message-circle", "color": "#25D366"},
    {"id": "twitter", "name": "Twitter/X", "connected": false, "icon": "twitter", "color": "#1DA1F2"},
    {"id": "tiktok", "name": "TikTok", "connected": true, "icon": "music", "color": "#FF0050"},
    {"id": "linkedin", "name": "LinkedIn", "connected": false, "icon": "linkedin", "color": "#0077B5"}
  ],
  autoReplyRules: [
    {
      "id": 1,
      "name": "Welcome Message",
      "platforms": ["instagram", "whatsapp"],
      "triggers": ["hello", "hi", "hey"],
      "response": "Hello! Thanks for reaching out. How can I help you today?",
      "delay": 2,
      "active": true,
      "created": "2024-01-15"
    },
    {
      "id": 2,
      "name": "Business Hours",
      "platforms": ["facebook", "instagram"],
      "triggers": ["hours", "open", "closed"],
      "response": "We're open Monday-Friday 9AM-6PM. We'll get back to you during business hours!",
      "delay": 1,
      "active": true,
      "created": "2024-01-10"
    },
    {
      "id": 3,
      "name": "Product Inquiry",
      "platforms": ["pinterest", "instagram"],
      "triggers": ["price", "cost", "buy"],
      "response": "Thanks for your interest! Please check our website for current pricing and availability.",
      "delay": 3,
      "active": false,
      "created": "2024-01-08"
    }
  ],
  messageTemplates: [
    {
      "id": 1,
      "name": "Welcome Template",
      "category": "Welcome",
      "content": "Hello {{name}}! Welcome to our community. How can we assist you today?"
    },
    {
      "id": 2,
      "name": "Business Hours Info",
      "category": "FAQ",
      "content": "Hi there! Our business hours are Monday-Friday 9AM-6PM EST. We'll respond during business hours."
    },
    {
      "id": 3,
      "name": "Out of Office",
      "category": "Away",
      "content": "Thanks for your message! We're currently away but will get back to you within 24 hours."
    }
  ],
  analytics: {
    totalReplies: 1247,
    activeRules: 12,
    connectedPlatforms: 4,
    avgResponseTime: "2.3 minutes",
    platformBreakdown: [
      {"platform": "Instagram", "count": 487},
      {"platform": "WhatsApp", "count": 321},
      {"platform": "Pinterest", "count": 234},
      {"platform": "TikTok", "count": 205}
    ],
    weeklyData: [
      {"day": "Mon", "replies": 45},
      {"day": "Tue", "replies": 67},
      {"day": "Wed", "replies": 89},
      {"day": "Thu", "replies": 56},
      {"day": "Fri", "replies": 78},
      {"day": "Sat", "replies": 34},
      {"day": "Sun", "replies": 23}
    ]
  }
};

// Current editing state
let currentEditingRule = null;
let currentEditingTemplate = null;

// DOM elements
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');
const themeToggle = document.getElementById('themeToggle');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Setup navigation
  setupNavigation();
  
  // Setup theme toggle
  setupThemeToggle();
  
  // Render initial content
  renderPlatforms();
  renderRules();
  renderTemplates();
  setupCharts();
  
  // Setup modal handlers
  setupModals();
  
  // Setup form handlers
  setupForms();
  
  console.log('Auto DM Reply System initialized');
}

// Navigation
function setupNavigation() {
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetSection = this.getAttribute('data-section');
      showSection(targetSection);
      
      // Update active nav link
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

function showSection(sectionId) {
  contentSections.forEach(section => {
    section.classList.remove('active');
  });
  
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }
}

// Theme toggle
function setupThemeToggle() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');
  
  let currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-color-scheme', currentTheme);
  
  themeToggle.addEventListener('click', function() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-color-scheme', currentTheme);
    localStorage.setItem('theme', currentTheme);
  });
}

// Platform management
function renderPlatforms() {
  const platformsGrid = document.getElementById('platformsGrid');
  if (!platformsGrid) return;
  
  platformsGrid.innerHTML = '';
  
  appData.platforms.forEach(platform => {
    const platformCard = createPlatformCard(platform);
    platformsGrid.appendChild(platformCard);
  });
}

function createPlatformCard(platform) {
  const card = document.createElement('div');
  card.className = `platform-card ${platform.connected ? 'connected' : ''}`;
  card.style.setProperty('--platform-color', platform.color);
  
  card.innerHTML = `
    <div class="platform-header">
      <div class="platform-icon">
        <i data-lucide="${platform.icon}"></i>
      </div>
      <div class="platform-info">
        <h3>${platform.name}</h3>
      </div>
    </div>
    <div class="platform-status">
      <div class="status-indicator ${platform.connected ? 'connected' : ''}"></div>
      <span>${platform.connected ? 'Connected' : 'Disconnected'}</span>
    </div>
    <div class="platform-actions">
      <button class="btn btn--${platform.connected ? 'secondary' : 'primary'} btn--platform" 
              onclick="togglePlatform('${platform.id}')">
        ${platform.connected ? 'Disconnect' : 'Connect'}
      </button>
      <button class="btn btn--outline btn--platform" onclick="configurePlatform('${platform.id}')">
        <i data-lucide="settings"></i>
        Configure
      </button>
    </div>
  `;
  
  // Re-initialize Lucide icons for the new content
  setTimeout(() => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, 0);
  
  return card;
}

function togglePlatform(platformId) {
  const platform = appData.platforms.find(p => p.id === platformId);
  if (platform) {
    platform.connected = !platform.connected;
    renderPlatforms();
    updateStats();
    showToast(
      `${platform.name} ${platform.connected ? 'connected' : 'disconnected'} successfully!`,
      'success'
    );
  }
}

function configurePlatform(platformId) {
  const platform = appData.platforms.find(p => p.id === platformId);
  if (platform) {
    showToast(`Configuration for ${platform.name} coming soon!`, 'info');
  }
}

// Rules management
function renderRules() {
  const rulesList = document.getElementById('rulesList');
  if (!rulesList) return;
  
  rulesList.innerHTML = '';
  
  if (appData.autoReplyRules.length === 0) {
    rulesList.innerHTML = `
      <div class="empty-state">
        <p>No rules created yet. Create your first auto-reply rule!</p>
      </div>
    `;
    return;
  }
  
  appData.autoReplyRules.forEach(rule => {
    const ruleItem = createRuleItem(rule);
    rulesList.appendChild(ruleItem);
  });
}

function createRuleItem(rule) {
  const item = document.createElement('div');
  item.className = 'rule-item';
  
  const platformNames = rule.platforms.map(id => {
    const platform = appData.platforms.find(p => p.id === id);
    return platform ? platform.name : id;
  });
  
  item.innerHTML = `
    <div class="rule-header">
      <h3 class="rule-title">${rule.name}</h3>
      <div class="rule-toggle">
        <input type="checkbox" class="toggle" ${rule.active ? 'checked' : ''} 
               onchange="toggleRule(${rule.id})">
      </div>
    </div>
    <div class="rule-content">
      <div class="rule-field">
        <div class="rule-field-label">Platforms</div>
        <div class="rule-platforms">
          ${rule.platforms.map(id => `<span class="platform-tag">${appData.platforms.find(p => p.id === id)?.name || id}</span>`).join('')}
        </div>
      </div>
      <div class="rule-field">
        <div class="rule-field-label">Triggers</div>
        <div class="rule-triggers">
          ${rule.triggers.map(trigger => `<span class="trigger-tag">${trigger}</span>`).join('')}
        </div>
      </div>
      <div class="rule-field" style="grid-column: 1 / -1;">
        <div class="rule-field-label">Response</div>
        <div class="rule-field-value">${rule.response}</div>
      </div>
      <div class="rule-field">
        <div class="rule-field-label">Delay</div>
        <div class="rule-field-value">${rule.delay} seconds</div>
      </div>
      <div class="rule-field">
        <div class="rule-field-label">Created</div>
        <div class="rule-field-value">${rule.created}</div>
      </div>
    </div>
    <div class="rule-actions">
      <button class="btn btn--secondary btn--sm" onclick="editRule(${rule.id})">
        <i data-lucide="edit"></i>
        Edit
      </button>
      <button class="btn btn--outline btn--sm" onclick="deleteRule(${rule.id})">
        <i data-lucide="trash-2"></i>
        Delete
      </button>
    </div>
  `;
  
  // Re-initialize Lucide icons
  setTimeout(() => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, 0);
  
  return item;
}

function toggleRule(ruleId) {
  const rule = appData.autoReplyRules.find(r => r.id === ruleId);
  if (rule) {
    rule.active = !rule.active;
    showToast(`Rule "${rule.name}" ${rule.active ? 'activated' : 'deactivated'}`, 'success');
  }
}

function editRule(ruleId) {
  const rule = appData.autoReplyRules.find(r => r.id === ruleId);
  if (rule) {
    currentEditingRule = rule;
    populateRuleForm(rule);
    showModal('ruleModal');
  }
}

function deleteRule(ruleId) {
  if (confirm('Are you sure you want to delete this rule?')) {
    appData.autoReplyRules = appData.autoReplyRules.filter(r => r.id !== ruleId);
    renderRules();
    showToast('Rule deleted successfully', 'success');
  }
}

// Templates management
function renderTemplates() {
  const templatesGrid = document.getElementById('templatesGrid');
  if (!templatesGrid) return;
  
  templatesGrid.innerHTML = '';
  
  if (appData.messageTemplates.length === 0) {
    templatesGrid.innerHTML = `
      <div class="empty-state">
        <p>No templates created yet. Create your first template!</p>
      </div>
    `;
    return;
  }
  
  appData.messageTemplates.forEach(template => {
    const templateCard = createTemplateCard(template);
    templatesGrid.appendChild(templateCard);
  });
}

function createTemplateCard(template) {
  const card = document.createElement('div');
  card.className = 'template-card';
  
  card.innerHTML = `
    <div class="template-header">
      <h3>${template.name}</h3>
      <span class="template-category">${template.category}</span>
    </div>
    <div class="template-content">
      ${template.content}
    </div>
    <div class="template-actions">
      <button class="btn btn--secondary btn--sm" onclick="editTemplate(${template.id})">
        <i data-lucide="edit"></i>
        Edit
      </button>
      <button class="btn btn--outline btn--sm" onclick="useTemplate(${template.id})">
        <i data-lucide="copy"></i>
        Use
      </button>
      <button class="btn btn--outline btn--sm" onclick="deleteTemplate(${template.id})">
        <i data-lucide="trash-2"></i>
        Delete
      </button>
    </div>
  `;
  
  // Re-initialize Lucide icons
  setTimeout(() => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, 0);
  
  return card;
}

function editTemplate(templateId) {
  const template = appData.messageTemplates.find(t => t.id === templateId);
  if (template) {
    currentEditingTemplate = template;
    populateTemplateForm(template);
    showModal('templateModal');
  }
}

function useTemplate(templateId) {
  const template = appData.messageTemplates.find(t => t.id === templateId);
  if (template) {
    navigator.clipboard.writeText(template.content).then(() => {
      showToast('Template copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Failed to copy template', 'error');
    });
  }
}

function deleteTemplate(templateId) {
  if (confirm('Are you sure you want to delete this template?')) {
    appData.messageTemplates = appData.messageTemplates.filter(t => t.id !== templateId);
    renderTemplates();
    showToast('Template deleted successfully', 'success');
  }
}

// Charts
function setupCharts() {
  setupWeeklyChart();
  setupPlatformChart();
}

function setupWeeklyChart() {
  const ctx = document.getElementById('weeklyChart');
  if (!ctx) return;
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: appData.analytics.weeklyData.map(d => d.day),
      datasets: [{
        label: 'Replies',
        data: appData.analytics.weeklyData.map(d => d.replies),
        borderColor: '#1FB8CD',
        backgroundColor: 'rgba(31, 184, 205, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

function setupPlatformChart() {
  const ctx = document.getElementById('platformChart');
  if (!ctx) return;
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: appData.analytics.platformBreakdown.map(p => p.platform),
      datasets: [{
        data: appData.analytics.platformBreakdown.map(p => p.count),
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

// Modal management
function setupModals() {
  // Rule modal
  const createRuleBtn = document.getElementById('createRuleBtn');
  const ruleModal = document.getElementById('ruleModal');
  const closeRuleModal = document.getElementById('closeRuleModal');
  const cancelRule = document.getElementById('cancelRule');
  
  if (createRuleBtn) {
    createRuleBtn.addEventListener('click', () => {
      currentEditingRule = null;
      clearRuleForm();
      document.getElementById('ruleModalTitle').textContent = 'Create New Rule';
      showModal('ruleModal');
    });
  }
  
  if (closeRuleModal) closeRuleModal.addEventListener('click', () => hideModal('ruleModal'));
  if (cancelRule) cancelRule.addEventListener('click', () => hideModal('ruleModal'));
  
  // Template modal
  const createTemplateBtn = document.getElementById('createTemplateBtn');
  const closeTemplateModal = document.getElementById('closeTemplateModal');
  const cancelTemplate = document.getElementById('cancelTemplate');
  
  if (createTemplateBtn) {
    createTemplateBtn.addEventListener('click', () => {
      currentEditingTemplate = null;
      clearTemplateForm();
      document.getElementById('templateModalTitle').textContent = 'Create New Template';
      showModal('templateModal');
    });
  }
  
  if (closeTemplateModal) closeTemplateModal.addEventListener('click', () => hideModal('templateModal'));
  if (cancelTemplate) cancelTemplate.addEventListener('click', () => hideModal('templateModal'));
  
  // Close modals on backdrop click
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.classList.add('hidden');
    }
  });
  
  renderPlatformCheckboxes();
}

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
  }
}

function renderPlatformCheckboxes() {
  const container = document.getElementById('platformCheckboxes');
  if (!container) return;
  
  container.innerHTML = '';
  
  appData.platforms.forEach(platform => {
    const checkbox = document.createElement('div');
    checkbox.className = 'platform-checkbox';
    
    checkbox.innerHTML = `
      <input type="checkbox" id="platform-${platform.id}" name="platforms" value="${platform.id}">
      <label for="platform-${platform.id}">${platform.name}</label>
    `;
    
    container.appendChild(checkbox);
  });
}

// Form handling
function setupForms() {
  const saveRule = document.getElementById('saveRule');
  const saveTemplate = document.getElementById('saveTemplate');
  
  if (saveRule) {
    saveRule.addEventListener('click', handleSaveRule);
  }
  
  if (saveTemplate) {
    saveTemplate.addEventListener('click', handleSaveTemplate);
  }
}

function handleSaveRule(e) {
  e.preventDefault();
  
  // Get form values directly instead of relying on form validation
  const ruleName = document.getElementById('ruleName').value.trim();
  const ruleTriggers = document.getElementById('ruleTriggers').value.trim();
  const ruleResponse = document.getElementById('ruleResponse').value.trim();
  const ruleDelay = document.getElementById('ruleDelay').value;
  const platforms = Array.from(document.querySelectorAll('input[name="platforms"]:checked')).map(cb => cb.value);
  
  // Manual validation
  if (!ruleName) {
    showToast('Please enter a rule name', 'error');
    document.getElementById('ruleName').focus();
    return;
  }
  
  if (platforms.length === 0) {
    showToast('Please select at least one platform', 'error');
    return;
  }
  
  if (!ruleTriggers) {
    showToast('Please enter trigger keywords', 'error');
    document.getElementById('ruleTriggers').focus();
    return;
  }
  
  if (!ruleResponse) {
    showToast('Please enter a response message', 'error');
    document.getElementById('ruleResponse').focus();
    return;
  }
  
  const ruleData = {
    name: ruleName,
    platforms: platforms,
    triggers: ruleTriggers.split(',').map(t => t.trim()).filter(t => t),
    response: ruleResponse,
    delay: parseInt(ruleDelay) || 2,
    active: true,
    created: new Date().toISOString().split('T')[0]
  };
  
  if (currentEditingRule) {
    // Edit existing rule
    Object.assign(currentEditingRule, ruleData);
    showToast('Rule updated successfully', 'success');
  } else {
    // Create new rule
    ruleData.id = Math.max(...appData.autoReplyRules.map(r => r.id), 0) + 1;
    appData.autoReplyRules.push(ruleData);
    showToast('Rule created successfully', 'success');
  }
  
  renderRules();
  hideModal('ruleModal');
}

function handleSaveTemplate(e) {
  e.preventDefault();
  
  // Get form values directly
  const templateName = document.getElementById('templateName').value.trim();
  const templateCategory = document.getElementById('templateCategory').value;
  const templateContent = document.getElementById('templateContent').value.trim();
  
  // Manual validation
  if (!templateName) {
    showToast('Please enter a template name', 'error');
    document.getElementById('templateName').focus();
    return;
  }
  
  if (!templateContent) {
    showToast('Please enter template content', 'error');
    document.getElementById('templateContent').focus();
    return;
  }
  
  const templateData = {
    name: templateName,
    category: templateCategory,
    content: templateContent
  };
  
  if (currentEditingTemplate) {
    // Edit existing template
    Object.assign(currentEditingTemplate, templateData);
    showToast('Template updated successfully', 'success');
  } else {
    // Create new template
    templateData.id = Math.max(...appData.messageTemplates.map(t => t.id), 0) + 1;
    appData.messageTemplates.push(templateData);
    showToast('Template created successfully', 'success');
  }
  
  renderTemplates();
  hideModal('templateModal');
}

function populateRuleForm(rule) {
  document.getElementById('ruleName').value = rule.name;
  document.getElementById('ruleTriggers').value = rule.triggers.join(', ');
  document.getElementById('ruleResponse').value = rule.response;
  document.getElementById('ruleDelay').value = rule.delay;
  document.getElementById('ruleModalTitle').textContent = 'Edit Rule';
  
  // Clear all platform checkboxes first
  document.querySelectorAll('input[name="platforms"]').forEach(cb => cb.checked = false);
  
  // Check platforms for this rule
  rule.platforms.forEach(platformId => {
    const checkbox = document.getElementById(`platform-${platformId}`);
    if (checkbox) checkbox.checked = true;
  });
}

function clearRuleForm() {
  document.getElementById('ruleForm').reset();
  document.querySelectorAll('input[name="platforms"]').forEach(cb => cb.checked = false);
}

function populateTemplateForm(template) {
  document.getElementById('templateName').value = template.name;
  document.getElementById('templateCategory').value = template.category;
  document.getElementById('templateContent').value = template.content;
  document.getElementById('templateModalTitle').textContent = 'Edit Template';
}

function clearTemplateForm() {
  document.getElementById('templateForm').reset();
}

// Toast notifications
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = toast.querySelector('.toast-message');
  const toastIcon = toast.querySelector('.toast-icon');
  
  toastMessage.textContent = message;
  
  // Set icon based on type
  let iconName = 'check-circle';
  if (type === 'error') iconName = 'x-circle';
  if (type === 'warning') iconName = 'alert-triangle';
  if (type === 'info') iconName = 'info';
  
  toastIcon.setAttribute('data-lucide', iconName);
  
  // Update icon
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  toast.classList.remove('hidden');
  
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

// Update stats
function updateStats() {
  const connectedCount = appData.platforms.filter(p => p.connected).length;
  appData.analytics.connectedPlatforms = connectedCount;
  
  // Update dashboard stats if visible
  const statCards = document.querySelectorAll('.stat-number');
  if (statCards.length >= 2) {
    statCards[1].textContent = connectedCount;
  }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
  // Escape key to close modals
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
      modal.classList.add('hidden');
    });
  }
  
  // Ctrl/Cmd + N for new rule
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault();
    const createRuleBtn = document.getElementById('createRuleBtn');
    if (createRuleBtn && createRuleBtn.offsetParent !== null) {
      createRuleBtn.click();
    }
  }
});