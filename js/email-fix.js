/**
 * EmailJS Troubleshooting Fix
 * Focuses on fixing EmailJS without changing your existing GitHub secrets setup
 */

document.addEventListener('DOMContentLoaded', function() {
    // Wait a moment for other scripts to load
    setTimeout(function() {
        console.log("Email troubleshooting running...");
        
        // Check if we're on the deployed site or local development
        const isDeployedSite = window.location.hostname.includes('compmax.app') || 
                               window.location.hostname.includes('github.io');
        
        // Log configuration without exposing sensitive info
        if (typeof CONFIG !== 'undefined' && CONFIG.emailjs) {
            console.log("EmailJS Config Check:");
            console.log("- Public Key Set:", CONFIG.emailjs.publicKey !== "EMAILJS_PUBLIC_KEY");
            console.log("- Service ID Set:", CONFIG.emailjs.serviceId !== "EMAILJS_SERVICE_ID");
            console.log("- Template ID Set:", CONFIG.emailjs.templateId !== "EMAILJS_TEMPLATE_ID");
            
            // Re-initialize EmailJS with proper error handling
            try {
                if (typeof emailjs !== 'undefined') {
                    emailjs.init(CONFIG.emailjs.publicKey);
                    console.log("EmailJS re-initialized successfully");
                    window.emailJsLoaded = true;
                    
                    // Override sendEmail to add better debugging
                    window.originalSendEmail = window.sendEmail || function(){};
                    window.sendEmail = function(params, statusElement, buttonElement, successMessage, successButtonText) {
                        console.log("Sending email with template:", CONFIG.emailjs.templateId);
                        
                        // Add timestamp to avoid caching issues
                        params.timestamp = new Date().getTime();
                        
                        // Ensure we have all required fields for the template
                        // This is critical - missing fields will cause 400 errors
                        const requiredFields = ['to_name', 'to_email', 'subject', 'message', 'from_name'];
                        const missingFields = requiredFields.filter(field => !params[field]);
                        
                        if (missingFields.length > 0) {
                            console.error("Missing required email fields:", missingFields);
                            if (statusElement) {
                                statusElement.textContent = 'Error: Missing required email fields';
                                statusElement.style.color = 'var(--danger)';
                            }
                            if (typeof showError === 'function') {
                                showError('Could not send email: Missing required fields. Please use the manual method instead.');
                            }
                            return Promise.reject('Missing fields: ' + missingFields.join(', '));
                        }
                        
                        return emailjs.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, params)
                            .then(function(response) {
                                console.log('Email sent successfully:', response.status, response.text);
                                if (statusElement) {
                                    statusElement.textContent = successMessage;
                                    statusElement.style.color = 'var(--success)';
                                }
                                if (buttonElement) {
                                    buttonElement.disabled = true;
                                    buttonElement.textContent = successButtonText;
                                }
                                return response;
                            })
                            .catch(function(error) {
                                console.error('Email sending failed:', error);
                                if (statusElement) {
                                    statusElement.textContent = 'Failed to send email. Please use the manual method below.';
                                    statusElement.style.color = 'var(--danger)';
                                }
                                if (typeof showError === 'function') {
                                    showError('Could not send email automatically. Please use the manual method instead.');
                                }
                                return Promise.reject(error);
                            });
                    };
                }
            } catch (error) {
                console.error("EmailJS troubleshooting error:", error);
            }
        }
        
        console.log("Email troubleshooting completed");
    }, 500);
});
