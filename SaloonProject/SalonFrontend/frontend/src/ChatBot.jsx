// // import React, { useState, useEffect, useRef } from 'react';

// // const ChatBot = () => {
// //   const [messages, setMessages] = useState([
// //     {
// //       id: 1,
// //       text: "Hello! I'm your virtual assistant. How can I help you today?",
// //       sender: 'bot',
// //       timestamp: new Date()
// //     }
// //   ]);
// //   const [inputMessage, setInputMessage] = useState('');
// //   const [isOpen, setIsOpen] = useState(false);
// //   const [isTyping, setIsTyping] = useState(false);
// //   const messagesEndRef = useRef(null);

// //   // Auto-scroll to bottom when new messages arrive
// //   const scrollToBottom = () => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// //   };

// //   useEffect(() => {
// //     scrollToBottom();
// //   }, [messages]);

// //   // Simple bot responses - you can expand this with more sophisticated logic
// //   const getBotResponse = (userMessage) => {
// //     const message = userMessage.toLowerCase();
    
// //     // Basic keyword-based responses
// // if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
// //   return "Hello! Welcome to Elegance Salon. How can we help you today?";
// // }

// // if (message.includes('help') || message.includes('support')) {
// //   return "I'm here to help! You can ask about booking, services, pricing, or salon policies.";
// // }

// // if (message.includes('price') || message.includes('cost') || message.includes('pricing')) {
// //   return "Our prices vary by service and stylist level. For specific pricing, please tell me which service you're interested in (haircut, color, etc.).";
// // }

// // if (message.includes('contact') || message.includes('phone') || message.includes('email')) {
// //   return "You can reach us at hello@Elegancessalon.com or call us at (555) 123-4567.";
// // }

// // if (message.includes('hours') || message.includes('open') || message.includes('time')) {
// //   return "We're open Tuesday-Saturday 9am-8pm, Sunday 10am-5pm. Closed Mondays.";
// // }

// // if (message.includes('thank') || message.includes('thanks')) {
// //   return "You're welcome! Let me know if you need anything else.";
// // }

// // if (message.includes('bye') || message.includes('goodbye')) {
// //   return "Thank you for contacting Looks Salon! We hope to see you soon.";
// // }

// // // Salon-specific responses
// // if (message.includes('service') || message.includes('offer') || message.includes('provide')) {
// //   return "We offer haircuts, coloring, styling, keratin treatments, extensions, manicures, pedicures, waxing, and spa services!";
// // }

// // if (message.includes('appointment') || message.includes('book') || message.includes('schedule')) {
// //   return "You can book online through our website, call us at (555) 123-4567, or reply BOOK to get a booking link.";
// // }

// // if (message.includes('walk in') || message.includes('walk-in')) {
// //   return "Walk-ins are welcome based on availability, but appointments are recommended to guarantee your preferred time.";
// // }

// // if (message.includes('cancel') || message.includes('reschedule')) {
// //   return "Please give us 24 hours notice for cancellations. You can reschedule by calling us or through your booking confirmation email.";
// // }

// // if (message.includes('gift card') || message.includes('gift certificate')) {
// //   return "Gift cards are available in any amount! Purchase in-salon or online at looksalon.com/gifts.";
// // }

// // if (message.includes('payment') || message.includes('pay') || message.includes('credit card')) {
// //   return "We accept cash, all major credit cards, Apple Pay, and Google Pay.";
// // }

// // if (message.includes('parking') || message.includes('park')) {
// //   return "We have complimentary parking behind our salon and 2-hour street parking out front.";
// // }

// // if (message.includes('child') || message.includes('kid') || message.includes('children')) {
// //   return "We love kids! Children's haircuts (12 and under) are $35. We have special chairs and entertainment for little ones.";
// // }

// // if (message.includes('bridal') || message.includes('wedding')) {
// //   return "We offer bridal packages including trial runs. Please book a consultation at least 3 months before your wedding.";
// // }

// // if (message.includes('arrive') || message.includes('early')) {
// //   return "Please arrive 10 minutes early for your appointment. Late arrivals may need shortened services.";
// // }

