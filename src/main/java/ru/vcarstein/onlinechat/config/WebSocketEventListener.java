package ru.vcarstein.onlinechat.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import ru.vcarstein.onlinechat.chat.model.ChatMessage;
import ru.vcarstein.onlinechat.chat.messages.MessageType;
import ru.vcarstein.onlinechat.repository.MessageRepository;
import ru.vcarstein.onlinechat.service.MessageService;

@Slf4j
@RequiredArgsConstructor
@Component
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messageTemplate;

    private final MessageService messageService;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");

        if (username != null) {
            log.info("User disconnected: {}", username);
            var chatMessage = ChatMessage.builder()
                    .messageType(MessageType.LEAVE)
                    .sender(username)
                    .build();
            messageService.saveMessage(chatMessage);

            messageTemplate.convertAndSend("/topic/public", chatMessage);
        }
    }

}
