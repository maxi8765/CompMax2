/**
 * Info Icons Manager
 * Manages the help tooltip icons throughout the application
 */

// First IIFE: Label formatting to prevent icon overlap
(function() {
    // This function runs before the icon setup to adjust the labels
    function setupLabelFormatting() {
        // Find all labels
        const labels = document.querySelectorAll('label');
        
        // Process each label
        labels.forEach(label => {
            // Skip labels that have already been processed
            if (label.classList.contains('label-formatted')) return;
            
            // Add class to mark as processed
            label.classList.add('label-formatted');
            
            // Create a span to wrap the label text
            const labelText = label.textContent.trim();
            
            // Only if there is text to process
            if (labelText) {
                // Clear the current text
                label.textContent = '';
                
                // Create text wrapper
                const textSpan = document.createElement('span');
                textSpan.className = 'label-text';
                textSpan.textContent = labelText;
                
                // Add the text back in a span
                label.appendChild(textSpan);
            }
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setupLabelFormatting();
        });
    } else {
        setupLabelFormatting();
    }
})();

// Second IIFE: Info icons functionality
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
    
    // Create overlay for mobile tooltips (once)
    let tooltipOverlay;
    
    // Keep track of active tooltip for mobile
    let activeTooltip = null;
    
    // Function to add info icons to all elements
    function addInfoIcons() {
        // Detect if we're on a mobile device
        const isMobile = window.matchMedia("(max-width: 600px)").matches;
        
        // Create a modal backdrop for mobile tooltips
        if (isMobile && !tooltipOverlay) {
            tooltipOverlay = document.createElement('div');
            tooltipOverlay.className = 'tooltip-overlay';
            document.body.appendChild(tooltipOverlay);
            
            // Close tooltip when clicking the overlay
            tooltipOverlay.addEventListener('click', function(e) {
                if (e) e.preventDefault(); // Prevent default touch behavior
                if (activeTooltip) {
                    closeTooltip(activeTooltip);
                }
            });
        }
        
        // Loop through all elements that need icons
        Object.keys(tooltipContent).forEach(function(elementId) {
            const element = document.getElementById(elementId);
            if (!element) return; // Skip if element doesn't exist
            
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
            
            if (!labelElement) return; // Skip if no label found
            
            // Create the icon container
            const iconContainer = document.createElement('span');
            iconContainer.className = 'info-icon-container';
            iconContainer.setAttribute('data-for', elementId);
            
            // Create the info icon
            const infoIcon = document.createElement('span');
            infoIcon.className = 'info-icon';
            infoIcon.setAttribute('tabindex', '0');
            infoIcon.setAttribute('role', 'button');
            infoIcon.setAttribute('aria-label', `Help for ${labelElement.textContent.trim()}`);
            infoIcon.innerHTML = 'i';
            
            // Create the tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.innerHTML = tooltipContent[elementId];
            tooltip.setAttribute('aria-hidden', 'true');
            
            // Add a close button for mobile
            if (isMobile) {
                const closeButton = document.createElement('button');
                closeButton.textContent = '✕';
                closeButton.className = 'tooltip-close';
                closeButton.setAttribute('aria-label', 'Close tooltip');
                tooltip.appendChild(closeButton);
                
                // Close tooltip when clicking the close button
                closeButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    closeTooltip(tooltip);
                });
                
                // Make close button visible on mobile
                closeButton.style.display = 'block';
            }
            
            // Check position to adjust tooltip placement
            const rect = element.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            
            if (!isMobile) {
                if (rect.right > windowWidth * 0.75) {
                    tooltip.classList.add('tooltip-left');
                } else if (rect.left < windowWidth * 0.25) {
                    tooltip.classList.add('tooltip-right');
                }
            }
            
            // Handle tooltip visibility
            if (isMobile) {
                // Mobile: toggle on touch/click
                // Add multiple event types for better mobile support
                ['click', 'touchstart'].forEach(eventType => {
                    infoIcon.addEventListener(eventType, function(e) {
                        e.stopPropagation();
                        e.preventDefault(); // Prevent default touch behavior
                        
                        // Close any other open tooltips
                        if (activeTooltip && activeTooltip !== tooltip) {
                            closeTooltip(activeTooltip);
                        }
                        
                        // Toggle this tooltip
                        if (tooltip.style.visibility === 'visible') {
                            closeTooltip(tooltip);
                        } else {
                            openTooltip(tooltip);
                        }
                    });
                });
                
                // Prevent touch events inside tooltip from closing it
                tooltip.addEventListener('click', function(e) {
                    e.stopPropagation();
                });
            } else {
                // Desktop: show on hover
                infoIcon.addEventListener('mouseenter', function() {
                    tooltip.style.visibility = 'visible';
                    tooltip.style.opacity = '1';
                    tooltip.setAttribute('aria-hidden', 'false');
                });
                
                infoIcon.addEventListener('mouseleave', function() {
                    tooltip.style.visibility = 'hidden';
                    tooltip.style.opacity = '0';
                    tooltip.setAttribute('aria-hidden', 'true');
                });
                
                // Keep tooltip visible when hovering over it
                tooltip.addEventListener('mouseenter', function() {
                    tooltip.style.visibility = 'visible';
                    tooltip.style.opacity = '1';
                    tooltip.setAttribute('aria-hidden', 'false');
                });
                
                tooltip.addEventListener('mouseleave', function() {
                    tooltip.style.visibility = 'hidden';
                    tooltip.style.opacity = '0';
                    tooltip.setAttribute('aria-hidden', 'true');
                });
            }
            
            // Keyboard support
            infoIcon.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    
                    if (isMobile) {
                        // Mobile behavior (toggle)
                        if (tooltip.style.visibility === 'visible') {
                            closeTooltip(tooltip);
                        } else {
                            openTooltip(tooltip);
                        }
                    } else {
                        // Desktop behavior (toggle)
                        if (tooltip.style.visibility === 'visible') {
                            tooltip.style.visibility = 'hidden';
                            tooltip.style.opacity = '0';
                            tooltip.setAttribute('aria-hidden', 'true');
                        } else {
                            tooltip.style.visibility = 'visible';
                            tooltip.style.opacity = '1';
                            tooltip.setAttribute('aria-hidden', 'false');
                        }
                    }
                } else if (e.key === 'Escape' && tooltip.style.visibility === 'visible') {
                    closeTooltip(tooltip);
                }
            });
            
            // Lose focus closes tooltip
            infoIcon.addEventListener('blur', function() {
                if (!isMobile) {
                    setTimeout(function() {
                        tooltip.style.visibility = 'hidden';
                        tooltip.style.opacity = '0';
                        tooltip.setAttribute('aria-hidden', 'true');
                    }, 200);
                }
            });
            
            // Assemble and attach to DOM
            iconContainer.appendChild(infoIcon);
            iconContainer.appendChild(tooltip);
            labelElement.appendChild(iconContainer);
        });
        
        // Close tooltips when clicking anywhere else
        if (isMobile) {
            document.addEventListener('click', function(e) {
                if (activeTooltip) {
                    const container = e.target.closest('.info-icon-container');
                    if (!container) {
                        closeTooltip(activeTooltip);
                    }
                }
            });
        }
    }
    
    // Helper function to open tooltip (mobile)
    function openTooltip(tooltip) {
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
        tooltip.setAttribute('aria-hidden', 'false');
        
        if (tooltipOverlay) {
            tooltipOverlay.style.display = 'block';
        }
        
        activeTooltip = tooltip;
    }
    
    // Helper function to close tooltip (mobile)
    function closeTooltip(tooltip) {
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '0';
        tooltip.setAttribute('aria-hidden', 'true');
        
        if (tooltipOverlay) {
            tooltipOverlay.style.display = 'none';
        }
        
        activeTooltip = null;
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(addInfoIcons, 300); // Slight delay to ensure all elements are ready
        });
    } else {
        setTimeout(addInfoIcons, 300);
    }
})();
