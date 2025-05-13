/**
 * Info Icons Manager
 * Manages the help tooltip icons throughout the application
 */

(function() {
    // Define tooltip content for each field
    const tooltipContent = {
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
    const isMobile = window.matchMedia("(max-width: 600px)").matches;
    
    // Create and add info icons to all fields
    function addInfoIcons() {
        // Keep track of active tooltip (for mobile)
        let activeTooltip = null;
        
        // For each tooltip in our content object
        Object.keys(tooltipContent).forEach(elementId => {
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
            
            // Create the info icon container
            const iconContainer = document.createElement('span');
            iconContainer.className = 'info-icon-container';
            
            // Create the info icon
            const infoIcon = document.createElement('span');
            infoIcon.className = 'info-icon';
            infoIcon.setAttribute('tabindex', '0');
            infoIcon.setAttribute('role', 'button');
            infoIcon.setAttribute('aria-label', `Help for ${labelElement.textContent.trim()}`);
            infoIcon.innerHTML = 'i';
            
            // Create the tooltip
            const tooltip = document.createElement('span');
            tooltip.className = 'tooltip';
            
            // For mobile, add a close button
            if (isMobile) {
                const tooltipContent = document.createElement('div');
                tooltipContent.innerHTML = tooltipContent[elementId];
                
                const closeButton = document.createElement('button');
                closeButton.textContent = '✕';
                closeButton.style.cssText = 'position:absolute;top:5px;right:5px;background:none;border:none;font-size:16px;cursor:pointer;color:#666;';
                closeButton.setAttribute('aria-label', 'Close tooltip');
                
                closeButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    tooltip.style.visibility = 'hidden';
                    tooltip.style.opacity = '0';
                    activeTooltip = null;
                });
                
                tooltip.appendChild(closeButton);
                tooltip.appendChild(tooltipContent);
            } else {
                // For desktop, just set the HTML content
                tooltip.innerHTML = tooltipContent[elementId];
            }
            
            // Check if we need special positioning for the tooltip
            // For elements in the right half of the form
            const rect = element.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            if (rect.right > windowWidth * 0.75) {
                tooltip.classList.add('tooltip-left');
            } else if (rect.left < windowWidth * 0.25) {
                tooltip.classList.add('tooltip-right');
            }
            
            // On mobile, use click/tap instead of hover
            if (isMobile) {
                infoIcon.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Hide any active tooltip
                    if (activeTooltip && activeTooltip !== tooltip) {
                        activeTooltip.style.visibility = 'hidden';
                        activeTooltip.style.opacity = '0';
                    }
                    
                    // Toggle current tooltip
                    const isVisible = tooltip.style.visibility === 'visible';
                    tooltip.style.visibility = isVisible ? 'hidden' : 'visible';
                    tooltip.style.opacity = isVisible ? '0' : '1';
                    
                    // Update active tooltip reference
                    activeTooltip = isVisible ? null : tooltip;
                });
                
                // Close tooltip when clicking outside
                document.addEventListener('click', function(e) {
                    if (activeTooltip && !activeTooltip.contains(e.target) && e.target !== infoIcon) {
                        activeTooltip.style.visibility = 'hidden';
                        activeTooltip.style.opacity = '0';
                        activeTooltip = null;
                    }
                });
            }
            
            // Add keyboard support for all devices
            infoIcon.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    
                    // For mobile, match click behavior
                    if (isMobile) {
                        // Hide any active tooltip
                        if (activeTooltip && activeTooltip !== tooltip) {
                            activeTooltip.style.visibility = 'hidden';
                            activeTooltip.style.opacity = '0';
                        }
                        
                        // Toggle current tooltip
                        const isVisible = tooltip.style.visibility === 'visible';
                        tooltip.style.visibility = isVisible ? 'hidden' : 'visible';
                        tooltip.style.opacity = isVisible ? '0' : '1';
                        
                        // Update active tooltip reference
                        activeTooltip = isVisible ? null : tooltip;
                    } else {
                        // For desktop, just toggle visibility
                        tooltip.style.visibility = tooltip.style.visibility === 'visible' ? 'hidden' : 'visible';
                        tooltip.style.opacity = tooltip.style.opacity === '1' ? '0' : '1';
                    }
                }
            });
            
            // Add blur event to hide tooltip when focus leaves (desktop only)
            if (!isMobile) {
                infoIcon.addEventListener('blur', function() {
                    tooltip.style.visibility = 'hidden';
                    tooltip.style.opacity = '0';
                });
            }
            
            // Assemble the elements
            iconContainer.appendChild(infoIcon);
            iconContainer.appendChild(tooltip);
            
            // Add the icon container after the label
            labelElement.appendChild(iconContainer);
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