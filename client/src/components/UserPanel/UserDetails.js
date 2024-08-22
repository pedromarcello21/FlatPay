import React from 'react'

export default function UserDetails({currentUser, setCurrentUser}) {

const greetings = ["Hi", "Hey", "Yo", "Sup", "Welcome"]
const emojis = ["🤝","👋","⭐️" ]


  return (
    <div>
        <h2>{greetings[Math.floor(Math.random()*greetings.length)]}, {currentUser.username} {emojis[Math.floor(Math.random()*emojis.length)]}</h2>

        
    </div>
  )
}
