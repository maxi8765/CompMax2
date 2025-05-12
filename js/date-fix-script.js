/**
 * Date Fixer Script
 * Ensures the offer date is set to today's date
 */

(function() {
    // Function to set today's date in the date field
    function setTodayDate() {
        const dateField = document.getElementById('offer-date');
        if (!dateField) return;
        
        // Only set the date if the field is not disabled (not in employee view)
        if (!dateField.disabled) {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
            const dd = String(today.getDate()).padStart(2, '0');
            const formattedToday = `${yyyy}-${mm}-${dd}`;
            
            // Set the date
            dateField.value = formattedToday;
        }
    }
    
    // Run when DOM is loaded
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function() {
            // Slight delay to make sure other scripts have run
            setTimeout(setTodayDate, 100);
        });
    } else {
        // DOM already loaded, use timeout to ensure it runs after other scripts
        setTimeout(setTodayDate, 100);
    }
})();