// // if (message.includes('organic') || message.includes('natural') || message.includes('vegan')) {
// //   return "We use several organic and vegan-friendly product lines including Aveda and Pureology. Ask your stylist for details!";
// // }

// // if (message.includes('stylist') || message.includes('hairstylist') || message.includes('request')) {
// //   return "You can request any stylist when booking! View our team profiles at looksalon.com/stylists.";
// // }

// // if (message.includes('late') || message.includes('running late')) {
// //   return "Please call us immediately if you're running late. After 15 minutes, we may need to reschedule.";
// // }

// // if (message.includes('product') || message.includes('purchase') || message.includes('buy')) {
// //   return "We sell professional haircare products! Ask your stylist for recommendations or visit our retail section.";
// // }

// // if (message.includes('policy') || message.includes('cancelation')) {
// //   return "We require 24 hours notice for cancellations. Late cancellations may incur a fee up to 50% of service cost.";
// // }

// // if (message.includes('group') || message.includes('multiple')) {
// //   return "For groups of 3+, please call us for special booking arrangements. We offer group discounts for 5+ people!";
// // }

// // if (message.includes('same day') || message.includes('today') || message.includes('now')) {
// //   return "Check our online booking for real-time availability or call us - we'll do our best to accommodate you!";
// // }

// // if (message.includes('student') || message.includes('discount')) {
// //   return "Students get 15% off any service Monday-Thursday with valid ID. Some exclusions apply.";
// // }

// // if (message.includes('how long') || message.includes('duration') || message.includes('take')) {
// //   return "Service times vary: haircuts 45min, color 2-3hr, full highlights 3-4hr. We'll provide time estimates when you book.";
// // }

// // if (message.includes('beard') || message.includes('shave') || message.includes('barber')) {
// //   return "We offer men's grooming services including beard trims ($25), straight razor shaves ($40), and skin fades.";
// // }

// // if (message.includes('brand') || message.includes('color') || message.includes('product line')) {
// //   return "We use premium color brands like Wella, Redken, and Olaplex for all color services.";
// // }

// // if (message.includes('photo') || message.includes('picture') || message.includes('portfolio')) {
// //   return "See our work on Instagram @LooksSalon or ask to view stylist portfolios during your visit!";
// // }

// // if (message.includes('loyalty') || message.includes('reward') || message.includes('points')) {
// //   return "Earn 1 point per $1 spent. 100 points = $10 off! We also offer referral bonuses.";
// // }

// // if (message.includes('trim') || message.includes('cut') || message.includes('difference')) {
// //   return "A trim removes minimal length to maintain style. A haircut involves more length removal or style change.";
// // }

// // if (message.includes('extension') || message.includes('weave') || message.includes('tapes')) {
// //   return "We offer tape-in, clip-in, and keratin bond extensions. Book a consultation to discuss options!";
// // }

// // if (message.includes('how often') || message.includes('frequency')) {
// //   return "We recommend haircuts every 6-8 weeks, color touch-ups every 4-6 weeks, and deep conditioning monthly.";
// // }

// // if (message.includes('color') && (message.includes('cut') || message.includes('same time'))) {
// //   return "Yes! Most color services include a haircut. When booking, select 'Color + Cut' for the complete service.";
// // }

// // if (message.includes('different') || message.includes('unique') || message.includes('special')) {
// //   return "Looks Salon stands out for our personalized consultations, ongoing stylist education, and luxury experience at accessible prices!";
// // }
    
// //     // Default response
// //     return "I understand you're asking about: '" + userMessage + "'. Could you please provide more details so I can assist you better?";
// //   };

// //   const handleSendMessage = () => {
// //     if (inputMessage.trim() === '') return;

// //     const userMessage = {
// //       id: messages.length + 1,
// //       text: inputMessage,
// //       sender: 'user',
// //       timestamp: new Date()
// //     };

// //     setMessages(prev => [...prev, userMessage]);
// //     setInputMessage('');
// //     setIsTyping(true);

