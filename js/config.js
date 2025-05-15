/**
 * Configuration file for CompMax application
 * EmailJS credentials directly included
 */
const CONFIG = {
    // EmailJS configuration - Add your actual credentials here
    emailjs: {
        // You can get these from your EmailJS dashboard
        publicKey: "aC33MyvXhim_7HkU6", // e.g., "user_a1b2c3d4e5f6g7"
        serviceId: "service_0zbtwjq", // e.g., "service_abc123"
        templateId: "template_vd3qwz8" // e.g., "template_xyz789"
    },
    
    // Application defaults
    defaults: {
        maxSalary: 150000,
        maxEquity: 1.5,
        maxShares: 100000,
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
