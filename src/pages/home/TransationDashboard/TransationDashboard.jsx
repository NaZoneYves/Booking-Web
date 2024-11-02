import React, { useState, useEffect } from 'react';
import './TransactionDashboard.css';

const TransactionDashboard = ({ user }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/transactions`);
        if (!response.ok) throw new Error('Failed to fetch transactions');
        const data = await response.json();
        console.log(data)
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="transaction-dashboard">
      <h1>Your Transactions</h1>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Hotel</th>
            <th>Room</th>
            <th>Date</th>
            <th>Price</th>
            <th>Payment Method</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={transaction._id}>
              <td>{index + 1}</td>
              <td>{transaction.hotel}</td>
              <td>{transaction.room.join(', ')}</td>
              <td>{`${transaction.dateStart} - ${transaction.dateEnd}`}</td>
              <td>${transaction.price}</td>
              <td>{transaction.payment}</td>
              <td className={`status-${transaction.status.toLowerCase()}`}>{transaction.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionDashboard;
