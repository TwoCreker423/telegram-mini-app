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

async function downloadAudioFile(audioId, fileName) {
    try {
        const audioElement = document.getElementById(audioId);
        if (!audioElement) {
            throw new Error('Audio element not found');
        }

        // Создаем индикатор загрузки
        const loadingIndicator = document.createElement('div');
        loadingIndicator.style.position = 'fixed';
        loadingIndicator.style.top = '0';
        loadingIndicator.style.left = '0';
        loadingIndicator.style.width = '100%';
        loadingIndicator.style.height = '3px';
        loadingIndicator.style.backgroundColor = 'rgba(0,0,0,0.1)';
        loadingIndicator.style.zIndex = '9999';
        
        const progressBar = document.createElement('div');
        progressBar.style.height = '100%';
        progressBar.style.width = '0%';
        progressBar.style.backgroundColor = '#4CAF50';
        progressBar.style.transition = 'width 0.3s';
        loadingIndicator.appendChild(progressBar);
        
        document.body.appendChild(loadingIndicator);

        // Получаем файл через fetch
        const response = await fetch(audioElement.src);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentLength = response.headers.get('content-length');
        const reader = response.body.getReader();
        let receivedLength = 0;
        const chunks = [];
        
        while(true) {
            const {done, value} = await reader.read();
            if (done) break;
            
            chunks.push(value);
            receivedLength += value.length;
            
            // Обновляем индикатор прогресса
            if (contentLength) {
                const percentComplete = Math.round((receivedLength / contentLength) * 100);
                progressBar.style.width = `${percentComplete}%`;
            }
        }

        // Собираем все чанки в Blob
        const blob = new Blob(chunks);
        const blobUrl = URL.createObjectURL(blob);
        
        // Создаем ссылку для скачивания
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = fileName;
        downloadLink.style.display = 'none';
        
        // Добавляем в документ и эмулируем клик
        document.body.appendChild(downloadLink);
        downloadLink.click();
        
        // Убираем индикатор загрузки
        progressBar.style.width = '100%';
        setTimeout(() => {
            document.body.removeChild(loadingIndicator);
        }, 500);
        
        // Очистка
        setTimeout(() => {
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(blobUrl);
        }, 100);
        
    } catch (error) {
        console.error('Download failed:', error);
        alert('Не удалось скачать аудио. Пожалуйста, попробуйте позже.');
    }
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
            'квадрат': { image: 'puzzle3-pic1', text: 'puzzle3-text1', audio: 'puzzle3-audio1' },
            'круг': { image: 'puzzle3-pic2', text: 'puzzle3-text2', audio: 'puzzle3-audio2' },
            'треугольник': { image: 'puzzle3-pic3', text: 'puzzle3-text3', audio: 'puzzle3-audio3' },
            'пятиугольник': { image: 'puzzle3-pic4', text: 'puzzle3-text4', audio: 'puzzle3-audio4' },
            'восмиугольник': { image: 'puzzle3-pic5', text: 'puzzle3-text5', audio: 'puzzle3-audio5' }
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

    try {
        const response = await fetch('answers.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        const userAnswers = data.users[userId]?.answers || [];
        const puzzleData = userAnswers[puzzleNumber - 1] || {};

        if (puzzleData.answer && mappings[puzzleNumber][puzzleData.answer]) {
            const mapping = mappings[puzzleNumber][puzzleData.answer];
            const targetText = document.getElementById(mapping.text);
            const targetImage = document.getElementById(mapping.image);
            const targetAudio = mapping.audio ? document.getElementById(mapping.audio) : null;
            
            if (targetText) targetText.style.display = 'block';
            if (targetImage) targetImage.style.display = 'block';
            if (targetAudio) targetAudio.style.display = 'block';
        } else {
            const fallbackText = document.getElementById(`puzzle${puzzleNumber}-text1`);
            const fallbackImage = document.getElementById(`puzzle${puzzleNumber}-pic1`);
            const fallbackAudio = puzzleNumber === 3 ? document.getElementById('puzzle3-audio1') : null;
            
            if (fallbackText) fallbackText.style.display = 'block';
            if (fallbackImage) fallbackImage.style.display = 'block';
            if (fallbackAudio) fallbackAudio.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading puzzle data:', error);
        const fallbackText = document.getElementById(`puzzle${puzzleNumber}-text1`);
        const fallbackImage = document.getElementById(`puzzle${puzzleNumber}-pic1`);
        const fallbackAudio = puzzleNumber === 3 ? document.getElementById('puzzle3-audio1') : null;
        
        if (fallbackText) fallbackText.style.display = 'block';
        if (fallbackImage) fallbackImage.style.display = 'block';
        if (fallbackAudio) fallbackAudio.style.display = 'block';
    }

    // Добавляем обработчик для кнопки скачивания аудио
    const downloadAudioButton = document.getElementById('download-audio-button');
    if (downloadAudioButton) {
        downloadAudioButton.addEventListener('click', async () => {
            const clickSound = document.getElementById('click-sound');
            clickSound.currentTime = 0;
            clickSound.play();

            const currentPuzzleNumber = parseInt(document.getElementById('puzzle-number').value) || 3;
            try {
                const response = await fetch('answers.json');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                
                const data = await response.json();
                const currentUserId = document.getElementById('user-id').value;
                const userAnswers = data.users[currentUserId]?.answers || [];
                const puzzleData = userAnswers[currentPuzzleNumber - 1] || {};
                
                let audioId = 'puzzle3-audio1'; // значение по умолчанию
                let fileName = 'puzzle3_audio.mp3';
                
                if (puzzleData.answer) {
                    const audioMappings = {
                        3: {
                            'квадрат': { id: 'puzzle3-audio1', name: 'квадрат.mp3' },
                            'круг': { id: 'puzzle3-audio2', name: 'круг.mp3' },
                            'треугольник': { id: 'puzzle3-audio3', name: 'треугольник.mp3' },
                            'пятиугольник': { id: 'puzzle3-audio4', name: 'пятиугольник.mp3' },
                            'восмиугольник': { id: 'puzzle3-audio5', name: 'восмиугольник.mp3' }
                        }
                    };
                    
                    if (audioMappings[currentPuzzleNumber] && audioMappings[currentPuzzleNumber][puzzleData.answer]) {
                        audioId = audioMappings[currentPuzzleNumber][puzzleData.answer].id;
                        fileName = audioMappings[currentPuzzleNumber][puzzleData.answer].name;
                    }
                }
                
                await downloadAudioFile(audioId, fileName);
            } catch (error) {
                console.error('Error preparing audio download:', error);
                alert('Ошибка при подготовке аудио к скачиванию');
            }
        });
    }
});