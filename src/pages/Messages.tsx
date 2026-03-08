import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, Image as ImageIcon } from 'lucide-react';
import { MessageService, UserService, ItemService } from '../services/api';
import { Message, User, Item } from '../types';
import { useAuth } from '../context/AuthContext';
import { formatPrice, cn } from '../utils/helpers';
import { motion } from 'motion/react';

const messageService = new MessageService();
const itemService = new ItemService();

export default function Messages() {
  const { userId: otherUserId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const queryParams = new URLSearchParams(window.location.search);
  const itemId = queryParams.get('itemId');

  useEffect(() => {
    if (user) {
      const convos = messageService.getUserConversations(user.id);
      setConversations(convos);
    }
  }, [user]);

  useEffect(() => {
    if (user && otherUserId && itemId) {
      const msgs = messageService.getConversation(user.id, otherUserId, itemId);
      setMessages(msgs);
      setOtherUser(UserService.getById(otherUserId) || null);
      setActiveItem(itemService.getById(itemId) || null);
    }
  }, [user, otherUserId, itemId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !otherUserId || !itemId || !newMessage.trim()) return;

    const msg = messageService.create({
      senderId: user.id,
      receiverId: otherUserId,
      itemId: itemId,
      text: newMessage,
      createdAt: new Date().toISOString()
    });

    setMessages([...messages, msg]);
    setNewMessage('');
    
    // Refresh conversations list
    const convos = messageService.getUserConversations(user.id);
    setConversations(convos);
  };

  if (!user) return null;

  // List View
  if (!otherUserId) {
    return (
      <div className="min-h-screen bg-white pb-20 md:pb-10">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-black text-gray-900 mb-8">Messages</h1>
          
          {conversations.length > 0 ? (
            <div className="space-y-2">
              {conversations.map((conv, i) => (
                <Link
                  key={i}
                  to={`/messages/${conv.otherUser.id}?itemId=${conv.item.id}`}
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                >
                  <img src={conv.otherUser.profileImage} alt={conv.otherUser.name} className="w-14 h-14 rounded-full object-cover" referrerPolicy="no-referrer" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-gray-900 truncate">{conv.otherUser.name}</h3>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {new Date(conv.lastMessage.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate mb-1">
                      {conv.lastMessage.senderId === user.id ? 'You: ' : ''}{conv.lastMessage.text}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {conv.item.title}
                      </span>
                    </div>
                  </div>
                  <img src={conv.item.images[0]} alt={conv.item.title} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="text-gray-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-500 max-w-xs">
                When you message a seller or someone messages you, it will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Chat View
  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col md:relative md:inset-auto md:h-[calc(100vh-64px)]">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
        <button onClick={() => navigate('/messages')} className="p-2 -ml-2">
          <ChevronLeft size={24} />
        </button>
        {otherUser && (
          <div className="flex items-center gap-3 flex-1">
            <img src={otherUser.profileImage} alt={otherUser.name} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
            <div>
              <h3 className="font-bold text-sm text-gray-900">{otherUser.name}</h3>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Online</p>
            </div>
          </div>
        )}
        {activeItem && (
          <Link to={`/item/${activeItem.id}`} className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl pr-3">
            <img src={activeItem.images[0]} alt={activeItem.title} className="w-8 h-8 rounded-lg object-cover" referrerPolicy="no-referrer" />
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold text-gray-900 truncate max-w-[100px]">{activeItem.title}</p>
              <p className="text-[10px] font-black text-emerald-600">{formatPrice(activeItem.price)}</p>
            </div>
          </Link>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === user.id;
          return (
            <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[80%] px-4 py-2.5 rounded-2xl text-sm",
                isMe ? "bg-emerald-600 text-white rounded-tr-none" : "bg-gray-100 text-gray-900 rounded-tl-none"
              )}>
                <p>{msg.text}</p>
                <p className={cn("text-[9px] mt-1 font-medium opacity-60", isMe ? "text-right" : "text-left")}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100 bg-white pb-8 md:pb-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <button type="button" className="p-3 bg-gray-100 text-gray-500 rounded-2xl hover:bg-gray-200 transition-colors">
            <ImageIcon size={20} />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-gray-100 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim()}
            className="p-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-colors disabled:bg-gray-200 disabled:text-gray-400"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

import { MessageCircle } from 'lucide-react';
