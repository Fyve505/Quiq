document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        const input = document.activeElement.value?.trim();

        if (input === 'ReVoke-Sweet') {
            localStorage.removeItem("cookieAcceptedDate");
            console.log('Removed cookieAcceptedDate');
            location.reload();
        } else if (input === 'Test') {
            console.log('Yes');
        }
    }
});