// //     // Simulate bot typing delay
// //     setTimeout(() => {
// //       const botResponse = {
// //         id: messages.length + 2,
// //         text: getBotResponse(inputMessage),
// //         sender: 'bot',
// //         timestamp: new Date()
// //       };
      
// //       setMessages(prev => [...prev, botResponse]);
// //       setIsTyping(false);
// //     }, 1500);
// //   };

// //   const handleKeyPress = (e) => {
// //     if (e.key === 'Enter') {
// //       handleSendMessage();
// //     }
// //   };

// //   const formatTime = (timestamp) => {
// //     return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// //   };

// //   const chatWindowStyle = {
// //     position: 'fixed',
// //     bottom: '100px',
// //     right: '20px',
// //     width: '350px',
// //     height: '500px',
// //     backgroundColor: '#ffffff',
// //     border: '1px solid #FF0000',
// //     borderRadius: '10px',
// //     boxShadow: '0 5px 30px rgba(0,0,0,0.2)',
// //     display: isOpen ? 'flex' : 'none',
// //     flexDirection: 'column',
// //     zIndex: 1000,
// //     fontFamily: 'Arial, sans-serif'
// //   };

// //   const headerStyle = {
// //     backgroundColor: '#4169E1',
// //     color: 'white',
// //     padding: '15px',
// //     borderRadius: '10px 10px 0 0',
// //     display: 'flex',
// //     justifyContent: 'space-between',
// //     alignItems: 'center'
// //   };

// //   const messagesContainerStyle = {
// //     flex: 1,
// //     overflowY: 'auto',
// //     padding: '10px',
// //     backgroundColor: '#ADD8E6'
// //   };

// //   const messageStyle = {
// //     marginBottom: '10px',
// //     display: 'flex',
// //     flexDirection: 'column'
// //   };

// //   const userMessageStyle = {
// //     alignSelf: 'flex-end',
// //     backgroundColor: '#0000FF',
// //     color: 'white',
// //     padding: '8px 12px',
// //     borderRadius: '15px 15px 5px 15px',
// //     maxWidth: '80%',
// //     wordWrap: 'break-word'
// //   };

// //   const botMessageStyle = {
// //     alignSelf: 'flex-start',
// //     backgroundColor: '#ffffff',
// //     color: '#333',
// //     padding: '8px 12px',
// //     borderRadius: '15px 15px 15px 5px',
// //     maxWidth: '80%',
// //     border: '1px solid #e0e0e0',
// //     wordWrap: 'break-word'
// //   };

// //   const timestampStyle = {
// //     fontSize: '10px',
// //     color: '#888',
// //     marginTop: '2px'
// //   };

// //   const inputContainerStyle = {
// //     display: 'flex',
// //     padding: '10px',
// //     backgroundColor: 'white',
// //     borderRadius: '0 0 10px 10px',
// //     borderTop: '1px solid #e0e0e0'
// //   };

// //   const inputStyle = {
// //     flex: 1,
// //     padding: '8px 12px',
// //     border: '1px solid #ADD8E6',
// //     borderRadius: '20px',
// //     outline: '#0000FF',
// //     fontSize: '14px',
// //     color: 'black'
// //   };

// //   const sendButtonStyle = {
// //     marginLeft: '8px',
// //     padding: '8px 15px',
// //     backgroundColor: '#2563eb',
// //     color: 'white',
// //     border: 'none',
// //     borderRadius: '20px',
// //     cursor: 'pointer',
// //     fontSize: '14px'
// //   };

// //   const toggleButtonStyle = {
// //     position: 'fixed',
// //     bottom: '20px',
// //     right: '20px',
// //     width: '60px',
// //     height: '60px',
// //     backgroundColor: '#0000FF',
// //     color: 'white',
// //     border: 'none',
// //     borderRadius: '50%',
// //     cursor: 'pointer',
// //     fontSize: '24px',
// //     boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
// //     zIndex: 1001
// //   };

// //   const typingIndicatorStyle = {
// //     alignSelf: 'flex-start',
// //     backgroundColor: '#ffffff',
// //     color: '#6666',
// //     padding: '8px 12px',
// //     borderRadius: '15px 15px 15px 5px',
// //     border: '1px solid #0000FF',
// //     fontStyle: 'italic'
// //   };

