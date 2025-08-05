let commandBuffer = '';

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = commandBuffer.trim();

        if (command === 'CMD(ReVoke-Sweet)') {
            localStorage.removeItem("cookieAcceptedDate");
            console.log('Removed cookieAcceptedDate');
            location.reload();
        } else if (command === 'CMD(Test)') {
            console.log('Yes');
        }

        // Reset buffer after running a command
        commandBuffer = '';
    } 
    else if (e.key.length === 1) {
        commandBuffer += e.key;
    } 
    else if (e.key === 'Backspace') {
        commandBuffer = commandBuffer.slice(0, -1);
    }
});
