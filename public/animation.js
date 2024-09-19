const nextButton = document.getElementById('nextButton');
const popBalloon = document.getElementById('popBalloon');

nextButton.addEventListener('click', () => {
    // Display the pop animation
    popBalloon.style.visibility = 'visible';
    
    setTimeout(() => {
        // After the pop animation, navigate to the video chat page
        window.location.href = 'index.html';
    }, 3000); // 3 seconds for the balloon to pop
});
