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
        'max-salary': 'The maximum salary amount you are willing to offer. The candidate can choose a lower amount in exchange for more equity.',
        'max-equity': 'The maximum equity percentage you are willing to offer. This will be available to the candidate if they choose a lower salary.',
        'max-shares': 'The maximum number of shares you are willing to offer. This will be available to the candidate if they choose a lower salary.',
        'equity-type-selection': 'Choose whether to offer equity as a percentage of the company or as a specific number of shares.',
        'salary-slider': 'Move the slider to adjust the balance between salary and equity. Moving left increases equity and decreases salary. Moving right increases salary and decreases equity.'
    };
    
    // Create and add info icons to all fields
    function addInfoIcons() {
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
            tooltip.textContent = tooltipContent[elementId];
            
            // Check if we need special positioning for the tooltip
            // For elements in the right half of the form
            const rect = element.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            if (rect.right > windowWidth * 0.75) {
                tooltip.classList.add('tooltip-left');
            } else if (rect.left < windowWidth * 0.25) {
                tooltip.classList.add('tooltip-right');
            }
            
            // Add keyboard support
            infoIcon.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    tooltip.style.visibility = tooltip.style.visibility === 'visible' ? 'hidden' : 'visible';
                    tooltip.style.opacity = tooltip.style.opacity === '1' ? '0' : '1';
                }
            });
            
            // Add blur event to hide tooltip when focus leaves
            infoIcon.addEventListener('blur', function() {
                tooltip.style.visibility = 'hidden';
                tooltip.style.opacity = '0';
            });
            
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
