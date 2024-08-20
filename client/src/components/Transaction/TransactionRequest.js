import React, { useState, useEffect } from 'react';

function TransactionRequest({ createRequest, currentUser }) {

  const [amount, setAmount] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [users, setUsers] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('')
  const [description, setDescription] = useState('')
  // const [userRole, setUserRole] = useState('sender'); 


  useEffect(() => {
    fetch('/friends')

      .then(res => res.json())
      .then(data => setUsers(data.filter(user => user.id !== currentUser.id)));
  }, [currentUser.id]);


  function handleSubmit(e) {
    e.preventDefault();
    const requestData = {
      amount: parseFloat(amount),
      year: parseInt(year),
      payment_method:paymentMethod,
      requestee:selectedUser,
      description:description
      //,
      // [userRole === 'sender' ? 'requestee' : 'requestor']: parseInt(selectedUser),
      // [userRole === 'sender' ? 'requestor' : 'requestee']: currentUser.id
    };
    console.log(requestData)
    createRequest(requestData);
    setAmount('');
    setSelectedUser('');
    setPaymentMethod('');
    setYear(new Date().getFullYear());
    setDescription('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Pay or Request:</h3>
      
      <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
        <option value="">Select a User</option>
        {users.map(user => (
          <option key={user.id} name = "user" value={user.id}>
            {user.username}
          </option>
        ))}
      </select>

      <label>
        <input
          type="radio"
          value="payment"
          name="payment_method"
          // checked={userRole === 'receiver'}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        Payment
      </label>
      
      <label>
        <input
          type="radio"
          value="request"
          name='payment_method'
          // checked={userRole === 'sender'}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        Request
      </label> 
      
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        required
      />

      <input
        type="number"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        placeholder="Year"
        min="1900"
        max="2099"
        step="1"
        required
      />
      <input
      type = "text"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="What's this for?">
      </input>

      <button type="submit">Send</button>
    </form>
  );
}

export default TransactionRequest;
