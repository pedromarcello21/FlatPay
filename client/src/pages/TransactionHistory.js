import React, { useState, useEffect } from 'react';

function TransactionHistoryPage({ currentUser }) {
    const [transactions, setTransactions] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = () => {
        fetch('/transactions')
            .then(res => res.json())
            .then(data => setTransactions(data));
    };

    const filteredTransactions = transactions.filter(transaction => {
        const isCredit = transaction.requestor === currentUser?.id;
        if (filter === 'credit' && !isCredit) return false;
        if (filter === 'debit' && isCredit) return false;
        return transaction.description.toLowerCase().includes(searchText.toLowerCase());
    });

    return (
        <div>
            <h2>Transaction History</h2>
            <div>
                <select onChange={(e) => setFilter(e.target.value)} value={filter}>
                    <option value="all">All Transactions</option>
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                </select>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <button onClick={fetchTransactions}>Search</button>
            </div>
            <div>
                {filteredTransactions.map(transaction => (
                    <div key={transaction.id} style={{ border: '1px solid lightgray', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
                        <p>{transaction.requestor === currentUser?.id ? 'To' : 'From'}: {transaction.requestor === currentUser?.id ? transaction.requestee_username : transaction.requestor_username}</p>
                        <p>Amount: ${transaction.amount}</p>
                        <p>Description: {transaction.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TransactionHistoryPage;