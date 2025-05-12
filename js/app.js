/**
 * CompMax - Salary & Equity Compensation Calculator
 * Main application script
 */

// Application state
const AppState = {
    isEmployeeView: false,
    employerEmail: '',
    senderName: '',
    equityType: 'percentage', // Default to percentage
    offerDetails: null,
    acceptanceDetails: null
};

// DOM Elements
const Elements = {};

/**
 * Initialize the application
 */
function initializeApp() {
    // Get DOM elements
    cacheElements();
    
    // Initialize EmailJS
    initializeEmailJS();
    
    // Set default date
    setDefaultDate();
    
    // Check for URL parameters
    processUrlParams();
    
    // Add event listeners
    setupEventListeners();
    
    // Initial calculation
    calculateCompensation();
    
    // Update the info text based on the view
    updateInfoText();
}

/**
 * Cache DOM elements to avoid repetitive querySelector calls
 */
function cacheElements() {
    const ids = [
        'company-name', 'sender-name', 'employer-email', 'offer-date', 
        'position-title', 'employee-name', 'employee-email', 'max-salary', 'max-equity',
        'max-shares', 'equity-percentage', 'equity-shares', 'max-equity-group', 'max-shares-group',
        'salary-slider', 'current-salary', 'current-equity', 'current-shares',
        'current-equity-container', 'current-shares-container',
        'generate-link', 'share-link', 'copy-link', 'employee-mode-banner', 'share-container', 
        'sender-name-group', 'employer-email-group', 'employee-email-group', 'accept-offer-container',
        'accept-offer-button', 'acceptance-email-controls', 'offer-accepted-message',
        'employer-email-display', 'acceptance-subject-display', 'acceptance-email-content',
        'copy-acceptance-content', 'employee-sender-name', 'send-acceptance-email-button',
        'acceptance-email-status', 'acceptance-sending-status', 'email-sending-controls',
        'send-email-button', 'email-status', 'sending-status', 'link-status-message',
        'employee-email-display', 'offer-subject-display', 'offer-email-content',
        'copy-offer-content', 'all-details', 'error-modal', 'error-message',
        'close-error-modal', 'error-ok-button', 'employer-info-text', 'employee-info-text'
    ];
    
    ids.forEach(id => {
        Elements[id] = document.getElementById(id);
    });
}

/**
 * Initialize the EmailJS service
 */
function initializeEmailJS() {
    try {
        // Initialize EmailJS safely
        if (typeof emailjs !== 'undefined') {
            emailjs.init(CONFIG.emailjs.publicKey);
            console.log("EmailJS initialized successfully");
            window.emailJsLoaded = true;
        } else {
            console.warn("EmailJS library not loaded");
            window.emailJsLoaded = false;
        }
    } catch (error) {
        console.error("EmailJS initialization error:", error);
        window.emailJsLoaded = false;
    }
}

/**
 * Set today's date as default for the offer date
 */
function setDefaultDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedToday = `${yyyy}-${mm}-${dd}`;
    Elements['offer-date'].value = formattedToday;
}

/**
 * Process URL parameters to determine view mode and populate fields
 */
function processUrlParams() {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check if we're in employee view mode
    AppState.isEmployeeView = urlParams.has('name') && urlParams.has('maxSalary') && 
                             (urlParams.has('maxEquity') || urlParams.has('maxShares'));
    
    if (AppState.isEmployeeView) {
        setupEmployeeView(urlParams);
    }
}

/**
 * Set up the view for an employee reviewing an offer
 * @param {URLSearchParams} urlParams - URL parameters containing offer details
 */
