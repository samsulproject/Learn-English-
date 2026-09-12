/* ===================================
   ENGLISHTALK - MR WILSON
=================================== */

const teacher = document.getElementById("teacher");
const mouth = document.getElementById("mouth");

const chatBox = document.getElementById("chatBox");

const userInput = document.getElementById("userInput");

const sendBtn = document.getElementById("sendBtn");

const micBtn = document.getElementById("micBtn");

const listeningText =
    document.getElementById("listeningText");

const challengeTopBtn =
    document.getElementById("challengeTopBtn");

const challengePanel =
    document.getElementById("challengePanel");

const closeChallenge =
    document.getElementById("closeChallenge");

const startChallenge =
    document.getElementById("startChallenge");

const timerElement =
    document.getElementById("timer");

const levelText =
    document.getElementById("levelText");


/* ===================================
   TEACHER EXPRESSION
=================================== */

function setExpression(expression) {

    teacher.classList.remove(
        "normal",
        "angry",
        "happy",
        "thinking"
    );

    teacher.classList.add(expression);
}


/* ===================================
   TEACHER TALKING
=================================== */

function teacherTalk(text) {

    setExpression("normal");

    teacher.classList.add("talking");

    speakText(text);

    const duration =
        Math.max(1200, text.length * 55);

    setTimeout(() => {

        teacher.classList.remove("talking");

    }, duration);
}


/* ===================================
   TEXT TO SPEECH
=================================== */

function speakText(text) {

    if (!("speechSynthesis" in window)) {

        console.log(
            "Browser tidak mendukung Text to Speech."
        );

        return;
    }

    window.speechSynthesis.cancel();

    const speech =
        new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";

    speech.rate = 0.9;

    speech.pitch = 0.8;

    speech.volume = 1;

    speech.onstart = function () {

        teacher.classList.add("talking");

    };

    speech.onend = function () {

        teacher.classList.remove("talking");

    };

    window.speechSynthesis.speak(speech);
}


/* ===================================
   ADD MESSAGE
=================================== */

function addMessage(text, sender) {

    const message =
        document.createElement("div");

    message.className =
        "message " +
        (sender === "user"
            ? "user-message"
            : "teacher-message");


    if (sender === "teacher") {

        message.innerHTML = `

            <div class="avatar-small">
                👨‍🏫
            </div>

            <div class="bubble">

                <strong>
                    Mr. Wilson
                </strong>

                <p>
                    ${text}
                </p>

                <button
                    class="speak-message"
                    onclick="speakText(${JSON.stringify(text)})">

                    🔊

                </button>

            </div>

        `;

    } else {

        message.innerHTML = `

            <div class="bubble">

                <strong>
                    You
                </strong>

                <p>
                    ${text}
                </p>

            </div>

        `;

    }


    chatBox.appendChild(message);

    chatBox.scrollTop =
        chatBox.scrollHeight;
}


/* ===================================
   AI RESPONSE
=================================== */

function getTeacherResponse(text) {

    const answer =
        text.toLowerCase().trim();


    /* GREETING */

    if (
        answer.includes("hello") ||
        answer.includes("hi") ||
        answer.includes("good morning")
    ) {

        setExpression("happy");

        return {
            text:
                "Good. At least you know how to greet your teacher. Now, tell me about yourself using three sentences.",
            expression: "happy"
        };

    }


    /* NAME */

    if (
        answer.includes("my name is") ||
        answer.includes("i am")
    ) {

        return {
            text:
                "Good. Now don't stop there. Tell me where you live and what you like to do.",
            expression: "thinking"
        };

    }


    /* WRONG GRAMMAR */

    if (
        answer.includes("yesterday i go") ||
        answer.includes("i go yesterday") ||
        answer.includes("last week i go")
    ) {

        return {
            text:
                "No. Pay attention. You are talking about the past. Use 'went', not 'go'. Try again.",
            expression: "angry"
        };

    }


    /* SHORT ANSWER */

    if (answer.split(" ").length <= 2) {

        return {
            text:
                "That's it? Two words? I asked you to speak English. Give me a complete sentence.",
            expression: "angry"
        };

    }


    /* QUESTION ABOUT HOBBY */

    if (
        answer.includes("football") ||
        answer.includes("soccer") ||
        answer.includes("game") ||
        answer.includes("gaming")
    ) {

        return {
            text:
                "Interesting. Now explain WHY you enjoy it. Use at least two sentences.",
            expression: "thinking"
        };

    }


    /* DEFAULT */

    return {
        text:
            "Hmm... not bad. But I want a better answer. Try using more vocabulary and make your sentence longer.",
        expression: "thinking"
    };
}


