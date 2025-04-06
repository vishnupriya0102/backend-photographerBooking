import crypto from 'crypto'; // Import crypto module

// Function to generate random bytes
export const generateRandomBytes = () => {
    return crypto.randomBytes(256).toString('base64');
};
