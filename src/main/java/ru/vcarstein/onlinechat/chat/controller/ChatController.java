package ru.vcarstein.onlinechat.chat.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import ru.vcarstein.onlinechat.chat.model.ChatMessage;
import ru.vcarstein.onlinechat.service.MessageService;

import java.util.List;

@RequiredArgsConstructor
@Controller
public class ChatController {

    private final MessageService messageService;

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        messageService.saveMessage(chatMessage);
        return chatMessage;
    }

    /**
     * Adds username into websocket session
     */
    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage,
                               SimpMessageHeaderAccessor headerAccessor) {

        messageService.saveMessage(chatMessage);
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        return chatMessage;
    }


    @GetMapping("/messages")
    public ResponseEntity<List<ChatMessage>> getAllMessages() {
        List<ChatMessage> messages = messageService.getAllMessages();
        return ResponseEntity.ok(messages);
    }

    //TODO Правильный ли путь гетмаппинга
    @GetMapping("/messages/{username}")
    public ResponseEntity<List<ChatMessage>> filterMessagesByUser(@PathVariable String username) {
        List<ChatMessage> messages = messageService.filter(username);
        return ResponseEntity.ok(messages);
    }


}
