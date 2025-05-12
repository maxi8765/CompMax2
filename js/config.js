/**
 * Configuration file for CompMax application
 * This approach helps keep sensitive configuration separate from application logic
 * In a production environment, these values should be injected during build
 */
const CONFIG = {
    // EmailJS configuration
    emailjs: {
        // Public key for EmailJS - should be replaced during build process
        publicKey: "EMAILJS_PUBLIC_KEY",  
        serviceId: "EMAILJS_SERVICE_ID",  
        templateId: "EMAILJS_TEMPLATE_ID"  
    },
    
    // Application defaults
    defaults: {
        maxSalary: 150000,
        maxEquity: 1.5,
        sliderPosition: 50
    },
    
    // Validation constraints
    validation: {
        salary: {
            min: 0,
            max: 10000000
        },
        equity: {
            min: 0,
            max: 100
        }
    }
};