function setupEmployeeView(urlParams) {
    // Extract parameters with fallbacks
    const companyName = urlParams.get('company') || '';
    const positionTitle = urlParams.get('position') || '';
    const offerDate = urlParams.get('date') || '';
    const employeeName = urlParams.get('name') || '';
    const maxSalary = safeParseFloat(urlParams.get('maxSalary'), CONFIG.defaults.maxSalary);
    const sliderPosition = safeParseInt(urlParams.get('sliderpos'), CONFIG.defaults.sliderPosition);
    AppState.employerEmail = urlParams.get('email') || '';
    AppState.senderName = urlParams.get('sender') || '';
    
    // Get equity type and value
    AppState.equityType = urlParams.get('equityType') || 'percentage';
    
    // Set values based on equity type
    if (AppState.equityType === 'percentage') {
        Elements['equity-percentage'].checked = true;
        Elements['equity-shares'].checked = false;
        Elements['max-equity-group'].style.display = 'block';
        Elements['max-shares-group'].style.display = 'none';
        Elements['current-equity-container'].style.display = 'block';
        Elements['current-shares-container'].style.display = 'none';
        
        const maxEquity = safeParseFloat(urlParams.get('maxEquity'), CONFIG.defaults.maxEquity);
        Elements['max-equity'].value = maxEquity;
    } else {
        Elements['equity-percentage'].checked = false;
        Elements['equity-shares'].checked = true;
        Elements['max-equity-group'].style.display = 'none';
        Elements['max-shares-group'].style.display = 'block';
        Elements['current-equity-container'].style.display = 'none';
        Elements['current-shares-container'].style.display = 'block';
        
        const maxShares = safeParseInt(urlParams.get('maxShares'), CONFIG.defaults.maxShares);
        Elements['max-shares'].value = maxShares;
    }
    
    // Set other values
    if (companyName) Elements['company-name'].value = companyName;
    if (positionTitle) Elements['position-title'].value = positionTitle;
    if (offerDate) Elements['offer-date'].value = offerDate;
    if (AppState.senderName) Elements['sender-name'].value = AppState.senderName;
    Elements['employee-name'].value = employeeName;
    Elements['max-salary'].value = maxSalary;
    Elements['salary-slider'].value = sliderPosition;
    
    // Update ARIA attributes for slider
    Elements['salary-slider'].setAttribute('aria-valuenow', sliderPosition);
    
    // Disable inputs that shouldn't be changed
    Elements['company-name'].disabled = true;
    Elements['position-title'].disabled = true;
    Elements['offer-date'].disabled = true;
    Elements['sender-name'].disabled = true;
    Elements['employee-name'].disabled = true;
    Elements['max-salary'].disabled = true;
    Elements['max-equity'].disabled = true;
    Elements['max-shares'].disabled = true;
    Elements['equity-percentage'].disabled = true;
    Elements['equity-shares'].disabled = true;
    
    // Hide employee email field in employee view
    if (Elements['employee-email-group']) {
        Elements['employee-email-group'].style.display = 'none';
    }
    
    // Show the employee mode banner
    Elements['employee-mode-banner'].style.display = 'block';
    
    // Hide the employer email input and sender name group
    Elements['employer-email-group'].style.display = 'none';
    Elements['sender-name-group'].style.display = 'none';
    
    // Hide the share section
    Elements['share-container'].style.display = 'none';
    
    // Show the accept offer button
    Elements['accept-offer-container'].style.display = 'block';
    
    // Update page title
    document.title = `CompMax - ${employeeName}'s Compensation Package`;
    
    // Update the info text to show employee message
    updateInfoText();
}

/**
 * Update the info text based on whether in employee or employer view
 */
function updateInfoText() {
    if (AppState.isEmployeeView) {
        Elements['employer-info-text'].style.display = 'none';
        Elements['employee-info-text'].style.display = 'block';
    } else {
        Elements['employer-info-text'].style.display = 'block';
        Elements['employee-info-text'].style.display = 'none';
    }
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Input change events
    Elements['max-salary'].addEventListener('input', calculateCompensation);
    Elements['max-equity'].addEventListener('input', calculateCompensation);
    Elements['max-shares'].addEventListener('input', calculateCompensation);
    Elements['salary-slider'].addEventListener('input', onSliderChange);
    
    // Equity type radio buttons
    Elements['equity-percentage'].addEventListener('change', handleEquityTypeChange);
    Elements['equity-shares'].addEventListener('change', handleEquityTypeChange);
    
    // Button click events
    Elements['generate-link'].addEventListener('click', generateShareLink);
    Elements['copy-link'].addEventListener('click', copyShareLink);
    
    // Modal events
    Elements['close-error-modal'].addEventListener('click', closeErrorModal);
    Elements['error-ok-button'].addEventListener('click', closeErrorModal);
    
    // Accept offer functionality
    if (AppState.isEmployeeView) {
        Elements['accept-offer-button'].addEventListener('click', sendOfferToEmployer);
    }
    
    // Keyboard accessibility for slider
    Elements['salary-slider'].addEventListener('keydown', handleSliderKeydown);
}

/**
 * Handle equity type change
 */
