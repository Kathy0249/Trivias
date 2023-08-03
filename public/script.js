const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("nextButton");
const resultElement = document.getElementById("result");
const imageElement = document.getElementById("image");
const restartButton = document.getElementById("restartButton");
const loadingElement = document.getElementById("loading");

let currentQuestionIndex = -1;
let score = 0;
let questions = [];
let answered = false;

nextButton.style.display = "none";
nextButton.addEventListener("click", showNextQuestion);
restartButton.style.display = "none";
restartButton.addEventListener("click", restartQuiz);

async function fetchQuestions() {
    try {
        loadingElement.style.display = "block"; // Mostrar la animación de carga
        const response = await fetch('questions.json');
        questions = await response.json();
        nextButton.style.display = "block";
        restartButton.style.display = "none";
        loadingElement.style.display = "none"; // Ocultar la animación de carga
    } catch (error) {
        console.error('Error al obtener las preguntas:', error);
       
    }
}

function showNextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        answered = false;
        const currentQuestion = questions[currentQuestionIndex];
        questionElement.textContent = currentQuestion.pregunta;
        optionsElement.innerHTML = "";

        const allOptions = [
            currentQuestion.respuesta,
            currentQuestion.incorrecta1,
            currentQuestion.incorrecta2,
            currentQuestion.incorrecta3
        ];

        shuffleArray(allOptions);

        allOptions.forEach(option => {
            const optionElement = document.createElement("div");
            optionElement.className = "option";
            optionElement.textContent = option;

            optionElement.addEventListener("click", () => {
                if (!answered) {
                    checkAnswer(option, currentQuestion.respuesta);
                    answered = true;
                    disableOptionClicks();
                    nextButton.style.display = "block";
                }
            });

            optionsElement.appendChild(optionElement);
        });

        imageElement.src = currentQuestion.imagen;
        imageElement.style.objectFit = currentQuestion.objectFit;
        

        nextButton.style.display = "none";
        resultElement.textContent = "";
        imageElement.style.display = "block";
    } else {
        showFinalScore();
    }
}

function checkAnswer(selectedOption, correctAnswer) {
    if (selectedOption === correctAnswer) {
        score++;
        showResult(true);
    } else {
        showResult(false, correctAnswer);
    }
}

function disableOptionClicks() {
    const optionElements = document.querySelectorAll(".option");
    optionElements.forEach(optionElement => {
        optionElement.removeEventListener("click", () => {});
    });
}

function showResult(isCorrect, correctAnswer) {
    const resultText = isCorrect ? "Correcto" : "Incorrecto";
    resultElement.textContent = resultText;

    const optionElements = document.querySelectorAll(".option");
    optionElements.forEach(optionElement => {
        if (optionElement.textContent === correctAnswer) {
            optionElement.style.backgroundColor = "green";
        } else {
            optionElement.style.backgroundColor = optionElement.textContent === questions[currentQuestionIndex].respuesta ? "green" : "red";
        }

        optionElement.removeEventListener("click", () => {});
    });
}
function showFinalScore() {
    questionElement.textContent = "¡Quiz completado!";
    optionsElement.innerHTML = "";
    resultElement.textContent = `Puntaje: ${score}/${questions.length}`;
    nextButton.style.display = "none";
    restartButton.style.display = "block";
    
    
    imageElement.src = './completedImage.png';
    imageElement.style.objectFit = 'contain';
    imageElement.style.width = '100%';
    imageElement.style.height = 'auto';
    imageElement.style.display = "block";



}

function restartQuiz() {
    currentQuestionIndex = -1;
    score = 0;
    answered = false;

    questionElement.textContent = "";
    optionsElement.innerHTML = "";
    resultElement.textContent = "";
    nextButton.style.display = "none";
    restartButton.style.display = "none";

    fetchQuestions();

    imageElement.src = './ciencia.png';
    imageElement.style.objectFit = 'contain';
    imageElement.style.width = '100%';
    imageElement.style.height = 'auto';
    imageElement.style.display = "block";
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

fetchQuestions();

