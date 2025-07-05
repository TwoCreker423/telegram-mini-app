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

    console.log(`checkAnswer: userId=${userId}, puzzleNumber=${puzzleNumber}, userInput=${userInput}`);

    clickSound.currentTime = 0;
    clickSound.play();

    try {
        const response = await fetch('answers.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const userAnswers = data.users[userId]?.answers || [];
        console.log(`Fetched answers.json: userAnswers=${JSON.stringify(userAnswers)}`);

        const correctAnswer = userAnswers[puzzleNumber - 1]?.answer || 'unknown';
        const nextStage = userAnswers[puzzleNumber - 1]?.next_stage || 'unknown';
        console.log(`Correct answer=${correctAnswer}, nextStage=${nextStage}`);

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
    console.log('DOMContentLoaded fired');
    document.getElementById('success-modal').style.display = 'none';
    document.getElementById('error-modal').style.display = 'none';
    document.getElementById('welcome-modal').style.display = 'flex';
    
    document.getElementById('success-sound').load();
    document.getElementById('error-sound').load();
    document.getElementById('click-sound').load();

    let userId = document.getElementById('user-id').value;
    const puzzleNumber = parseInt(document.getElementById('puzzle-number').value) || 1;
    const textBlock = document.querySelector('.text-block');
    const imageBlock = document.querySelector('.image-block');
    const allTextSpans = textBlock.querySelectorAll('span');
    const allImages = imageBlock.querySelectorAll('img');

    // Ensure userId is set via Telegram Web App
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        const user = window.Telegram.WebApp.initDataUnsafe.user || {};
        userId = user.id ? String(user.id) : 'unknown';
        document.getElementById('user-id').value = userId;
        document.getElementById('welcome-username').textContent = user.username ? `@${user.username}` : user.first_name || 'Гость';
        console.log(`Telegram Web App: userId=${userId}, username=${user.username || user.first_name || 'Гость'}`);
    } else {
        console.warn('Telegram Web App not available, using fallback userId:', userId);
    }

    // Define answer-to-image and answer-to-text mappings for each puzzle
    const mappings = {
        1: {
            '29.11.2012': { image: 'puzzle1-pic1', text: 'puzzle1-text1' },
            '17.09.2013': { image: 'puzzle1-pic2', text: 'puzzle1-text2' },
            '17.11.2008': { image: 'puzzle1-pic3', text: 'puzzle1-text3' },
            '10.11.2009': { image: 'puzzle1-pic4', text: 'puzzle1-text4' },
            '11.11.2011': { image: 'puzzle1-pic5', text: 'puzzle1-text5' }
        },
        2: {
            '2f схксл': { image: 'puzzle2-pic1', text: 'puzzle2-text1' },
            '84 бхакл': { image: 'puzzle2-pic2', text: 'puzzle2-text2' },
            '173 слтсг': { image: 'puzzle2-pic3', text: 'puzzle2-text3' },
            '4c бдгас': { image: 'puzzle2-pic4', text: 'puzzle2-text4' },
            '3c бсткг': { image: 'puzzle2-pic5', text: 'puzzle2-text5' }
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

    try {
        const response = await fetch('answers.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Fetched answers.json for display: userId=${userId}, puzzleNumber=${puzzleNumber}`);

        const userAnswers = data.users[userId]?.answers || [];
        const puzzleData = userAnswers[puzzleNumber - 1] || {};
        console.log(`User answers: ${JSON.stringify(userAnswers)}, puzzleData: ${JSON.stringify(puzzleData)}`);

        // Show the correct text and image
        if (puzzleData.answer && mappings[puzzleNumber][puzzleData.answer]) {
            const mapping = mappings[puzzleNumber][puzzleData.answer];
            const targetText = document.getElementById(mapping.text);
            const targetImage = document.getElementById(mapping.image);
            console.log(`Displaying answer=${puzzleData.answer}, textId=${mapping.text}, imageId=${mapping.image}`);
            if (targetText) {
                targetText.style.display = 'block';
            } else {
                console.warn(`Text element ${mapping.text} not found`);
            }
            if (targetImage) {
                targetImage.style.display = 'block';
            } else {
                console.warn(`Image element ${mapping.image} not found`);
            }
        } else {
            console.warn(`No valid answer or mapping for puzzleNumber=${puzzleNumber}, answer=${puzzleData.answer}`);
            // Fallback to default
            const fallbackText = document.getElementById(`puzzle${puzzleNumber}-text1`);
            const fallbackImage = document.getElementById(`puzzle${puzzleNumber}-pic1`);
            if (fallbackText) {
                fallbackText.style.display = 'block';
                console.log(`Fallback to text: puzzle${puzzleNumber}-text1`);
            }
            if (fallbackImage) {
                fallbackImage.style.display = 'block';
                console.log(`Fallback to image: puzzle${puzzleNumber}-pic1`);
            }
        }
    } catch (error) {
        console.error('Error loading puzzle data:', error);
        // Fallback to default
        const fallbackText = document.getElementById(`puzzle${puzzleNumber}-text1`);
        const fallbackImage = document.getElementById(`puzzle${puzzleNumber}-pic1`);
        if (fallbackText) {
            fallbackText.style.display = 'block';
            console.log(`Error fallback to text: puzzle${puzzleNumber}-text1`);
        }
        if (fallbackImage) {
            fallbackImage.style.display = 'block';
            console.log(`Error fallback to image: puzzle${puzzleNumber}-pic1`);
        }
    }
});
