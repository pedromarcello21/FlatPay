import React, { useState, useEffect } from 'react';
import TransactionRequest from './TransactionRequest';

export default function Transactions({ currentUser }) {
  const [debits, setDebits] = useState([]);
  const [credits, setCredits] = useState([]);
  const [payments, setPayments] = useState([]);

  const fetchDebits = () => {
    fetch('/debits')
      .then(res => res.status === 200 ? res.json() : [])
      .then(data => setDebits(data));
  };

  const fetchCredits = () => {
    fetch('/credits')
      .then(res => res.status === 200 ? res.json() : [])
      .then(data => setCredits(data));
  };

  const fetchPayments = () => {
    fetch('/payments')
      .then(res => res.status === 200 ? res.json() : [])
      .then(data => setPayments(data));
  };

  useEffect(() => {
    fetchDebits();
    fetchCredits();
    fetchPayments();
  }, []);

  const createRequest = (content) => {
    fetch('/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(content),
    }).then(() => {
      fetchDebits();
      fetchCredits();
    });
  };

  const completeTransaction = async (transactionId, transactionType) => {
    try {
      const response = await fetch(`/transaction/${transactionId}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactionType }),
      });
      if (response.ok) {
        if (transactionType === 'debit') {
          setDebits(debits.filter(debit => debit.id !== transactionId));
        } else if (transactionType === 'payment') {
          setPayments(payments.filter(payment => payment.id !== transactionId));
        }
        fetchDebits();
        fetchCredits();
        fetchPayments();
      }
    } catch (error) {
      console.error('Error completing transaction:', error);
    }
  };

  return (
    <>
      {debits.length > 0 && (
        <div>
          <div>Pending Requests:</div>
          {debits.map(debit => (
            <h3 key={`debit${debit.id}`} id={debit.id}>
              {debit.requestor_username} requests ${debit.amount} for {debit.description}
              <button onClick={() => completeTransaction(debit.id, 'debit')}>💸</button>
            </h3>
          ))}
        </div>
      )}
      
      {credits.length > 0 && (
        <div>
          <div>Pending Payments:</div>
          {credits.map(credit => (
            <h3 key={`credit${credit.id}`}>
              Pending ${credit.amount} from {credit.requestee_username} for {credit.description}
            </h3>
          ))}
        </div>
      )}

      {payments.length > 0 && (
        <div>
          <div>Incoming payments:</div>
          {payments.map(payment => (
            <h3 key={`payment${payment.id}`} id={payment.id}>
              {payment.requestor_username} sent you ${payment.amount} for {payment.description}
              <button onClick={() => completeTransaction(payment.id, 'payment')}>✔️</button>
            </h3>
          ))}
        </div>
      )}

      <TransactionRequest createRequest={createRequest} currentUser={currentUser} />
    </>
  );
}