/* ===================================
   SEND MESSAGE
=================================== */

function sendMessage() {

    const text =
        userInput.value.trim();


    if (!text) {

        setExpression("angry");

        teacherTalk(
            "You have to say something. I'm waiting."
        );

        return;
    }


    addMessage(text, "user");

    userInput.value = "";


    /* THINKING */

    setExpression("thinking");


    setTimeout(() => {

        const response =
            getTeacherResponse(text);


        addMessage(
            response.text,
            "teacher"
        );


        setExpression(
            response.expression
        );


        teacherTalk(
            response.text
        );

    }, 700);
}


/* ===================================
   SEND BUTTON
=================================== */

sendBtn.addEventListener(
    "click",
    sendMessage
);


/* ===================================
   ENTER KEY
=================================== */

userInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            sendMessage();

        }

    }
);


/* ===================================
   MICROPHONE
=================================== */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (SpeechRecognition) {

    const recognition =
        new SpeechRecognition();

    recognition.lang =
        "en-US";

    recognition.continuous = false;

    recognition.interimResults = false;


    micBtn.addEventListener(
        "click",
        function() {

            try {

                recognition.start();

                listeningText.textContent =
                    "🎤 Listening... Speak English!";

                setExpression("thinking");

                micBtn.style.transform =
                    "scale(1.1)";

            } catch (error) {

                console.log(error);

            }

        }
    );


    recognition.onresult =
        function(event) {

            const result =
                event.results[0][0].transcript;

            userInput.value =
                result;

            listeningText.textContent =
                "✅ I heard you.";

            micBtn.style.transform =
                "scale(1)";

        };


    recognition.onerror =
        function() {

            listeningText.textContent =
                "❌ Couldn't hear you. Try again.";

            micBtn.style.transform =
                "scale(1)";

        };


    recognition.onend =
        function() {

            micBtn.style.transform =
                "scale(1)";

        };

} else {

    micBtn.addEventListener(
        "click",
        function() {

            alert(
                "Browser ini belum mendukung Speech Recognition. Coba Chrome."
            );

        }
    );

}


/* ===================================
   CHALLENGE
=================================== */

challengeTopBtn.addEventListener(
    "click",
    function() {

        challengePanel.classList.add("show");

        setExpression("angry");

    }
);


closeChallenge.addEventListener(
    "click",
    function() {

        challengePanel.classList.remove("show");

        setExpression("normal");

    }
);


/* ===================================
   CHALLENGE TIMER
=================================== */

let challengeTime = 60;

let challengeInterval = null;


startChallenge.addEventListener(
    "click",
    function() {

        if (challengeInterval) {

            clearInterval(
                challengeInterval
            );

        }


        challengeTime = 60;

        timerElement.textContent =
            challengeTime;

        startChallenge.disabled = true;

        setExpression("angry");


        const challengeMessage =
            "Challenge time. You have sixty seconds. Explain your opinion in English. Don't waste your time.";

        addMessage(
            challengeMessage,
            "teacher"
        );

        teacherTalk(
            challengeMessage
        );


        challengeInterval =
            setInterval(() => {

                challengeTime--;

                timerElement.textContent =
                    challengeTime;


                if (challengeTime <= 10) {

                    timerElement.style.color =
                        "#ff5252";

                }


                if (challengeTime <= 0) {

                    clearInterval(
                        challengeInterval
                    );

                    startChallenge.disabled =
                        false;

                    timerElement.textContent =
                        "TIME!";

                    setExpression(
                        "happy"
                    );

                    teacherTalk(
                        "Time is up. Not bad. But you need more practice."
                    );

                }

            }, 1000);

    }
);


/* ===================================
   INITIAL TEACHER GREETING
=================================== */

setTimeout(() => {

    teacherTalk(
        "Good morning, student. Let's practice English."
    );

}, 800);