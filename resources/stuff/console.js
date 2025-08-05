let commandBuffer = '';

document.addEventListener('keydown', (e) => {
    // If Enter is pressed, check the command
    if (e.key === 'Enter') {
        const command = commandBuffer.trim();

        if (command === '"ReVoke-Sweet"') {
            localStorage.removeItem("cookieAcceptedDate");
            console.log('Removed cookieAcceptedDate');
            location.reload();
        } else if (command === '"Test"') {
            console.log('Yes');
        }

        // Clear buffer after each command
        commandBuffer = '';
    } else if (e.key.length === 1) {
        // Add typed characters to buffer
        commandBuffer += e.key;
    } else if (e.key === 'Backspace') {
        // Remove last character
        commandBuffer = commandBuffer.slice(0, -1);
    }
});
