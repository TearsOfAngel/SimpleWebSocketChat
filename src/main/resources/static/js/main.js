'use strict'

let usernamePage = document.querySelector('#username-page')
let chatPage = document.querySelector('#chat-page')
let usernameForm = document.querySelector('#usernameForm')
let messageForm = document.querySelector('#messageForm')
let messageInput = document.querySelector('#message')
let messageArea = document.querySelector('#messageArea')
let connectingElement = document.querySelector('.connecting')

let stompClient = null
let username = null

function connect(event) {
    findAndDisplayAllMessages()

    username = document.querySelector('#name').value.trim()

    if (username) {
        usernamePage.classList.add('hidden')
        chatPage.classList.remove('hidden')
        let socket = new SockJS('/ws')
        stompClient = Stomp.over(socket)
        stompClient.connect({}, onConnected, onError)
    }
    event.preventDefault();
}


function onConnected() {

    stompClient.subscribe('/topic/public', onMessageReceived)

    stompClient.send('/app/chat.addUser',
        {},
        JSON.stringify({sender: username, messageType: 'JOIN'})
    )

    connectingElement.classList.add('hidden')
}

function findAndDisplayAllMessages() {
    const messagesList = document.querySelector('#messageArea')

    const query = fetch('/messages').then(response => {
        if (!response.ok) {
            throw new Error('Предыдущие сообщения не загружены...')
        }
        return response.json()
    });

    query.then(messages => {
        console.log(messages)
        messages.forEach(msg => {
            appendMessageElement(msg, messagesList)
        })
    })

    query.catch((error) => {
        const errorMessage = document.createElement('p')
        errorMessage.textContent = error.message
        document.querySelector('.chatArea').appendChild(errorMessage)
    })
}

function appendMessageElement(message, messagesList) {
    const listItem = document.createElement('li')

    if (message.messageType === 'CHAT') {
        listItem.classList.add('chat-message')
        const usernameSpan = document.createElement('span')
        usernameSpan.textContent = message.sender
        const userText = document.createElement('p')
        userText.textContent = message.content
        listItem.appendChild(usernameSpan)
        listItem.appendChild(userText)
        messagesList.appendChild(listItem)
    } else {
        listItem.classList.add('event-message')
        listItem.id = message.sender
        const userText = document.createElement('p')

        if (message.messageType === 'JOIN') {
            userText.textContent = message.sender + ' joined!'
        } else if (message.messageType === 'LEAVE') {
            userText.textContent = message.sender + ' left!'
        }

        listItem.appendChild(userText)
        messagesList.appendChild(listItem)
    }
}

function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!'
    connectingElement.style.color = 'red'
}


function sendMessage(event) {
    let messageContent = messageInput.value.trim()
    if (messageContent && stompClient) {
        let chatMessage = {
            sender: username,
            content: messageInput.value,
            messageType: 'CHAT'
        };
        stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage))
        messageInput.value = ''
    }
    event.preventDefault()
}


function onMessageReceived(payload) {
    let message = JSON.parse(payload.body)

    let messageElement = document.createElement('li')

    if (message.messageType === 'JOIN') {
        messageElement.classList.add('event-message')
        message.content = `${message.sender} joined!`
    } else if (message.messageType === 'LEAVE') {
        messageElement.classList.add('event-message')
        message.content = message.sender + ' left!'
    } else {
        messageElement.classList.add('chat-message')
        let usernameElement = document.createElement('span')
        let usernameText = document.createTextNode(message.sender)
        usernameElement.appendChild(usernameText)
        messageElement.appendChild(usernameElement)
        messageArea.appendChild(messageElement)
    }

    let textElement = document.createElement('p')
    textElement.textContent = message.content
    messageElement.appendChild(textElement)

    messageArea.appendChild(messageElement)
    messageArea.scrollTop = messageArea.scrollHeight;
}


usernameForm.addEventListener('submit', connect, true)
messageForm.addEventListener('submit', sendMessage, true)

