/**
 * Configuration file for CompMax application
 * This approach helps keep sensitive configuration separate from application logic
 * In a production environment, these values should be injected during build
 */
const CONFIG = {
    // EmailJS configuration
    emailjs: {
        // Public key for EmailJS - should be replaced during build process
        publicKey: "YOUR_PUBLIC_KEY", // Replace with environment variable
        serviceId: "YOUR_SERVICE_ID", // Replace with environment variable
        templateId: "YOUR_TEMPLATE_ID" // Replace with environment variable
    },
    
    // Application defaults
    defaults: {
        maxSalary: 150000,
        maxEquity: 1.5,
        maxShares: 10000,
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
        },
        shares: {
            min: 0,
            max: 10000000
        }
    }
};
