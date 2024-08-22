import React from 'react'

export default function UserDetails({currentUser, setCurrentUser}) {

const greetings = ["Hi", "Hey", "Yo", "Sup", "Welcome"]
const emojis = ["🤝","👋","⭐️" ]

const date = new Date()

  return (
    <div>
        {date.getDay() == 3 ? <h2>It's humpday, {currentUser.username} 🐪</h2> : <h2>{greetings[Math.floor(Math.random()*greetings.length)]}, {currentUser.username} {emojis[Math.floor(Math.random()*emojis.length)]}</h2>}


        
    </div>
  )
}
