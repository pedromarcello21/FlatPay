import React, { useState, useEffect } from 'react';

function CreditPage({ currentUser }) {
  const [credits, setCredits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = () => {
    fetch('/credit_history')
      .then(res => {
        if (res.status === 200) {
          res.json().then(data => setCredits(data));
        }
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetch(`/credit_history?search=${searchTerm}`)
      .then(res => {
        if (res.status === 200) {
          res.json().then(data => setSearchResults(data));
        }
      });
  };

  const renderTransactions = (transactions) => {
    if (transactions.length === 0) {
      return <p>No transactions found.</p>;
    }

    return transactions.map(credit => (
      <div key={`credit${credit.id}`}>
        <p>From: {credit.sender_username}</p>
        <p>Amount: ${credit.amount}</p>
        <p>Year: {credit.year}</p>
        <p>Status: {credit.status}</p>
      </div>
    ));
  };

  return (
    <div>
      <h2>Credit Transactions</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {searchTerm && (
        <div>
          <h3>Search Results:</h3>
          {renderTransactions(searchResults)}
        </div>
      )}

      <h3>All Credit Transactions:</h3>
      {renderTransactions(credits)}
    </div>
  );
}

export default CreditPage;