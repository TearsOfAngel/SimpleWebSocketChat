package ru.vcarstein.onlinechat.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import ru.vcarstein.onlinechat.chat.model.ChatMessage;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<ChatMessage, String> {

    List<ChatMessage> findBySender(String sender);
}