// //   return (
// //     <div>
// //       {/* Chat Toggle Button */}
// //       <button
// //         style={toggleButtonStyle}
// //         onClick={() => setIsOpen(!isOpen)}
// //         onMouseOver={(e) => e.target.style.backgroundColor = '#0000FF'}
// //         onMouseOut={(e) => e.target.style.backgroundColor = '#4169E1'}
// //       >
// //         {isOpen ? '✕' : '💬'}
// //       </button>

// //       {/* Chat Window */}
// //       <div style={chatWindowStyle}>
// //         {/* Header */}
// //         <div style={headerStyle}>
// //           <div>
// //             <div style={{ fontWeight: 'bold' }}>Customer Support</div>
// //             <div style={{ fontSize: '12px', opacity: 0.8 }}>Online now</div>
// //           </div>
// //           <button
// //             onClick={() => setIsOpen(false)}
// //             style={{
// //               background: 'none',
// //               border: 'none',
// //               color: 'white',
// //               fontSize: '18px',
// //               cursor: 'pointer'
// //             }}
// //           >
// //             ✕
// //           </button>
// //         </div>

// //         {/* Messages Container */}
// //         <div style={messagesContainerStyle}>
// //           {messages.map((message) => (
// //             <div key={message.id} style={messageStyle}>
// //               <div
// //                 style={message.sender === 'user' ? userMessageStyle : botMessageStyle}
// //               >
// //                 {message.text}
// //               </div>
// //               <div
// //                 style={{
// //                   ...timestampStyle,
// //                   alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start'
// //                 }}
// //               >
// //                 {formatTime(message.timestamp)}
// //               </div>
// //             </div>
// //           ))}
          
// //           {/* Typing Indicator */}
// //           {isTyping && (
// //             <div style={messageStyle}>
// //               <div style={typingIndicatorStyle}>
// //                 Bot is typing...
// //               </div>
// //             </div>
// //           )}
          
// //           <div ref={messagesEndRef} />
// //         </div>

// //         {/* Input Container */}
// //         <div style={inputContainerStyle}>
// //           <input
// //             type="text"
// //             value={inputMessage}
// //             onChange={(e) => setInputMessage(e.target.value)}
// //             onKeyPress={handleKeyPress}
// //             placeholder="Type your message..."
// //             style={inputStyle}
// //           />
// //           <button
// //             onClick={handleSendMessage}
// //             style={sendButtonStyle}
// //             onMouseOver={(e) => e.target.style.backgroundColor = '#0000FF'}
// //             onMouseOut={(e) => e.target.style.backgroundColor = '#4169E1'}
// //           >
// //             Send
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ChatBot;




// import React, { useState, useEffect, useRef } from 'react';

// const ChatBot = () => {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: "Hello! I'm your virtual assistant. How can I help you today?",
//       sender: 'bot',
//       timestamp: new Date()
//     }
//   ]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isOpen, setIsOpen] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Auto-scroll to bottom when new messages arrive
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Simple bot responses - unchanged logic
//   const getBotResponse = (userMessage) => {
//     const message = userMessage.toLowerCase();
    