function handleEquityTypeChange(event) {
    AppState.equityType = event.target.value;
    
    // Toggle visibility of input fields and results
    if (AppState.equityType === 'percentage') {
        Elements['max-equity-group'].style.display = 'block';
        Elements['max-shares-group'].style.display = 'none';
        Elements['current-equity-container'].style.display = 'block';
        Elements['current-shares-container'].style.display = 'none';
    } else {
        Elements['max-equity-group'].style.display = 'none';
        Elements['max-shares-group'].style.display = 'block';
        Elements['current-equity-container'].style.display = 'none';
        Elements['current-shares-container'].style.display = 'block';
    }
    
    // Recalculate compensation
    calculateCompensation();
}

/**
 * Handle slider changes for accessibility
 */
function onSliderChange() {
    // Update the ARIA values for screen readers
    Elements['salary-slider'].setAttribute('aria-valuenow', Elements['salary-slider'].value);
    
    // Calculate the new compensation values
    calculateCompensation();
}

/**
 * Handle keyboard navigation for the slider
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleSliderKeydown(event) {
    let newValue = parseInt(Elements['salary-slider'].value);
    const step = 5; // Change value by 5% on arrow key press
    
    switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
            newValue = Math.max(0, newValue - step);
            event.preventDefault();
            break;
        case 'ArrowRight':
        case 'ArrowUp':
            newValue = Math.min(100, newValue + step);
            event.preventDefault();
            break;
        case 'Home':
            newValue = 0;
            event.preventDefault();
            break;
        case 'End':
            newValue = 100;
            event.preventDefault();
            break;
        default:
            return; // Exit if any other key is pressed
    }
    
    Elements['salary-slider'].value = newValue;
    Elements['salary-slider'].setAttribute('aria-valuenow', newValue);
    calculateCompensation();
}

/**
 * Calculate and display the current compensation values
 */
function calculateCompensation() {
    // Get the max salary with validation
    const maxSalary = validateNumericInput(
        Elements['max-salary'].value,
        CONFIG.validation.salary.min,
        CONFIG.validation.salary.max,
        CONFIG.defaults.maxSalary
    );
    
    // Get slider value (0-1 range)
    const sliderValue = parseInt(Elements['salary-slider'].value) / 100;
    
    // Calculate current salary
    const currentSalary = maxSalary * sliderValue;
    Elements['current-salary'].textContent = formatCurrency(currentSalary);


        /**
     * Format number input with commas as thousands separators
     * @param {Event} event - Input event
     */
    function formatSharesInput(event) {
        const input = event.target;
        
        // Save cursor position relative to the end
        const cursorFromEnd = input.value.length - input.selectionStart;
        
        // Get value without commas and other non-digits
        const rawValue = input.value.replace(/[^\d]/g, '');
        
        // Format with commas
        if (rawValue) {
            const formattedValue = parseInt(rawValue).toLocaleString('en-US');
            input.value = formattedValue;
            
            // Restore cursor position relative to the end
            const newCursorPos = Math.max(0, input.value.length - cursorFromEnd);
            input.setSelectionRange(newCursorPos, newCursorPos);
        } else {
            input.value = '';
        }
    }

/**
 * Parse a number with comma separators
 * @param {string} value - Formatted number string (e.g. "1,234,567")
 * @returns {number} Parsed number
 */
function parseFormattedNumber(value) {
    return parseInt(value.replace(/,/g, ''), 10);
}    
    
    // Calculate equity or shares based on selected type
    if (AppState.equityType === 'percentage') {
        const maxEquity = validateNumericInput(
            Elements['max-equity'].value,
            CONFIG.validation.equity.min,
            CONFIG.validation.equity.max,
            CONFIG.defaults.maxEquity
        );
        
        const currentEquity = maxEquity * (1 - sliderValue);
        Elements['current-equity'].textContent = formatPercent(currentEquity);
    } else {
        const maxShares = validateNumericInput(
            Elements['max-shares'].value,
            CONFIG.validation.shares.min,
            CONFIG.validation.shares.max,
            CONFIG.defaults.maxShares
        );
        
        const currentShares = Math.round(maxShares * (1 - sliderValue));
        Elements['current-shares'].textContent = formatNumber(currentShares);
    }
}

/**
 * Generate a share link for the offer
 */
