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
    const imageBlock = document.querySelector('.image-block');
    const allImages = imageBlock.querySelectorAll('img');

    try {
        const response = await fetch('answers.json');
        const data = await response.json();
        const userAnswers = data.users[userId]?.answers || [];
        const puzzleData = userAnswers[puzzleNumber - 1] || {};
        
        // Define answer-to-image mappings for each puzzle
        const imageMappings = {
            1: {
                'пиво': 'puzzle1-pic1',
                'водка': 'puzzle1-pic2',
                'вино': 'puzzle1-pic3',
                'коньяк': 'puzzle1-pic4',
                'виски': 'puzzle1-pic5'
            },
            2: {
                'банан': 'puzzle2-pic1',
                'яблоко': 'puzzle2-pic2',
                'земляника': 'puzzle2-pic3',
                'малина': 'puzzle2-pic4',
                'ананас': 'puzzle2-pic5'
            },
            3: {
                'квадрат': 'puzzle3-pic1',
                'круг': 'puzzle3-pic2',
                'треугольник': 'puzzle3-pic3',
                'пятиугольник': 'puzzle3-pic4',
                'восмиугольник': 'puzzle3-pic5'
            },
            4: {
                'дождь': 'puzzle4-pic1',
                'снег': 'puzzle4-pic2',
                'жара': 'puzzle4-pic3',
                'град': 'puzzle4-pic4',
                'ветер': 'puzzle4-pic5'
            },
            5: {
                'король': 'puzzle5-pic1',
                'туз': 'puzzle5-pic2',
                'валлет': 'puzzle5-pic3',
                'десять': 'puzzle5-pic4',
                'дама': 'puzzle5-pic5'
            }
        };

        // Hide all images
        allImages.forEach(img => img.style.display = 'none');

        // Show the correct image and set text
        if (puzzleData.answer && puzzleData.text) {
            const imageId = imageMappings[puzzleNumber][puzzleData.answer];
            if (imageId) {
                const targetImage = document.getElementById(imageId);
                if (targetImage) {
                    targetImage.style.display = 'block';
                }
            }
            textBlock.textContent = puzzleData.text;
        } else {
            textBlock.textContent = `Это загадка ${puzzleNumber}. Введите правильный ответ для продолжения.`;
            const fallbackImage = document.getElementById(`puzzle${puzzleNumber}-pic1`);
            if (fallbackImage) {
                fallbackImage.style.display = 'block';
            }
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