//     if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
//       return "Hello! Welcome to Elegance Salon. How can we help you today?";
//     }
//     if (message.includes('help') || message.includes('support')) {
//       return "I'm here to help! You can ask about booking, services, pricing, or salon policies.";
//     }
//     if (message.includes('price') || message.includes('cost') || message.includes('pricing')) {
//       return "Our prices vary by service and stylist level. For specific pricing, please tell me which service you're interested in (haircut, color, etc.).";
//     }
//     if (message.includes('contact') || message.includes('phone') || message.includes('email')) {
//       return "You can reach us at hello@Elegancessalon.com or call us at (555) 123-4567.";
//     }
//     if (message.includes('hours') || message.includes('open') || message.includes('time')) {
//       return "We're open Tuesday-Saturday 9am-8pm, Sunday 10am-5pm. Closed Mondays.";
//     }
//     if (message.includes('thank') || message.includes('thanks')) {
//       return "You're welcome! Let me know if you need anything else.";
//     }
//     if (message.includes('bye') || message.includes('goodbye')) {
//       return "Thank you for contacting Looks Salon! We hope to see you soon.";
//     }
//     if (message.includes('service') || message.includes('offer') || message.includes('provide')) {
//       return "We offer haircuts, coloring, styling, keratin treatments, extensions, manicures, pedicures, waxing, and spa services!";
//     }
//     if (message.includes('appointment') || message.includes('book') || message.includes('schedule')) {
//       return "You can book online through our website, call us at (555) 123-4567, or reply BOOK to get a booking link.";
//     }
//     if (message.includes('walk in') || message.includes('walk-in')) {
//       return "Walk-ins are welcome based on availability, but appointments are recommended to guarantee your preferred time.";
//     }
//     if (message.includes('cancel') || message.includes('reschedule')) {
//       return "Please give us 24 hours notice for cancellations. You can reschedule by calling us or through your booking confirmation email.";
//     }
//     if (message.includes('gift card') || message.includes('gift certificate')) {
//       return "Gift cards are available in any amount! Purchase in-salon or online at looksalon.com/gifts.";
//     }
//     if (message.includes('payment') || message.includes('pay') || message.includes('credit card')) {
//       return "We accept cash, all major credit cards, Apple Pay, and Google Pay.";
//     }
//     if (message.includes('parking') || message.includes('park')) {
//       return "We have complimentary parking behind our salon and 2-hour street parking out front.";
//     }
//     if (message.includes('child') || message.includes('kid') || message.includes('children')) {
//       return "We love kids! Children's haircuts (12 and under) are $35. We have special chairs and entertainment for little ones.";
//     }
//     if (message.includes('bridal') || message.includes('wedding')) {
//       return "We offer bridal packages including trial runs. Please book a consultation at least 3 months before your wedding.";
//     }
//     if (message.includes('arrive') || message.includes('early')) {
//       return "Please arrive 10 minutes early for your appointment. Late arrivals may need shortened services.";
//     }
//     if (message.includes('organic') || message.includes('natural') || message.includes('vegan')) {
//       return "We use several organic and vegan-friendly product lines including Aveda and Pureology. Ask your stylist for details!";
//     }
//     if (message.includes('stylist') || message.includes('hairstylist') || message.includes('request')) {
//       return "You can request any stylist when booking! View our team profiles at looksalon.com/stylists.";
//     }
//     if (message.includes('late') || message.includes('running late')) {
//       return "Please call us immediately if you're running late. After 15 minutes, we may need to reschedule.";
//     }
//     if (message.includes('product') || message.includes('purchase') || message.includes('buy')) {
//       return "We sell professional haircare products! Ask your stylist for recommendations or visit our retail section.";
//     }
//     if (message.includes('policy') || message.includes('cancelation')) {
//       return "We require 24 hours notice for cancellations. Late cancellations may incur a fee up to 50% of service cost.";
//     }
//     if (message.includes('group') || message.includes('multiple')) {
//       return "For groups of 3+, please call us for special booking arrangements. We offer group discounts for 5+ people!";
//     }
//     if (message.includes('same day') || message.includes('today') || message.includes('now')) {
//       return "Check our online booking for real-time availability or call us - we'll do our best to accommodate you!";
//     }
//     if (message.includes('student') || message.includes('discount')) {
//       return "Students get 15% off any service Monday-Thursday with valid ID. Some exclusions apply.";
//     }
//     if (message.includes('how long') || message.includes('duration') || message.includes('take')) {
//       return "Service times vary: haircuts 45min, color 2-3hr, full highlights 3-4hr. We'll provide time estimates when you book.";
//     }
//     if (message.includes('beard') || message.includes('shave') || message.includes('barber')) {
//       return "We offer men's grooming services including beard trims ($25), straight razor shaves ($40), and skin fades.";
//     }
//     if (message.includes('brand') || message.includes('color') || message.includes('product line')) {
//       return "We use premium color brands like Wella, Redken, and Olaplex for all color services.";
//     }
//     if (message.includes('photo') || message.includes('picture') || message.includes('portfolio')) {
//       return "See our work on Instagram @LooksSalon or ask to view stylist portfolios during your visit!";
//     }
//     if (message.includes('loyalty') || message.includes('reward') || message.includes('points')) {
//       return "Earn 1 point per $1 spent. 100 points = $10 off! We also offer referral bonuses.";
//     }
//     if (message.includes('trim') || message.includes('cut') || message.includes('difference')) {
//       return "A trim removes minimal length to maintain style. A haircut involves more length removal or style change.";
//     }
//     if (message.includes('extension') || message.includes('weave') || message.includes('tapes')) {
//       return "We offer tape-in, clip-in, and keratin bond extensions. Book a consultation to discuss options!";
//     }
//     if (message.includes('how often') || message.includes('frequency')) {
//       return "We recommend haircuts every 6-8 weeks, color touch-ups every 4-6 weeks, and deep conditioning monthly.";
//     }
//     if (message.includes('color') && (message.includes('cut') || message.includes('same time'))) {
//       return "Yes! Most color services include a haircut. When booking, select 'Color + Cut' for the complete service.";
//     }
//     if (message.includes('different') || message.includes('unique') || message.includes('special')) {
//       return "Looks Salon stands out for our personalized consultations, ongoing stylist education, and luxury experience at accessible prices!";
//     }
//     return "I understand you're asking about: '" + userMessage + "'. Could you please provide more details so I can assist you better?";
//   };

