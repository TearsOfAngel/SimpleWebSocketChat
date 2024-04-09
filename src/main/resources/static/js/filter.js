'use strict'

let filterForm = document.querySelector('#filterForm')
let filterInput = document.querySelector('#filter')

filterInput.addEventListener('input', filterMessages)

filterForm.addEventListener('submit', function(event) {
    event.preventDefault()

    filterMessages()
});

function filterMessages(event) {
    event.preventDefault()
    let filterUsername = document.getElementById("filter").value.trim()

    let allMessages = document.querySelectorAll('.chat-message')

    allMessages.forEach(function(message) {
        let messageSender = message.querySelector('span').innerHTML
        let startsWithFilterUsername = messageSender.startsWith(filterUsername)

        if (filterUsername !== "" && !startsWithFilterUsername) {
            message.style.display = "none"
        } else {
            message.style.display = ""
        }
    })

    let allEvents = document.querySelectorAll('.event-message')

    allEvents.forEach(function(eventMessage) {
        let eventText = eventMessage.querySelector('p').innerHTML
        let startsWithFilterUsername = eventText.startsWith(filterUsername)

        if (filterUsername !== "" && !startsWithFilterUsername) {
            eventMessage.style.display = "none"
        } else {
            eventMessage.style.display = ""
        }
    })
}


