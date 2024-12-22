import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionForm = () => {
    const [transactions, setTransactions] = useState([]);
    const [transaction, setTransaction] = useState({ title: '', amount: '', trans_type: 'income' });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        // Get transactions from the backend
        axios.get('http://127.0.0.1:8000/api/v1/transactions/', {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
            .then(response => setTransactions(response.data))
            .catch(error => console.error('Error fetching transactions:', error));
    }, []);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setTransaction({ ...transaction, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = isEditing
            ? `http://127.0.0.1:8000/api/v1/transactions/${editId}/`
            : 'http://127.0.0.1:8000/api/v1/transactions/';
        const method = isEditing ? 'put' : 'post';
            // Update transaction 
        axios({
            method: method,
            url: url,
            data: transaction,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                if (isEditing) {
                    setTransactions(transactions.map(t => (t.id === editId ? response.data : t)));
                    setIsEditing(false);
                    setEditId(null);
                } else {
                    setTransactions([...transactions, response.data]);
                }
                setTransaction({ title: '', amount: '', trans_type: 'income' });
            })
            .catch(error => console.error('Error creating/updating transaction:', error));
        };
                

    const handleEdit = (id) => {
        const transactionToEdit = transactions.find((t) => t.id === id);
        setTransaction(transactionToEdit);
        setIsEditing(true);
        setEditId(id);
    };

    const handleDelete = (id) => {
        axios.delete(`http://127.0.0.1:8000/api/v1/transactions/${id}/`,{
            headers: { 
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
            .then(() => {
                setTransactions(transactions.filter(t => t.id !== id));
            })
            .catch(error => {
                console.error('Error deleting transaction:', error);
                if (error.response) {
                    console.error('Error response:', error.response.data);
                    console.error('Error response status:', error.response.status);
                    console.error('Response headers:', error.response.headers);
                } else if (error.request) {
                    console.error('Error request:', error.request);
                } else {
                    console.error('Error message:', error.message);
                }
        });
    };

    return (
        <div>
            <h1>Transactions</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    value={transaction.title}
                    onChange={handleChange}
                    placeholder="Transaction Title"
                    required
                />
                <input
                    type="number"
                    name="amount"
                    value={transaction.amount}
                    onChange={handleChange}
                    placeholder="Amount"
                    required
                />
                <select name="trans_type" value={transaction.trans_type} onChange={handleChange}>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
                <button type="submit">{isEditing ? 'Update' : 'Add'} Transaction</button>
            </form>
            <ul>
                {transactions.map((t) => (
                    <li key={t.id}>
                        {t.title} - ${t.amount} ({t.trans_type})
                        <button onClick={() => handleEdit(t.id)}>Edit</button>
                        <button onClick={() => handleDelete(t.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionForm;