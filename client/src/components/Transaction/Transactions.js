import React, {useState, useEffect} from 'react'
import TransactionRequest from './TransactionRequest'

export default function Transactions({currentUser}) {

    const [debits, setDebits] = useState([])
    const [credits, setCredits] = useState([])

    const createRequest = (content) =>{
        fetch('/request', {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Accept': 'application/json'
            }, 
            body:JSON.stringify(content)
        })
        .then(()=>{
            fetch('/credits')
            .then(res => {
                if (res.status == 200){
                    res.json()
                    .then(data => setCredits(data))

                }
            })
        })
        
        
        // .then(res => res.json())
        // .then(data => setCredits(credits => [...credits, data]))
    }

    // useEffect(() =>{
    //     fetch('/http://localhost:5555/debits')
    //     .then(res => res.json())
    //     .then(data => console.log(data))
    // }, [currentUser])

    useEffect(() => {
        fetch('/debits')
        .then(res =>{
            if (res.status == 200){
                res.json()
                .then(data =>setDebits(data))
            } 
        })
    }, []);

    useEffect(() =>{
        fetch('/credits')
        .then(res => {
            if (res.status == 200){
                res.json()
                .then(data => setCredits(data))
            } 
        })
    }, []);

  return (
    <>
        <div>Debits:</div>
        { debits.map(debit => <h3 key = {'debit' + debit.id}>I owe {debit.requestor_username} ${debit.amount}</h3>)}
        <div>Credits:</div>
        { credits.map(credit => <h3 key = {'credit' + credit.id}> {credit.requestee_username} owes me ${credit.amount}</h3>)}

        <TransactionRequest createRequest={createRequest} currentUser = {currentUser}/>
    </>
  )
}