function generateShareLink() {
    // Collect and validate all form data
    const formData = collectFormData();
    if (!formData) return; // Validation failed
    
    // Create the URL with parameters
    const currentUrl = window.location.href.split('?')[0]; // Remove any existing query params
    const shareUrl = buildShareUrl(currentUrl, formData);
    
    // Display the share link
    Elements['share-link'].textContent = shareUrl;
    Elements['share-link'].parentElement.style.display = 'block';
    
    // Store values globally for email sending
    AppState.offerDetails = {
        ...formData,
        shareUrl,
        formattedMaxSalary: formatCurrency(formData.maxSalary),
        formattedMaxEquity: AppState.equityType === 'percentage' ? formatPercent(formData.maxEquity) : formatNumber(formData.maxShares)
    };
    
    // Prepare complete details for copying
    prepareOfferSummary(formData, shareUrl);
    
    // Show email sending controls
    Elements['email-sending-controls'].style.display = 'block';
    
    // Setup email sending
    setupEmailSending();
    
    // Show manual sending instructions as a fallback
    displayManualEmailInstructions();
}

/**
 * Collect all form data and validate
 * @returns {Object|null} Form data object or null if validation fails
 */
function collectFormData() {
    const data = {
        companyName: Elements['company-name'].value.trim(),
        senderName: Elements['sender-name'].value.trim(),
        employerEmail: Elements['employer-email'].value.trim(),
        offerDate: Elements['offer-date'].value,
        positionTitle: Elements['position-title'].value.trim(),
        employeeName: Elements['employee-name'].value.trim(),
        employeeEmail: Elements['employee-email'].value.trim(),
        maxSalary: validateNumericInput(
            Elements['max-salary'].value,
            CONFIG.validation.salary.min,
            CONFIG.validation.salary.max,
            CONFIG.defaults.maxSalary
        ),
        equityType: AppState.equityType,
        sliderPosition: Elements['salary-slider'].value
    };
    
    // Add either maxEquity or maxShares based on equityType
    if (AppState.equityType === 'percentage') {
        data.maxEquity = validateNumericInput(
            Elements['max-equity'].value,
            CONFIG.validation.equity.min,
            CONFIG.validation.equity.max,
            CONFIG.defaults.maxEquity
        );
    } else {
        data.maxShares = validateNumericInput(
            Elements['max-shares'].value,
            CONFIG.validation.shares.min,
            CONFIG.validation.shares.max,
            CONFIG.defaults.maxShares
        );
    }
    
    // Validate required fields
    const validationChecks = [
        { field: 'companyName', message: 'Please enter the company name.' },
        { field: 'senderName', message: 'Please enter your name.' },
        { field: 'employerEmail', message: 'Please enter your email address for notifications.' },
        { field: 'offerDate', message: 'Please enter the offer date.' },
        { field: 'positionTitle', message: 'Please enter the position under offer.' },
        { field: 'employeeName', message: 'Please enter an offeree name before generating a share link.' },
        { field: 'employeeEmail', message: 'Please enter an offeree email address.' }
    ];
    
    for (const check of validationChecks) {
        if (!data[check.field]) {
            showError(check.message);
            const element = document.getElementById(toKebabCase(check.field));
            if (element) element.focus();
            return null;
        }
    }
    
    // Validate email formats
    if (!isValidEmail(data.employeeEmail)) {
        showError('Please enter a valid offeree email address.');
        Elements['employee-email'].focus();
        return null;
    }
    
    if (!isValidEmail(data.employerEmail)) {
        showError('Please enter a valid email address for notifications.');
        Elements['employer-email'].focus();
        return null;
    }
    
    return data;
}

/**
 * Build the share URL from form data
 * @param {string} baseUrl - Base URL without parameters
 * @param {Object} data - Form data
 * @returns {string} Complete share URL
 */
function buildShareUrl(baseUrl, data) {
    const params = new URLSearchParams();
    params.append('company', data.companyName);
    params.append('position', data.positionTitle);
    params.append('date', data.offerDate);
    params.append('name', data.employeeName);
    params.append('maxSalary', data.maxSalary);
    params.append('equityType', data.equityType);
    
    if (data.equityType === 'percentage') {
        params.append('maxEquity', data.maxEquity);
    } else {
        params.append('maxShares', data.maxShares);
    }
    
    params.append('sliderpos', data.sliderPosition);
    params.append('email', data.employerEmail);
    params.append('sender', data.senderName);
    
    return `${baseUrl}?${params.toString()}`;
}

