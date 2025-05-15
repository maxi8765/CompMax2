/**
 * Salary Formatter Script
 * This script formats the salary field with commas without interfering with other app functionality
 */

(function() {
    // Format number with commas
    function formatWithCommas(value) {
        if (!value) return '';
        // Remove any non-digit characters
        const rawValue = value.toString().replace(/[^\d]/g, '');
        if (!rawValue) return '';
        // Format with commas
        return parseInt(rawValue, 10).toLocaleString('en-US');
    }
    
    // Main function to setup the salary field formatting
    function initSalaryFormat() {
        const salaryField = document.getElementById('max-salary');
        if (!salaryField) return;
        
        // Format on page load if the field is not empty and not already formatted
        if (salaryField.value && !salaryField.disabled && !salaryField.value.includes(',')) {
            salaryField.value = formatWithCommas(salaryField.value);
            // Trigger calculation after initial formatting
            if (typeof window.calculateCompensation === 'function') {
                window.calculateCompensation();
            }
        }
        
        // Format as user types
        salaryField.addEventListener('input', function(event) {
            if (salaryField.disabled) return;
            
            // Save cursor position
            const cursorPos = salaryField.selectionStart;
            const valueBeforeCursor = salaryField.value.substring(0, cursorPos);
            const digitsBeforeCursor = valueBeforeCursor.replace(/[^\d]/g, '').length;
            
            // Get raw value and format
            const rawValue = salaryField.value.replace(/[^\d]/g, '');
            
            if (rawValue) {
                // Format the value
                const formattedValue = formatWithCommas(rawValue);
                salaryField.value = formattedValue;
                
                // Calculate new cursor position
                const newValue = salaryField.value;
                let newPos = 0;
                let digitCount = 0;
                
                // Find position that matches the number of digits before the old cursor
                for (let i = 0; i < newValue.length; i++) {
                    if (/\d/.test(newValue[i])) {
                        digitCount++;
                    }
                    if (digitCount > digitsBeforeCursor) break;
                    newPos = i + 1;
                }
                
                // Set the cursor position
                salaryField.setSelectionRange(newPos, newPos);
            }
            
            // Trigger calculation after formatting
            if (typeof window.calculateCompensation === 'function') {
                window.calculateCompensation();
            }
        });
        
        // Ensure value is formatted when field loses focus
        salaryField.addEventListener('blur', function() {
            if (!salaryField.disabled && salaryField.value && !salaryField.value.includes(',')) {
                salaryField.value = formatWithCommas(salaryField.value);
                // Trigger calculation after blur formatting
                if (typeof window.calculateCompensation === 'function') {
                    window.calculateCompensation();
                }
            }
        });
        
        // Check again after a short delay to ensure the field has a value
        setTimeout(function() {
            if (!salaryField.disabled && (!salaryField.value || !salaryField.value.includes(','))) {
                salaryField.value = formatWithCommas(salaryField.value || '150000');
                // Trigger calculation after delayed formatting
                if (typeof window.calculateCompensation === 'function') {
                    window.calculateCompensation();
                }
            }
        }, 200);
    }
    
    // Run initialization when DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initSalaryFormat);
    } else {
        initSalaryFormat();
    }
})();
