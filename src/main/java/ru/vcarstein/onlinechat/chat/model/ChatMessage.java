package ru.vcarstein.onlinechat.chat.model;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import ru.vcarstein.onlinechat.chat.messages.MessageType;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document
public class ChatMessage {

    private String sender;

    private String content;

    private MessageType messageType;
}