/**
 * Prepare a summary of the offer details
 * @param {Object} data - Form data
 * @param {string} shareUrl - Generated share URL
 */
function prepareOfferSummary(data, shareUrl) {
    // Calculate current values for summary
    const sliderValue = parseInt(data.sliderPosition) / 100;
    const currentSalary = data.maxSalary * sliderValue;
    
    let equityDetails = '';
    if (data.equityType === 'percentage') {
        const currentEquity = data.maxEquity * (1 - sliderValue);
        equityDetails = `Maximum Equity: ${formatPercent(data.maxEquity)}
Current Selection:
- Salary: ${formatCurrency(currentSalary)}
- Equity: ${formatPercent(currentEquity)}`;
    } else {
        const currentShares = Math.round(data.maxShares * (1 - sliderValue));
        equityDetails = `Maximum Shares: ${formatNumber(data.maxShares)}
Current Selection:
- Salary: ${formatCurrency(currentSalary)}
- Shares: ${formatNumber(currentShares)}`;
    }
    
    const allDetailsText = `CompMax Compensation Offer Details
----------------------------------------
Company: ${data.companyName}
Your Name: ${data.senderName}
Your Email: ${data.employerEmail}
Offer Date: ${data.offerDate}
Position under Offer: ${data.positionTitle}

Offeree: ${data.employeeName}
Offeree Email: ${data.employeeEmail}

Maximum Salary: ${formatCurrency(data.maxSalary)}
${equityDetails}

Link to Share: ${shareUrl}
----------------------------------------
© MXX1Holdings Pty Ltd
`;
    
    Elements['all-details'].value = allDetailsText;
    Elements['all-details'].style.display = 'block';
}

/**
 * Set up email sending functionality
 */
function setupEmailSending() {
    const sendEmailButton = Elements['send-email-button'];
    
    // Remove existing event listeners to avoid duplicates
    const newButton = sendEmailButton.cloneNode(true);
    sendEmailButton.parentNode.replaceChild(newButton, sendEmailButton);
    Elements['send-email-button'] = newButton;
    
    // Add click event listener
    Elements['send-email-button'].addEventListener('click', sendOfferEmail);
}

/**
 * Send offer email to employee
 */
function sendOfferEmail() {
    const details = AppState.offerDetails;
    if (!details) {
        showError('Error: Offer details not found.');
        return;
    }
    
    if (!details.senderName) {
        showError('Please enter your name as the sender.');
        Elements['sender-name'].focus();
        return;
    }
    
    // Show sending status
    Elements['email-status'].style.display = 'block';
    Elements['sending-status'].textContent = 'Sending email...';
    Elements['sending-status'].style.color = '#666';
    
    // Build email content
    const subject = `Your Compensation Offer from ${details.companyName} for ${details.positionTitle} Position`;
    const body = createOfferEmailBody(details);
    
    // Prepare template parameters for EmailJS
    const templateParams = {
        to_name: details.employeeName,
        to_email: details.employeeEmail,
        subject: subject,
        message: body,
        from_name: details.senderName,
        reply_to: details.employerEmail,
        time: new Date().toLocaleString()
    };
    
    sendEmail(
        templateParams,
        Elements['sending-status'],
        Elements['send-email-button'],
        'Email sent successfully!',
        'Email Sent ✓'
    );
}

/**
 * Create email body for the offer
 * @param {Object} details - Offer details
 * @returns {string} Email body
 */
function createOfferEmailBody(details) {
    let equityText = '';
    if (details.equityType === 'percentage') {
        equityText = `- Maximum Equity: ${details.formattedMaxEquity}`;
    } else {
        equityText = `- Maximum Shares: ${details.formattedMaxEquity}`;
    }
    
    return `Hello ${details.employeeName},

You've received a compensation offer from ${details.companyName} for the ${details.positionTitle} position as of ${details.offerDate} with the following parameters:

- Maximum Salary: ${details.formattedMaxSalary}
${equityText}

Please use the link below to choose your preferred combination of salary and equity:
${details.shareUrl}

Once you have made your selection and submitted your response, formal contracts will be sent accordingly.

Yours sincerely,
${details.senderName}

This message was automatically generated by CompMax.`;
}

/**
 * Display manual email sending instructions
 */
