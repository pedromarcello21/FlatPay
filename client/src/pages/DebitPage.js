import React, { useState, useEffect } from 'react';

function DebitPage({ currentUser }) {
  const [debits, setDebits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchDebits();
  }, []);

  const fetchDebits = () => {
    fetch('/debit_history')
      .then(res => {
        if (res.status === 200) {
          res.json().then(data => setDebits(data));
        }
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetch(`/debit_history?search=${searchTerm}`)
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

    return transactions.map(debit => (
      <div key={`debit${debit.id}`}>
        <p>To: {debit.receiver_username}</p>
        <p>Amount: ${debit.amount}</p>
        <p>Year: {debit.year}</p>
        <p>Status: {debit.status}</p>
      </div>
    ));
  };

  return (
    <div>
      <h2>Debit Transactions</h2>
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

      <h3>All Debit Transactions:</h3>
      {renderTransactions(debits)}
    </div>
  );
}

export default DebitPage;