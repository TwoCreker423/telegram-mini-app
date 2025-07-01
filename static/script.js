async function checkAnswer() {
    const userInput = document.getElementById('user-input').value.trim().toLowerCase();
    const userId = document.getElementById('user-id').value;
    const puzzleNumber = parseInt(document.getElementById('puzzle-number').value);
    const successModal = document.getElementById('success-modal');
    const errorModal = document.getElementById('error-modal');
    const nextStageSpan = document.getElementById('next-stage');
    const successSound = document.getElementById('success-sound');
    const errorSound = document.getElementById('error-sound');
    const clickSound = document.getElementById('click-sound');

    clickSound.currentTime = 0;
    clickSound.play();

    try {
        const response = await fetch('answers.json');
        const data = await response.json();
        const userAnswers = data.users[userId]?.answers || [];
        const correctAnswer = userAnswers[puzzleNumber - 1]?.answer || 'unknown';
        const nextStage = userAnswers[puzzleNumber - 1]?.next_stage || 'unknown';

        if (userInput === correctAnswer) {
            successModal.style.display = 'flex';
            errorModal.style.display = 'none';
            nextStageSpan.textContent = nextStage;
            successSound.currentTime = 0;
            successSound.play();
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

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('success-modal').style.display = 'none';
    document.getElementById('error-modal').style.display = 'none';
    document.getElementById('welcome-modal').style.display = 'flex';
    
    document.getElementById('success-sound').load();
    document.getElementById('error-sound').load();
    document.getElementById('click-sound').load();

    const userId = document.getElementById('user-id').value;
    const puzzleNumber = parseInt(document.getElementById('puzzle-number').value);
    const textBlock = document.querySelector('.text-block');
    const puzzleImage = document.querySelector('.image-block img');

    try {
        const response = await fetch('answers.json');
        const data = await response.json();
        const userAnswers = data.users[userId]?.answers || [];
        const puzzleData = userAnswers[puzzleNumber - 1] || {};
        
        if (puzzleData.text && puzzleData.image) {
            textBlock.textContent = puzzleData.text;
            puzzleImage.src = puzzleData.image;
            puzzleImage.alt = `Puzzle ${puzzleNumber} Image`;
        } else {
            textBlock.textContent = `Это загадка ${puzzleNumber}. Введите правильный ответ для продолжения.`;
            puzzleImage.src = 'static/picture/gold.jpg';
        }
    } catch (error) {
        console.error('Error loading puzzle data:', error);
        textBlock.textContent = `Ошибка загрузки данных загадки ${puzzleNumber}.`;
    }

    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        const user = window.Telegram.WebApp.initDataUnsafe.user || {};
        document.getElementById('user-id').value = user.id || 'unknown';
        document.getElementById('welcome-username').textContent = user.username ? `@${user.username}` : user.first_name || 'Гость';
    } else {
        console.error('Telegram Web App not available');
        document.getElementById('welcome-username').textContent = 'Гость (Web App не инициализирован)';
    }
});