function displayManualEmailInstructions() {
    const details = AppState.offerDetails;
    if (!details) return;
    
    // Build email content
    const subject = `Your Compensation Offer from ${details.companyName} for ${details.positionTitle} Position`;
    const body = createOfferEmailBody(details);
    
    // Display the email address and subject
    Elements['employee-email-display'].textContent = details.employeeEmail;
    Elements['offer-subject-display'].textContent = subject;
    
    // Set the email content in the textarea
    Elements['offer-email-content'].value = body;
    
    // Setup copy button for email content
    const copyButton = Elements['copy-offer-content'];
    const newCopyButton = copyButton.cloneNode(true);
    copyButton.parentNode.replaceChild(newCopyButton, copyButton);
    Elements['copy-offer-content'] = newCopyButton;
    
    Elements['copy-offer-content'].addEventListener('click', function() {
        copyTextToClipboard(
            Elements['offer-email-content'], 
            this, 
            'Copy Email Content', 
            'Copied!'
        );
    });
    
    // Show the link status message
    Elements['link-status-message'].style.display = 'block';
}

/**
 * Handle the offer acceptance process
 */
function sendOfferToEmployer() {
    // Collect data from the form
    const companyName = Elements['company-name'].value;
    const positionTitle = Elements['position-title'].value;
    const offerDate = Elements['offer-date'].value;
    const employeeName = Elements['employee-name'].value;
    const maxSalary = validateNumericInput(
        Elements['max-salary'].value,
        CONFIG.validation.salary.min,
        CONFIG.validation.salary.max,
        CONFIG.defaults.maxSalary
    );
    
    // Get slider value
    const sliderValue = parseInt(Elements['salary-slider'].value) / 100;
    
    // Calculate final salary
    const selectedSalary = maxSalary * sliderValue;
    const formattedSalary = formatCurrency(selectedSalary);
    
    // Handle equity or shares based on type
    let maxEquityValue, selectedEquityValue, formattedEquityValue, equityType;
    
    if (AppState.equityType === 'percentage') {
        maxEquityValue = validateNumericInput(
            Elements['max-equity'].value,
            CONFIG.validation.equity.min,
            CONFIG.validation.equity.max,
            CONFIG.defaults.maxEquity
        );
        selectedEquityValue = maxEquityValue * (1 - sliderValue);
        formattedEquityValue = formatPercent(selectedEquityValue);
        equityType = 'equity';
    } else {
        maxEquityValue = validateNumericInput(
            Elements['max-shares'].value,
            CONFIG.validation.shares.min,
            CONFIG.validation.shares.max,
            CONFIG.defaults.maxShares
        );
        selectedEquityValue = Math.round(maxEquityValue * (1 - sliderValue));
        formattedEquityValue = formatNumber(selectedEquityValue);
        equityType = 'shares';
    }
    
    // Create email subject and body
    const subject = `${employeeName} has accepted the compensation offer for ${positionTitle}`;
    const body = createAcceptanceEmailBody(
        AppState.senderName,
        employeeName,
        positionTitle,
        companyName,
        formattedSalary,
        formattedEquityValue,
        equityType,
        offerDate,
        formatCurrency(maxSalary),
        AppState.equityType === 'percentage' ? formatPercent(maxEquityValue) : formatNumber(maxEquityValue)
    );
    
    // Store for direct email sending
    if (AppState.employerEmail) {
        AppState.acceptanceDetails = {
            companyName,
            positionTitle,
            offerDate,
            employeeName,
            employerEmail: AppState.employerEmail,
            senderName: AppState.senderName,
            maxSalary,
            equityType: AppState.equityType,
            maxEquityValue,
            selectedSalary,
            selectedEquityValue,
            formattedSalary,
            formattedEquityValue,
            subject,
            body
        };
        
        // Pre-populate employee name
        if (Elements['employee-sender-name']) {
            Elements['employee-sender-name'].value = employeeName;
        }
        
        // Show direct email controls
        Elements['acceptance-email-controls'].style.display = 'block';
        
        // Remove existing event listeners to avoid duplicates
        const sendButton = Elements['send-acceptance-email-button'];
        const newSendButton = sendButton.cloneNode(true);
        sendButton.parentNode.replaceChild(newSendButton, sendButton);
        Elements['send-acceptance-email-button'] = newSendButton;
        
        Elements['send-acceptance-email-button'].addEventListener('click', sendAcceptanceEmail);
        
        // Hide the accept offer button
        Elements['accept-offer-button'].style.display = 'none';
        
        // Show acceptance message with the email content
        Elements['offer-accepted-message'].style.display = 'block';
        
        // Display the employer email and subject
        Elements['employer-email-display'].textContent = AppState.employerEmail;
        Elements['acceptance-subject-display'].textContent = subject;
        
        // Set the email content in the textarea
        Elements['acceptance-email-content'].value = body;
        
        // Setup copy button for acceptance email content
        const copyButton = Elements['copy-acceptance-content'];
        const newCopyButton = copyButton.cloneNode(true);
        copyButton.parentNode.replaceChild(newCopyButton, copyButton);
        Elements['copy-acceptance-content'] = newCopyButton;
        
        Elements['copy-acceptance-content'].addEventListener('click', function() {
            copyTextToClipboard(
                Elements['acceptance-email-content'], 
                this, 
                'Copy Email Content', 
                'Copied!'
            );
        });
    } else {
        showError('Cannot send acceptance notification: Employer email not found.');
    }
}

/**
 * Create the body for the acceptance email
 */
function createAcceptanceEmailBody(senderName, employeeName, positionTitle, companyName, 
                               formattedSalary, formattedEquityValue, equityType, offerDate, 
                               formattedMaxSalary, formattedMaxEquityValue) {
    const equityLabel = equityType === 'equity' ? 'Equity' : 'Shares';
    const maxEquityLabel = equityType === 'equity' ? 'maximum equity' : 'maximum number of shares';
    
    return `Hello ${senderName},

${employeeName} has accepted the following compensation package for the ${positionTitle} position at ${companyName}:

- Salary: ${formattedSalary}
- ${equityLabel}: ${formattedEquityValue}

This is based on the offer dated ${offerDate} with maximum salary of ${formattedMaxSalary} and ${maxEquityLabel} of ${formattedMaxEquityValue}.

Please prepare the formal contracts accordingly.

Yours sincerely,
${employeeName}

This message was automatically generated by CompMax by MXX1Holdings Pty Ltd.`;
}

/**
 * Send the acceptance email
 */
function sendAcceptanceEmail() {
    const details = AppState.acceptanceDetails;
    if (!details) {
        showError('Error: Acceptance details not found.');
        return;
    }
    
    const offereeNameSending = Elements['employee-sender-name'].value.trim();
    if (!offereeNameSending) {
        showError('Please enter your name.');
        Elements['employee-sender-name'].focus();
        return;
    }
    
    // Show sending status
    Elements['acceptance-email-status'].style.display = 'block';
    Elements['acceptance-sending-status'].textContent = 'Sending email...';
    Elements['acceptance-sending-status'].style.color = '#666';
    
    // Prepare template parameters for EmailJS
    const templateParams = {
        to_name: details.senderName,
        to_email: details.employerEmail,
        subject: details.subject,
        time: new Date().toLocaleString(),
        message: details.body,
        from_name: offereeNameSending,
        reply_to: '' // No reply-to for acceptance emails
    };
    
    sendEmail(
        templateParams,
        Elements['acceptance-sending-status'],
        Elements['send-acceptance-email-button'],
        'Acceptance email sent successfully!',
        'Email Sent ✓'
    );
}

/**
 * Send email using EmailJS
 * @param {Object} params - Email parameters
 * @param {HTMLElement} statusElement - Status display element
 * @param {HTMLElement} buttonElement - Button element to update
 * @param {string} successMessage - Message to show on success
 * @param {string} successButtonText - Button text to show on success
 */
function sendEmail(params, statusElement, buttonElement, successMessage, successButtonText) {
    // Check if EmailJS is available
    if (typeof emailjs !== 'undefined' && window.emailJsLoaded) {
        // Send email using EmailJS
        emailjs.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, params)
            .then(function(response) {
                console.log('Email sent successfully:', response.status, response.text);
                statusElement.textContent = successMessage;
                statusElement.style.color = 'var(--success)';
                buttonElement.disabled = true;
                buttonElement.textContent = successButtonText;
            })
            .catch(function(error) {
                console.error('Email sending failed:', error);
                statusElement.textContent = 'Failed to send email. Please use the manual method below.';
                statusElement.style.color = 'var(--danger)';
                
                // Show detailed error in console but a user-friendly message in UI
                showError('Could not send email automatically. Please use the manual method instead.');
            });
    } else {
        // EmailJS not available
        statusElement.textContent = 'Email service unavailable. Please use the manual method below.';
        statusElement.style.color = 'var(--danger)';
        showError('Email service is not available. Please use the manual email method.');
    }
}

/**
 * Copy share link to clipboard
 */
function copyShareLink() {
    // Instead of copying just the link, copy all the details
    copyTextToClipboard(
        Elements['all-details'], 
        Elements['copy-link'], 
        'Copy All Details', 
        'Copied All Details!'
    );
}

/**
 * Copy text to clipboard
 * @param {HTMLElement} textElement - Element containing text to copy
 * @param {HTMLElement} buttonElement - Button that was clicked
 * @param {string} originalText - Original button text
 * @param {string} successText - Text to show after successful copy
 */
function copyTextToClipboard(textElement, buttonElement, originalText = null, successText = null) {
    const originalButtonText = originalText || buttonElement.textContent;
    const copySuccessText = successText || 'Copied!';
    
    try {
        if (navigator.clipboard && window.isSecureContext) {
            // Use modern Clipboard API if available
            navigator.clipboard.writeText(textElement.value)
                .then(() => {
                    // Update button text to indicate success
                    buttonElement.textContent = copySuccessText;
                    setTimeout(() => {
                        buttonElement.textContent = originalButtonText;
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy using Clipboard API:', err);
                    // Fallback to selection method
                    copyWithSelection();
                });
        } else {
            // Fallback for browsers without Clipboard API
            copyWithSelection();
        }
    } catch (err) {
        console.error('Copy failed:', err);
        showError('Unable to copy automatically. Please select the text and use Ctrl+C / Cmd+C to copy.');
    }
    
    function copyWithSelection() {
        // Select the text
        textElement.select();
        textElement.setSelectionRange(0, 99999); // For mobile devices
        
        try {
            // Try to copy using document.execCommand
            const successful = document.execCommand('copy');
            
            if (successful) {
                buttonElement.textContent = copySuccessText;
                setTimeout(() => {
                    buttonElement.textContent = originalButtonText;
                }, 2000);
            } else {
                // Manual selection fallback
                showError('Please press Ctrl+C (or Cmd+C on Mac) to copy the selected text.');
            }
        } catch (err) {
            console.error('Could not copy text:', err);
            showError('Please select all text manually and press Ctrl+C (or Cmd+C on Mac) to copy.');
        }
    }
}

/**
 * Show error message in modal
 * @param {string} message - Error message to display
 */
function showError(message) {
    Elements['error-message'].textContent = message;
    Elements['error-modal'].style.display = 'flex';
}

/**
 * Close the error modal
 */
function closeErrorModal() {
    Elements['error-modal'].style.display = 'none';
}

/**
 * Format a number as currency
 * @param {number} value - Number to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(value) {
    return '$' + value.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

/**
 * Format a number as percentage
 * @param {number} value - Number to format
 * @returns {string} Formatted percentage string
 */
function formatPercent(value) {
    return value.toFixed(2) + '%';
}

/**
 * Format a number with commas
 * @param {number} value - Number to format
 * @returns {string} Formatted number string
 */
function formatNumber(value) {
    return value.toLocaleString('en-US');
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email format is valid
 */
function isValidEmail(email) {
    // RFC 5322 compliant email regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return emailRegex.test(email);
}

/**
 * Safely parse float with validation
 * @param {string} value - Value to parse
 * @param {number} defaultValue - Default value if parsing fails
 * @returns {number} Parsed float or default value
 */
function safeParseFloat(value, defaultValue) {
    if (!value) return defaultValue;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Safely parse integer with validation
 * @param {string} value - Value to parse
 * @param {number} defaultValue - Default value if parsing fails
 * @returns {number} Parsed integer or default value
 */
function safeParseInt(value, defaultValue) {
    if (!value) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Validate numeric input with range constraints
 * @param {string|number} value - Value to validate
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @param {number} defaultValue - Default value if validation fails
 * @returns {number} Validated number
 */
function validateNumericInput(value, min, max, defaultValue) {
    const parsed = parseFloat(value);
    if (isNaN(parsed) || parsed < min || parsed > max) {
        return defaultValue;
    }
    return parsed;
}

/**
 * Convert camelCase to kebab-case for HTML IDs
 * @param {string} str - CamelCase string
 * @returns {string} Kebab-case string
 */
function toKebabCase(str) {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

// Initialize the application when the DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
