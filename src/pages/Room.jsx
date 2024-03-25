import React, {useState,useEffect} from 'react'
import client, { databases,DATABASE_ID,COLLECTION_ID_MESSAGES } from '../appwriteConfig'
import { ID,Query, Role, Permission } from 'appwrite'
import {Trash2} from 'react-feather'
import Header from '../components/Header'
import { useAuth } from '../utils/AuthContext'

function Room() {
  const {user} = useAuth()
  const[messages, setMessages] = useState([])
  const [messageBody,setMessageBody] = useState('')

  useEffect(() => {
    getMessages()
    const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`, response => {
      if(response.events.includes("databases.*.collections.*.documents.*.create")){
        console.log('A MESSAGE WAS CREATED')
        setMessages(prevState => [response.payload,...prevState]) // so here every time when we create message we take all prev messages and set it -- payload for msg body
    }
    if(response.events.includes("databases.*.collections.*.documents.*.delete")){
      console.log('A MESSAGE WAS DELETED!!!')
      setMessages((prevState => prevState.filter(message => message.$id !== response.payload.$id))) // response me se id liya this will actually occur to remote users
  }  
     
  });

  return () => {
      unsubscribe()
  }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()  // becoze by default when form get submit it refresh page and send data somewhere through url

    let payload = {  // here hum userid,username pass karenge createDocument me through payload
      user_id:user.$id,
      username:user.name,
     body:messageBody
    }

    let permissions = [ // here we assign permission to current user
      Permission.write(Role.user(user.$id))// current specific user (creater) can delete meassage
    ]

     let response = await databases.createDocument(
         DATABASE_ID,
         COLLECTION_ID_MESSAGES,
         ID.unique(),
         payload , // here payload consist actual meassage body
         permissions
     )

     console.log('created!', response)

 // setMessages(prevState => [response,...messages]) //yahape hum direct message set nahi kar sakate hai becoz previous wale erase ho jayenge to hum prev walw ko spred karenge and new vala add karenge

     setMessageBody('') // once you done set blank value becoz we want to reset that form 
 }

  const getMessages = async () =>{  
    const response = await databases.listDocuments(
         DATABASE_ID,
         COLLECTION_ID_MESSAGES,
        //  [
        //   Query.orderDesc('$createdAt')
        //  ] 
         ) 
     console.log('Response:',response)
     setMessages(response.documents)
    }

    const deleteMessage = async (message_id) => {
      databases.deleteDocument(DATABASE_ID,COLLECTION_ID_MESSAGES,message_id)
    // setMessages((prevState => messages.filter(message => message.$id !== message_id))) // not need to update/refresh message array after delete becoz hamane ui pe change kiya 
   }// basically here we create new array here that not contain deleted item

  return (
    <main className="container">
      <Header/>

     <div className="room--container">
       <form onSubmit={handleSubmit} id="message--form" >
            <div>
                <textarea 
                required 
                maxLength="1000" 
                placeholder="say something..." 
                onChange={(e) => {
                    setMessageBody(e.target.value)  // so here we update the state
                }}
                value={messageBody}
                >
                </textarea>
            </div>
            <div className="send-btn--wrapper">
                <input className="btn btn--secondary" type="submit" value="Send" />
            </div>
          </form>



      <div>
        {messages.map(message => (
          <div key={message.$id} className="message--wrapper">

            <div className="message--header">
              <p>{message?.username ? (  // here add name name of message creator
                <span>{message.username}</span>
              ) : (
                <span>Anonymous user</span>
              )}
              
              <small className="message-timestamp">{new Date(message.$createdAt).toLocaleString()}</small>

              </p>
              {/*if we have it (permission) only that case we show delete button */}
              {message.$permissions.includes(`delete(\"user:${user.$id}\")`) && <Trash2 
                                                                                  className='delete--btn'
                                                                                  onClick={() => {deleteMessage(message.$id)}}
                                                                               />}

               
              {/* <button onClick={() => {deleteMessage(message.$id)}}>X</button> */}
             
            </div>

            <div className="message--body">
              <span>{message.body}</span>
            </div>
          </div>
        ))}
      </div>
     </div>
    </main>
  )
}

export default Room