async function checkAnswer() {
    const userInput = document.getElementById('user-input').value.trim().toLowerCase();
    const userId = document.getElementById('user-id').value;
    const puzzleNumber = parseInt(document.getElementById('puzzle-number').value);
    const successModal = document.getElementById('success-modal');
    const errorModal = document.getElementById('error-modal');
    const successSound = document.getElementById('success-sound');
    const errorSound = document.getElementById('error-sound');
    const clickSound = document.getElementById('click-sound');

    // Play click sound
    clickSound.currentTime = 0;
    clickSound.play();

    try {
        // Fetch answers.json
        const response = await fetch('answers.json');
        const data = await response.json();
        const userAnswers = data.users[userId] || [];
        const correctAnswer = userAnswers[puzzleNumber - 1] || 'unknown';

        if (userInput === correctAnswer) {
            successModal.style.display = 'flex';
            errorModal.style.display = 'none';
            successSound.currentTime = 0;
            successSound.play();
            // Notify bot of correct answer
            if (window.Telegram?.WebApp) {
                window.Telegram.WebApp.sendData(JSON.stringify({ puzzle_number: puzzleNumber }));
            }
        } else {
            errorModal.style.display = 'flex';
            successModal.style.display = 'none';
            errorSound.currentTime = 0;
            errorSound.play();
        }
    } catch (error) {
        console.error('Error fetching answers:', error);
        errorModal.style.display = 'flex';
        errorModal.querySelector('.result-content').textContent = 'Ошибка загрузки ответа. Попробуйте снова!';
    }
}

function closeModal(modalId) {
    const clickSound = document.getElementById('click-sound');
    clickSound.currentTime = 0;
    clickSound.play();
    document.getElementById(modalId).style.display = 'none';
}

// Hide modals on load and show welcome modal
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('success-modal').style.display = 'none';
    document.getElementById('error-modal').style.display = 'none';
    document.getElementById('welcome-modal').style.display = 'flex';
    
    // Preload sounds
    document.getElementById('success-sound').load();
    document.getElementById('error-sound').load();
    document.getElementById('click-sound').load();
});