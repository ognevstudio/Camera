const video = document.getElementById('video');
const textElement = document.getElementById('text');
const arrayNameElement = document.getElementById('arrayName');

// Названия улиц в массивах
const arrays = {
    array1: ["Street 1", "Street 2", "Street 3"],
    array2: ["Avenue 1", "Avenue 2", "Avenue 3"],
    array3: ["Lane 1", "Lane 2", "Lane 3"]
};

if (navigator.mediaDevices.getUserMedia) {
	const constraints = {
			video: {
					facingMode: "environment" // Запрос на использование задней камеры
			}
	};

	navigator.mediaDevices.getUserMedia(constraints)
			.then(function(stream) {
					video.srcObject = stream;
					startTextRecognition();
			})
			.catch(function(error) {
					console.log("Не удалось получить доступ к камере:", error);
			});
}


// Функция для запуска распознавания текста
function startTextRecognition() {
    setInterval(() => {
        captureAndRecognizeText();
    }, 5000); // Захват изображения каждые 5 секунд
}

// Функция для захвата изображения и распознавания текста
function captureAndRecognizeText() {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL('image/png');

    recognizeTextFromImage(imageDataUrl);
}

// Функция для распознавания текста из изображения
function recognizeTextFromImage(imageDataUrl) {
    Tesseract.recognize(
        imageDataUrl,
        'eng',
        { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
        textElement.textContent = text;
        checkTextAgainstArrays(text);
    });
}

// Функция для проверки текста против массивов с названиями улиц
function checkTextAgainstArrays(text) {
    let found = false;
    for (const [arrayName, streets] of Object.entries(arrays)) {
        for (const street of streets) {
            if (text.includes(street)) {
                arrayNameElement.textContent = arrayName;
                found = true;
                break;
            }
        }
        if (found) break;
    }

    if (!found) arrayNameElement.textContent = "Не найдено";
}
