import React, { useState, useEffect } from 'react';
import TransactionRequest from './TransactionRequest';

export default function Transactions({ currentUser }) {
  const [debits, setDebits] = useState([]);
  const [credits, setCredits] = useState([]);

  useEffect(() => {
    fetchDebits();
    fetchCredits();
  }, []);

  const fetchDebits = () => {
    fetch('/debits')
      .then(res => res.json())
      .then(data => setDebits(data));
  };

  const fetchCredits = () => {
    fetch('/credits')
      .then(res => res.json())
      .then(data => setCredits(data));
  };

  const createRequest = (content) => {
    fetch('/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(content)
    })
    .then(() => {
      fetchDebits();
      fetchCredits();
    });
  };

  return (
    <>
      <div>Debits:</div>
      {debits.map(debit => (
        <h3 key={`debit${debit.id}`}>
          I owe {debit.requestor_username} ${debit.amount} in {debit.year}
        </h3>
      ))}
      
      <div>Credits:</div>
      {credits.map(credit => (
        <h3 key={`credit${credit.id}`}>
          {credit.requestee_username} owes me ${credit.amount} in {credit.year}
        </h3>
      ))}

      <TransactionRequest createRequest={createRequest} currentUser={currentUser} />
    </>
  );
}