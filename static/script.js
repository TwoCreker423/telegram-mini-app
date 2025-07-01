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
    const allTextSpans = textBlock.querySelectorAll('span');
    const allImages = imageBlock.querySelectorAll('img');

    try {
        const response = await fetch('answers.json');
        const data = await response.json();
        const userAnswers = data.users[userId]?.answers || [];
        const puzzleData = userAnswers[puzzleNumber - 1] || {};

        // Define answer-to-image and answer-to-text mappings for each puzzle
        const mappings = {
            1: {
                'пиво': { image: 'puzzle1-pic1', text: 'puzzle1-text1' },
                'водка': { image: 'puzzle1-pic2', text: 'puzzle1-text2' },
                'вино': { image: 'puzzle1-pic3', text: 'puzzle1-text3' },
                'коньяк': { image: 'puzzle1-pic4', text: 'puzzle1-text4' },
                'виски': { image: 'puzzle1-pic5', text: 'puzzle1-text5' }
            },
            2: {
                'банан': { image: 'puzzle2-pic1', text: 'puzzle2-text1' },
                'яблоко': { image: 'puzzle2-pic2', text: 'puzzle2-text2' },
                'земляника': { image: 'puzzle2-pic3', text: 'puzzle2-text3' },
                'малина': { image: 'puzzle2-pic4', text: 'puzzle2-text4' },
                'ананас': { image: 'puzzle2-pic5', text: 'puzzle2-text5' }
            },
            3: {
                'квадрат': { image: 'puzzle3-pic1', text: 'puzzle3-text1' },
                'круг': { image: 'puzzle3-pic2', text: 'puzzle3-text2' },
                'треугольник': { image: 'puzzle3-pic3', text: 'puzzle3-text3' },
                'пятиугольник': { image: 'puzzle3-pic4', text: 'puzzle3-text4' },
                'восмиугольник': { image: 'puzzle3-pic5', text: 'puzzle3-text5' }
            },
            4: {
                'дождь': { image: 'puzzle4-pic1', text: 'puzzle4-text1' },
                'снег': { image: 'puzzle4-pic2', text: 'puzzle4-text2' },
                'жара': { image: 'puzzle4-pic3', text: 'puzzle4-text3' },
                'град': { image: 'puzzle4-pic4', text: 'puzzle4-text4' },
                'ветер': { image: 'puzzle4-pic5', text: 'puzzle4-text5' }
            },
            5: {
                'король': { image: 'puzzle5-pic1', text: 'puzzle5-text1' },
                'туз': { image: 'puzzle5-pic2', text: 'puzzle5-text2' },
                'валлет': { image: 'puzzle5-pic3', text: 'puzzle5-text3' },
                'десять': { image: 'puzzle5-pic4', text: 'puzzle5-text4' },
                'дама': { image: 'puzzle5-pic5', text: 'puzzle5-text5' }
            }
        };

        // Hide all text spans and images
        allTextSpans.forEach(span => span.style.display = 'none');
        allImages.forEach(img => img.style.display = 'none');

        // Show the correct text and image
        if (puzzleData.answer) {
            const mapping = mappings[puzzleNumber][puzzleData.answer];
            if (mapping) {
                const targetText = document.getElementById(mapping.text);
                const targetImage = document.getElementById(mapping.image);
                if (targetText) {
                    targetText.style.display = 'block';
                }
                if (targetImage) {
                    targetImage.style.display = 'block';
                }
            } else {
                // Fallback to default
                const fallbackText = document.getElementById(`puzzle${puzzleNumber}-text1`);
                const fallbackImage = document.getElementById(`puzzle${puzzleNumber}-pic1`);
                if (fallbackText) fallbackText.style.display = 'block';
                if (fallbackImage) fallbackImage.style.display = 'block';
            }
        } else {
            // Fallback to default
            const fallbackText = document.getElementById(`puzzle${puzzleNumber}-text1`);
            const fallbackImage = document.getElementById(`puzzle${puzzleNumber}-pic1`);
            if (fallbackText) fallbackText.style.display = 'block';
            if (fallbackImage) fallbackImage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading puzzle data:', error);
        const fallbackText = document.getElementById(`puzzle${puzzleNumber}-text1`);
        const fallbackImage = document.getElementById(`puzzle${puzzleNumber}-pic1`);
        if (fallbackText) fallbackText.style.display = 'block';
        if (fallbackImage) fallbackImage.style.display = 'block';
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