//   const handleSendMessage = () => {
//     if (inputMessage.trim() === '') return;

//     const userMessage = {
//       id: messages.length + 1,
//       text: inputMessage,
//       sender: 'user',
//       timestamp: new Date()
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputMessage('');
//     setIsTyping(true);

//     setTimeout(() => {
//       const botResponse = {
//         id: messages.length + 2,
//         text: getBotResponse(inputMessage),
//         sender: 'bot',
//         timestamp: new Date()
//       };
      
//       setMessages(prev => [...prev, botResponse]);
//       setIsTyping(false);
//     }, 1500);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSendMessage();
//     }
//   };

//   const formatTime = (timestamp) => {
//     return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   // Modern dark theme styles
//   const chatWindowStyle = {
//     position: 'fixed',
//     bottom: '90px',
//     right: '20px',
//     width: '380px',
//     height: '550px',
//     backgroundColor: '#1a1a1a',
//     border: '1px solid #333',
//     borderRadius: '16px',
//     boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
//     display: isOpen ? 'flex' : 'none',
//     flexDirection: 'column',
//     zIndex: 1000,
//     fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
//   };

//   const headerStyle = {
//     background: 'linear-gradient(135deg, #2c2c2c 0%, #1f1f1f 100%)',
//     color: '#ffffff',
//     padding: '16px 20px',
//     borderRadius: '16px 16px 0 0',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderBottom: '1px solid #333'
//   };

//   const messagesContainerStyle = {
//     flex: 1,
//     overflowY: 'auto',
//     padding: '20px',
//     backgroundColor: '#222222',
//     scrollbarWidth: 'thin',
//     scrollbarColor: '#444 #222'
//   };

//   const messageStyle = {
//     marginBottom: '16px',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '4px'
//   };

//   const userMessageStyle = {
//     alignSelf: 'flex-end',
//     background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
//     color: '#ffffff',
//     padding: '10px 16px',
//     borderRadius: '16px 16px 4px 16px',
//     maxWidth: '75%',
//     wordBreak: 'break-word',
//     fontSize: '15px',
//     lineHeight: '1.5'
//   };

//   const botMessageStyle = {
//     alignSelf: 'flex-start',
//     backgroundColor: '#2d2d2d',
//     color: '#e5e5e5',
//     padding: '10px 16px',
//     borderRadius: '16px 16px 16px 4px',
//     maxWidth: '75%',
//     wordBreak: 'break-word',
//     fontSize: '15px',
//     lineHeight: '1.5',
//     border: '1px solid #3a3a3a'
//   };

