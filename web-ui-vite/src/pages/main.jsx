import React, { useState, useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';

const StreamingChat = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const abortControllerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, currentMessage]);

  // 模拟流式响应的函数
  const simulateStreamResponse = async (userMessage) => {
    const responses = [
      "你好！我是AI助手。",
      "我可以帮助你回答各种问题。",
      "比如编程、学习、生活等方面的问题。",
      "有什么我可以为你做的吗？",
    ];

    const fullResponse = responses.join('');

    return new ReadableStream({
      start(controller) {
        let index = 0;
        const interval = setInterval(() => {
          if (index < fullResponse.length) {
            controller.enqueue(new TextEncoder().encode(
              `data: ${JSON.stringify({content: fullResponse[index]})}\n\n`
            ));
            index++;
          } else {
            controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
            controller.close();
            clearInterval(interval);
          }
        }, 30);
      }
    });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isStreaming) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    // 添加用户消息
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);

    setIsStreaming(true);
    setCurrentMessage('');

    try {
      // 创建AbortController用于停止流
      abortControllerRef.current = new AbortController();

      // 模拟fetch请求，实际使用时替换为真实API
      const stream = await simulateStreamResponse(userMessage);
      const reader = stream.getReader();
      const decoder = new TextDecoder();

      let accumulatedMessage = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done || abortControllerRef.current.signal.aborted) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              // 流结束，将当前消息添加到消息列表
              setMessages(prev => [...prev, { type: 'assistant', content: accumulatedMessage }]);
              setCurrentMessage('');
              setIsStreaming(false);
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulatedMessage += parsed.content;
                setCurrentMessage(accumulatedMessage);
              }
            } catch (e) {
              console.error('解析错误:', e);
            }
          }
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('流式请求错误:', error);
        setMessages(prev => [...prev, {
          type: 'assistant',
          content: '抱歉，发生了错误。请稍后重试。'
        }]);
      }
    } finally {
      setIsStreaming(false);
      setCurrentMessage('');
    }
  };

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      if (currentMessage) {
        setMessages(prev => [...prev, { type: 'assistant', content: currentMessage }]);
        setCurrentMessage('');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white">
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <h1 className="text-xl font-semibold text-gray-800">AI 流式聊天演示</h1>
        <div className="text-sm text-gray-500">
          {isStreaming ? '正在输入...' : '就绪'}
        </div>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}

        {/* 当前流式消息 */}
        {currentMessage && (
          <div className="flex justify-start">
            <div className="max-w-3xl px-4 py-2 bg-gray-100 text-gray-800 rounded-lg">
              <div className="whitespace-pre-wrap">
                {currentMessage}
                <span className="inline-block w-2 h-5 bg-gray-400 ml-1 animate-pulse"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="border-t p-4">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入消息... (按Enter发送)"
              rows={1}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>

          {isStreaming ? (
            <button
              onClick={stopStreaming}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Square className="w-4 h-4 mr-1" />
              停止
            </button>
          ) : (
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4 mr-1" />
              发送
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StreamingChat;