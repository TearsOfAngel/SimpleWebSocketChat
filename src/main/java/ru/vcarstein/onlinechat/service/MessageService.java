package ru.vcarstein.onlinechat.service;

import org.springframework.stereotype.Service;
import ru.vcarstein.onlinechat.chat.model.ChatMessage;
import ru.vcarstein.onlinechat.repository.MessageRepository;

import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public void saveMessage(ChatMessage chatMessage) {
        messageRepository.save(chatMessage);
    }

    public List<ChatMessage> getAllMessages() {
        return messageRepository.findAll();
    }

    public List<ChatMessage> filter(String username) {
        return messageRepository.findBySender(username);
    }
}
