/**
 * CompMax - Salary & Equity Compensation Calculator
 * Email Fix
 */

// This script fixes the email functionality without affecting real-time updates
document.addEventListener('DOMContentLoaded', function() {
    // Wait for the app to initialize
    setTimeout(function() {
        // Restore email functionality
        if (typeof emailjs !== 'undefined' && window.CONFIG) {
            // Reinitialize EmailJS
            try {
                emailjs.init(CONFIG.emailjs.publicKey);
                console.log("EmailJS reinitialized successfully");
                window.emailJsLoaded = true;
            } catch (error) {
                console.error("EmailJS reinitialization error:", error);
            }
            
            // Fix send email button if it exists
            const sendEmailButton = document.getElementById('send-email-button');
            if (sendEmailButton) {
                sendEmailButton.onclick = function(e) {
                    e.preventDefault();
                    // Call the original function
                    if (typeof sendOfferEmail === 'function') {
                        sendOfferEmail();
                    }
                };
            }
            
            // Fix acceptance email button if it exists
            const acceptanceEmailButton = document.getElementById('send-acceptance-email-button');
            if (acceptanceEmailButton) {
                acceptanceEmailButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    // Call the original function
                    if (typeof sendAcceptanceEmail === 'function') {
                        sendAcceptanceEmail();
                    }
                });
            }
        }
    }, 1000);
});
