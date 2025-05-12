// First, update the CONFIG object in config.js:

/**
 * Configuration file for CompMax application
 * This approach helps keep sensitive configuration separate from application logic
 * In a production environment, these values should be injected during build
 */
const CONFIG = {
    // EmailJS configuration
    emailjs: {
        // Public key for EmailJS - should be replaced during build process
        publicKey: "aC33MyvXhim_7HkU6", // Change this
        serviceId: "service_0zbtwjq", // Change this
        templateId: "template_vd3qwz8" // Change this
    },
    
    // Application defaults
    defaults: {
        maxSalary: 150000,
        maxEquity: 1.5,
        maxShares: 100000, // Updated from 10000 to 100000
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
            max: 100000000
        }
    }
};
