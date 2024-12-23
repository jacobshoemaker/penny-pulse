import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import TransactionPieChart from './TransactionPieChart';
import Button from 'react-bootstrap/Button';

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
            .then(response => { 
                setTransactions(response.data.map(t => ({ ...t, amount: Number(t.amount) })));
            })
            .catch(error => {
                console.error('Error fetching transactions:', error);
            });
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
            data: { ...transaction, amount: Number(transaction.amount) },
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                if (isEditing) {
                    setTransactions(transactions.map(t => t.id === editId ? { ...response.data, amount: Number(response.data.amount) } : t));
                    setIsEditing(false);
                    setEditId(null);
                } else {
                    setTransactions([...transactions, { ...response.data, amount: Number(response.data.amount) }]);
                }
                setTransaction({ title: '', amount: '', trans_type: 'income' });
                setIsEditing(false);
                setEditId(null);
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
                <Button variant="primary" size="sm" type="submit" style={{marginLeft: '5px'}}>{isEditing ? 'Update ' : 'Add '} 
                     Transaction
                </Button>
            </form>
            <TransactionPieChart transactions={transactions} />
            <ul>
                {transactions.map((t) => (
                    <li key={t.id}>
                        {t.title} - ${t.amount} ({t.trans_type})
                        <Button variant="primary" size="sm" onClick={() => handleEdit(t.id)} style={{ marginRight: '5px', marginBottom: '5px'} }>
                            Edit
                        </Button>
                        <Button variant="primary" size="sm" onClick={() => handleDelete(t.id)}>Delete</Button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionForm;