/**
 * Info Icons Manager - Fixed Mobile Version
 * Manages the help tooltip icons throughout the application
 */

(function() {
    // Define tooltip content for each field
    const tooltipData = {
        'company-name': 'Enter your company or organization name as it should appear on the offer.',
        'sender-name': 'Your name as the representative making this offer.',
        'employer-email': 'Your email address for receiving notifications when the offer is accepted.',
        'offer-date': 'The official date of this compensation offer.',
        'position-title': 'The specific role or job title you are offering.',
        'employee-name': "The candidate's full name as it should appear on the formal offer.",
        'employee-email': "The candidate's email address where this offer will be sent.",
        'max-salary': 'The maximum salary amount you are willing to offer. The candidate can choose a lower amount in exchange for more equity. <a href="compensation-resources.html" target="_blank">View startup compensation resources</a>',
        'max-equity': 'The maximum equity percentage you are willing to offer. This will be available to the candidate if they choose a lower salary.',
        'max-shares': 'The maximum number of shares you are willing to offer. This will be available to the candidate if they choose a lower salary.',
        'equity-type-selection': 'Choose whether to offer equity as a percentage of the company or as a specific number of shares.',
        'salary-slider': 'Move the slider to adjust the balance between salary and equity. Moving left increases equity and decreases salary. Moving right increases salary and decreases equity.'
    };
    
    // Check if we're on a mobile device
    const isMobile = window.innerWidth <= 600;
    
    // Global variable to track active tooltip
    let activeTooltip = null;
    let activeIcon = null;
    let tooltipOverlay = null;
    
    // Create and add info icons to all fields
    function addInfoIcons() {
        // Create overlay for mobile (once)
        if (isMobile) {
            tooltipOverlay = document.createElement('div');
            tooltipOverlay.className = 'tooltip-overlay';
            document.body.appendChild(tooltipOverlay);
            
            // Close active tooltip when overlay is clicked
            tooltipOverlay.addEventListener('click', closeActiveTooltip);
        }
        
        // For each tooltip in our content object
        Object.keys(tooltipData).forEach(elementId => {
            const element = document.getElementById(elementId);
            if (!element) return; // Skip if element not found
            
            // Find the label for this element
            let labelElement;
            
            if (elementId === 'equity-type-selection') {
                // Special case for radio buttons
                labelElement = element.querySelector('label');
            } else if (elementId === 'salary-slider') {
                // Special case for slider
                labelElement = element.previousElementSibling;
            } else {
                // Standard input fields
                labelElement = document.querySelector(`label[for="${elementId}"]`);
            }
            
            if (!labelElement) return; // Skip if label not found
            
            // Create the icon and tooltip
            createInfoIcon(elementId, labelElement);
        });
    }
    
    // Create an individual info icon and tooltip
    function createInfoIcon(elementId, labelElement) {
        // Create icon container
        const iconContainer = document.createElement('span');
        iconContainer.className = 'info-icon-container';
        
        // Create info icon
        const infoIcon = document.createElement('span');
        infoIcon.className = 'info-icon';
        infoIcon.setAttribute('tabindex', '0');
        infoIcon.setAttribute('role', 'button');
        infoIcon.setAttribute('aria-label', `Help for ${labelElement.textContent.trim()}`);
        infoIcon.textContent = 'i';
        
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.id = `tooltip-${elementId}`;
        
        // Create tooltip content
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'tooltip-content';
        contentWrapper.innerHTML = tooltipData[elementId];
        tooltip.appendChild(contentWrapper);
        
        // Add close button for mobile
        if (isMobile) {
            const closeButton = document.createElement('button');
            closeButton.className = 'tooltip-close';
            closeButton.textContent = '✕';
            closeButton.setAttribute('aria-label', 'Close tooltip');
            closeButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closeActiveTooltip();
            });
            tooltip.appendChild(closeButton);
        }
        
        // Add event listeners
        setupEventListeners(infoIcon, tooltip);
        
        // Check if we need special positioning for the tooltip
        positionTooltip(tooltip, element);
        
        // Assemble elements
        iconContainer.appendChild(infoIcon);
        iconContainer.appendChild(tooltip);
        
        // Add to DOM
        labelElement.appendChild(iconContainer);
    }
    
    // Set up event listeners based on device type
    function setupEventListeners(icon, tooltip) {
        if (isMobile) {
            // Mobile - use click/tap
            icon.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleTooltip(tooltip, icon);
            });
            
            // Make sure links in tooltips work on mobile
            tooltip.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        } else {
            // Desktop - use hover and focus
            icon.addEventListener('mouseenter', function() {
                showTooltip(tooltip);
            });
            
            icon.addEventListener('mouseleave', function() {
                hideTooltip(tooltip);
            });
            
            tooltip.addEventListener('mouseenter', function() {
                showTooltip(tooltip);
            });
            
            tooltip.addEventListener('mouseleave', function() {
                hideTooltip(tooltip);
            });
        }
        
        // Keyboard support for all devices
        icon.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (isMobile) {
                    toggleTooltip(tooltip, icon);
                } else {
                    if (tooltip.style.visibility === 'visible') {
                        hideTooltip(tooltip);
                    } else {
                        showTooltip(tooltip);
                    }
                }
            } else if (e.key === 'Escape' && tooltip.style.visibility === 'visible') {
                hideTooltip(tooltip);
            }
        });
        
        // Add blur handler for desktop
        if (!isMobile) {
            icon.addEventListener('blur', function() {
                setTimeout(() => {
                    if (!tooltip.contains(document.activeElement)) {
                        hideTooltip(tooltip);
                    }
                }, 10);
            });
        }
    }
    
    // Calculate tooltip position
    function positionTooltip(tooltip, element) {
        if (!element || isMobile) return; // Skip for mobile
        
        const rect = element.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        
        if (rect.right > windowWidth * 0.75) {
            tooltip.classList.add('tooltip-left');
        } else if (rect.left < windowWidth * 0.25) {
            tooltip.classList.add('tooltip-right');
        }
    }
    
    // Toggle tooltip visibility on mobile
    function toggleTooltip(tooltip, icon) {
        if (activeTooltip === tooltip) {
            // If clicking the same icon, close the tooltip
            closeActiveTooltip();
        } else {
            // Close any active tooltip
            closeActiveTooltip();
            
            // Show this tooltip
            showTooltip(tooltip);
            activeTooltip = tooltip;
            activeIcon = icon;
            
            // Show overlay
            if (isMobile && tooltipOverlay) {
                tooltipOverlay.classList.add('visible');
            }
        }
    }
    
    // Show tooltip
    function showTooltip(tooltip) {
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
        tooltip.classList.add('visible');
    }
    
    // Hide tooltip
    function hideTooltip(tooltip) {
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '0';
        tooltip.classList.remove('visible');
    }
    
    // Close the active tooltip
    function closeActiveTooltip() {
        if (activeTooltip) {
            hideTooltip(activeTooltip);
            activeTooltip = null;
            activeIcon = null;
            
            // Hide overlay
            if (isMobile && tooltipOverlay) {
                tooltipOverlay.classList.remove('visible');
            }
        }
    }
    
    // Close tooltips when clicking outside (mobile)
    if (isMobile) {
        document.addEventListener('click', function(e) {
            if (activeTooltip && !activeTooltip.contains(e.target) && activeIcon !== e.target) {
                closeActiveTooltip();
            }
        });
    }
    
    // Run when DOM is fully loaded
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function() {
            // Short delay to ensure all other scripts have run
            setTimeout(addInfoIcons, 200);
        });
    } else {
        // DOM already loaded
        setTimeout(addInfoIcons, 200);
    }
})();