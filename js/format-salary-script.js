/**
 * Salary Formatter Script
 * This script formats the salary field with commas without interfering with other app functionality
 */

(function() {
    // Function to format a number with commas
    function formatWithCommas(value) {
        // Remove any existing commas and non-digits
        const rawValue = value.toString().replace(/[^\d]/g, '');
        if (!rawValue) return '';
        return parseInt(rawValue).toLocaleString('en-US');
    }
    
    // Function to format the max salary field
    function formatMaxSalaryField() {
        const salaryField = document.getElementById('max-salary');
        if (!salaryField) return;
        
        // Only format if not in employee view (where field is disabled)
        if (!salaryField.disabled) {
            // Save cursor position relative to the end
            const cursorFromEnd = salaryField.value.length - salaryField.selectionStart;
            
            // Format the value
            const currentVal = salaryField.value;
            salaryField.value = formatWithCommas(currentVal);
            
            // Restore cursor position
            try {
                const newCursorPos = Math.max(0, salaryField.value.length - cursorFromEnd);
                salaryField.setSelectionRange(newCursorPos, newCursorPos);
            } catch (e) {
                // Ignore errors with cursor positioning
            }
        }
    }
    
    // Function to run on page load
    function initSalaryFormat() {
        const salaryField = document.getElementById('max-salary');
        if (!salaryField) return;
        
        // Format on load
        const originalValue = salaryField.value;
        salaryField.value = formatWithCommas(originalValue);
        
        // Add event listener to format on input
        salaryField.addEventListener('input', formatMaxSalaryField);
        
        // Make sure we don't lose formatting on blur
        salaryField.addEventListener('blur', function() {
            if (salaryField.value && !salaryField.value.includes(',')) {
                salaryField.value = formatWithCommas(salaryField.value);
            }
        });
    }
    
    // Run when DOM is loaded
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initSalaryFormat);
    } else {
        // DOM already loaded
        initSalaryFormat();
    }
})();