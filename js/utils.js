// js/utils.js

export function playSound(type) {
    try {
        // Assuming you have a sounds/ directory at the same level as index.html
        const audio = new Audio(`sounds/${type}.mp3`); 
        audio.play().catch(e => console.warn("Error playing sound:", type, e));
    } catch (e) {
        console.warn("Cannot create Audio object:", e);
    }
}

// Add any other utility functions here that might be shared across modules.
