import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react'

const API_KEY = "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"
function App() {
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState([
    {
      message: "Hallo, ich bin dein virtueller Assistent. Kann ich dir Fragen bezüglich deiner gewünschten Stadt beantworten?",
      sender: "ChatGPT"
    }
  ])

  const handleSend = async(message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    }
  
    const newMessages = [...messages, newMessage];

  // update our messages state
    setMessages(newMessages);
  //setting typing
    setTyping(true);
  //process message to chatGPT

    await processMessageToChatGPT(newMessages);


  }

  async function processMessageToChatGPT(chatMessages) {

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if(role === "ChatGPT") {
        role="assistent"
      } else { 
        role="user"
      } return {role: role, content: messageObject.message}
    });

    const systemMessage = {
      role: "system",
      content: "You are A Tripadviser and recommand the top 5 city attraction of the given City"
    }

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages //[message1, message2, ... ]
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      console.log(data.choices[0].message.content);
      setMessages([
        ...chatMessages, {
          message: data.choices[0].message.content,
          sender:"ChatGPT"
        }]
      );
      setTyping(false)
    });
  }

  return (
    <div className='Container-Mo'>
      <div style={{ position: "relative", heigth: "800px", width:"800px"}}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior='smooth'
              typingIndicator={typing ? <TypingIndicator content= "Virtueller Assisstent schreibt" /> : null}
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder="Type your message here..." onSend={handleSend} />
          </ChatContainer>
        </MainContainer>

      </div>
    </div>
  )
}

export default App
