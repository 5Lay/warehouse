package com.wulei.warehousebackend.config.utils;

import cn.hutool.json.JSONUtil;
import com.wulei.warehousebackend.model.response.PathResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TaskWebSocketHandler extends TextWebSocketHandler {
    private static final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String taskId = getTaskIdFromUri(session);
        sessions.put(taskId, session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.values().remove(session);
    }

    public void sendTaskResult(String taskId, PathResponse response) {
        WebSocketSession session = sessions.get(taskId);
        if (session != null && session.isOpen()) {
            try {
                session.sendMessage(new TextMessage(serialize(response)));
            } catch (IOException e) {
                sessions.remove(taskId);
            }
        }
    }

    private String getTaskIdFromUri(WebSocketSession session) {
        String uri = session.getUri().toString();
        return uri.substring(uri.lastIndexOf('/') + 1);
    }

    private String serialize(PathResponse response) {
        return JSONUtil.toJsonStr(response);
    }
}
