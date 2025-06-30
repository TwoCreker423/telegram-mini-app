function checkAnswer() {
    const userInput = document.getElementById('user-input').value.trim().toLowerCase();
    const correctAnswer = 'правильный ответ'; // Укажите правильный ответ здесь
    const successModal = document.getElementById('success-modal');
    const errorModal = document.getElementById('error-modal');
    const successSound = document.getElementById('success-sound');
    const errorSound = document.getElementById('error-sound');
    const clickSound = document.getElementById('click-sound');

    // Воспроизведение звука клика при нажатии кнопки
    clickSound.currentTime = 0;
    clickSound.play();

    if (userInput === correctAnswer) {
        successModal.style.display = 'flex';
        errorModal.style.display = 'none';
        successSound.currentTime = 0;
        successSound.play();
    } else {
        errorModal.style.display = 'flex';
        successModal.style.display = 'none';
        errorSound.currentTime = 0;
        errorSound.play();
    }
}

function closeModal(modalId) {
    const clickSound = document.getElementById('click-sound');
    clickSound.currentTime = 0;
    clickSound.play();
    document.getElementById(modalId).style.display = 'none';
}

// Скрываем модальные окна при загрузке
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('success-modal').style.display = 'none';
    document.getElementById('error-modal').style.display = 'none';
    
    // Предзагрузка звуков
    document.getElementById('success-sound').load();
    document.getElementById('error-sound').load();
    document.getElementById('click-sound').load();
});