//   const timestampStyle = {
//     fontSize: '11px',
//     color: '#888',
//     marginTop: '4px'
//   };

//   const inputContainerStyle = {
//     display: 'flex',
//     padding: '12px 16px',
//     backgroundColor: '#1a1a1a',
//     borderRadius: '0 0 16px 16px',
//     borderTop: '1px solid #333',
//     gap: '8px'
//   };

//   const inputStyle = {
//     flex: 1,
//     padding: '10px 16px',
//     border: '1px solid #444',
//     borderRadius: '12px',
//     outline: 'none',
//     fontSize: '14px',
//     color: '#ffffff',
//     backgroundColor: '#2d2d2d',
//     transition: 'border-color 0.2s ease',
//     ':focus': {
//       borderColor: '#6366f1'
//     }
//   };

//   const sendButtonStyle = {
//     padding: '10px 20px',
//     background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
//     color: '#ffffff',
//     border: 'none',
//     borderRadius: '12px',
//     cursor: 'pointer',
//     fontSize: '14px',
//     fontWeight: '500',
//     transition: 'opacity 0.2s ease'
//   };

//   const toggleButtonStyle = {
//     position: 'fixed',
//     bottom: '20px',
//     right: '20px',
//     width: '56px',
//     height: '56px',
//     background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
//     color: '#ffffff',
//     border: 'none',
//     borderRadius: '50%',
//     cursor: 'pointer',
//     fontSize: '24px',
//     boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
//     zIndex: 1001,
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     transition: 'transform 0.2s ease'
//   };

//   const typingIndicatorStyle = {
//     alignSelf: 'flex-start',
//     backgroundColor: '#2d2d2d',
//     color: '#888',
//     padding: '8px 16px',
//     borderRadius: '16px 16px 16px 4px',
//     fontStyle: 'italic',
//     fontSize: '14px',
//     border: '1px solid #3a3a3a'
//   };

//   return (
//     <div>
//       {/* Chat Toggle Button */}
//       <button
//         style={toggleButtonStyle}
//         onClick={() => setIsOpen(!isOpen)}
//         onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
//         onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
//       >
//         {isOpen ? '✕' : '💬'}
//       </button>

//       {/* Chat Window */}
//       <div style={chatWindowStyle}>
//         {/* Header */}
//         <div style={headerStyle}>
//           <div>
//             <div style={{ fontWeight: '600', fontSize: '16px' }}>Customer Support</div>
//             <div style={{ fontSize: '12px', opacity: 0.7 }}>Online now</div>
//           </div>
//           <button
//             onClick={() => setIsOpen(false)}
//             style={{
//               background: 'none',
//               border: 'none',
//               color: '#ffffff',
//               fontSize: '18px',
//               cursor: 'pointer',
//               opacity: 0.7
//             }}
//           >
//             ✕
//           </button>
//         </div>

//         {/* Messages Container */}
//         <div style={messagesContainerStyle}>
//           {messages.map((message) => (
//             <div key={message.id} style={messageStyle}>
//               <div
//                 style={message.sender === 'user' ? userMessageStyle : botMessageStyle}
//               >
//                 {message.text}
//               </div>
//               <div
//                 style={{
//                   ...timestampStyle,
//                   alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start'
//                 }}
//               >
//                 {formatTime(message.timestamp)}
//               </div>
//             </div>
//           ))}
          
//           {/* Typing Indicator */}
//           {isTyping && (
//             <div style={messageStyle}>
//               <div style={typingIndicatorStyle}>
//                 Bot is typing...
//               </div>
//             </div>
//           )}
          
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input Container */}
//         <div style={inputContainerStyle}>
//           <input
//             type="text"
//             value={inputMessage}
//             onChange={(e) => setInputMessage(e.target.value)}
//             onKeyPress={handleKeyPress}
//             placeholder="Type your message..."
//             style={inputStyle}
//           />
//           <button
//             onClick={handleSendMessage}
//             style={sendButtonStyle}
//             onMouseOver={(e) => e.target.style.opacity = '0.9'}
//             onMouseOut={(e) => e.target.style.opacity = '1'}
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatBot;