const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("nextButton");
const resultElement = document.getElementById("result");
const imageElement = document.getElementById("image");

let currentQuestionIndex = 0;
let score = 0;
let questions = [];

async function fetchQuestions() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        showQuestion(questions[currentQuestionIndex]);
        
        nextButton.addEventListener("click", nextQuestion);
    } catch (error) {
        console.error('Error al obtener las preguntas:', error);
    }
}

function showQuestion(question) {
    questionElement.textContent = question.pregunta;
    optionsElement.innerHTML = "";

    const allOptions = [
        question.respuesta,
        question.incorrecta1,
        question.incorrecta2,
        question.incorrecta3
    ];

    shuffleArray(allOptions);

    allOptions.forEach(option => {
        const optionElement = document.createElement("div");
        optionElement.className = "option";
        optionElement.textContent = option;
        optionElement.addEventListener("click", () => checkAnswer(option, question.respuesta));
        optionsElement.appendChild(optionElement);
    });

    imageElement.src = question.imagen;
    imageElement.style.objectFit = question.objectFit;

    nextButton.disabled = true;
    resultElement.textContent = "";
}

function checkAnswer(selectedOption, correctAnswer) {
    if (selectedOption === correctAnswer) {
        score++;
    }
    showResult(selectedOption === correctAnswer);
    nextButton.disabled = false;
}

function showResult(isCorrect) {
    resultElement.textContent = isCorrect ? "Correct!" : "Incorrect!";
}

function nextQuestion() {
    resultElement.textContent = "";
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion(questions[currentQuestionIndex]);
    } else {
        showFinalScore();
    }
}

function showFinalScore() {
    questionElement.textContent = "¡Quiz completado!";
    optionsElement.innerHTML = "";
    resultElement.textContent = `Puntaje: ${score}/${questions.length}`;
    nextButton.style.display = "none";
    imageElement.style.display = "none";
}

nextButton.addEventListener("click", nextQuestion);

fetchQuestions();


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
