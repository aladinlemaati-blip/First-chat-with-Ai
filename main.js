
const chatBoxEl = document.querySelector("#chat-box");
const inputEl = document.querySelector("input");
const buttonEl = document.querySelector("button");
const contactStatusEl = document.querySelector('.contact-status')



const apiUrl = "https://openrouter.ai/api/v1/chat/completions";

const messages = [
    {
        text: 'Ciao, come va?',
        time: '31/10/2026 11:00:00',
        type: 'sent'
    },
    {
        text: 'Tutto bene, e tu?',
        time: '31/10/2026 11:00:01',
        type: 'received'
    }
];


showMessages();

inputEl.addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
        sendMessage();
    }
});

buttonEl.addEventListener("click", sendMessage);





function showMessages() {

    chatBoxEl.innerHTML = "";


    for (const messaggio of messages) {

        chatBoxEl.innerHTML += `
			<div class="chat-row ${messaggio.type}">
				<div class="chat-message">
					<p>${messaggio.text}</p>
					<time datetime="18/11/2025 11:34:00">
						${messaggio.time}
					</time>
				</div>
			</div>
	`;

    }

    chatBoxEl.scrollTop = chatBoxEl.scrollHeight;

}


function sendMessage() {


    const inputText = inputEl.value.trim();


    if (inputText == "") {

        return;
    }

    addMessage(inputText, "sent");

    inputEl.value = "";
    inputEl.focus();

    getAnswer();
}

function addMessage(messageText, messageType) {

    const adesso = new Date();
    const tempoStringa = adesso.toLocaleString();

    const newMessage = {
        text: messageText,
        time: tempoStringa,
        type: messageType,
    };

    messages.push(newMessage);

    showMessages();

}

function getAnswer() {


    contactStatusEl.innerText = 'Sta scrivendo...'


    const requestConfig = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "openai/gpt-4o-mini",
            messages: formatDataForOpenRouter()
        })
    };

    fetch(apiUrl, requestConfig).then(response => {
        return response.json();
    }).then(data => {

        const risposta = data.choices[0].message.content;
        console.log(risposta);

        addMessage(risposta, "received");
        contactStatusEl.innerText = 'Online 🟢';
    });


}

function formatDataForOpenRouter() {
    const results = [
        {
            role: "system",
            content: "Sei Marisa la mia ragazza e stiamo organizzando un viaggio insieme."
        }
    ];

    for (const messaggio of messages) {

        const oggettoFormattato = {
            content: messaggio.text,
        };

        if (messaggio.type == "sent") {
            oggettoFormattato.role = "user";
        } else {
            oggettoFormattato.role = "assistant";
        }

        results.push(oggettoFormattato);

    }

    return results;
}