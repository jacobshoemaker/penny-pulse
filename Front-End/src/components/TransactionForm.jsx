import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import TransactionPieChart from './TransactionPieChart';
import Button from 'react-bootstrap/Button';

// Transaction form component
const TransactionForm = () => {
    // Initialize state variables for transactions, transaction, isEditing, and editId
    const [transactions, setTransactions] = useState([]);
    const [transaction, setTransaction] = useState({ title: '', amount: '', trans_type: 'income' });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // useEffect hook to fetch transactions when component mounts
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/v1/transactions/', {
            // Include token in request headers
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
            // Set transactions state variable to response data
            .then(response => { 
                setTransactions(response.data.map(t => ({ ...t, amount: Number(t.amount) })));
            })
            // Log error if error fetching transactions
            .catch(error => {
                console.error('Error fetching transactions:', error);
            });
    }, []);


    // Function to handle change in input fields
    const handleChange = (e) => {
        // Destructure name and value from input field
        const { name, value } = e.target;
        // Update transaction state variable with new value
        setTransaction({ ...transaction, [name]: value });
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        // Prevent default form submission
        e.preventDefault();
        // If isEditing is true, update transaction, else create new transaction
        const url = isEditing
            ? `http://127.0.0.1:8000/api/v1/transactions/${editId}/`
            : 'http://127.0.0.1:8000/api/v1/transactions/';
        // Set method to put if isEditing is true, else set method to post
        const method = isEditing ? 'put' : 'post';
        
        // Make axios request to create/update transaction
        axios({
            // Set method, url, data, and headers for request
            method: method,
            url: url,
            data: { ...transaction, amount: Number(transaction.amount) },
            // Include token in request headers
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
            // Promise handler to update transactions state variable
            .then(response => {
                // If isEditing is true
                if (isEditing) {
                    // Update transactions state by mapping over existing transactions
                    // and replacing the transaction with matching editId with updated data from response
                    setTransactions(transactions.map(t => t.id === editId ? { ...response.data, amount: Number(response.data.amount) } : t));
                    // Set isEditing to false and editId to null
                    setIsEditing(false);
                    setEditId(null);
                } else {
                    // If isEditing is false, add new transaction to transactions state variable
                    setTransactions([...transactions, { ...response.data, amount: Number(response.data.amount) }]);
                }
                // Reset transaction state variable
                setTransaction({ title: '', amount: '', trans_type: 'income' });
                // Set isEditing to false and editId to null
                setIsEditing(false);
                setEditId(null);
            })
            // Log error if error creating/updating transaction
            .catch(error => console.error('Error creating/updating transaction:', error));
        };
                
    // Function to handle edit transaction
    // Takes in transaction id as argument
    const handleEdit = (id) => {
        // Searching transactions array for transaction with matching id
        const transactionToEdit = transactions.find((t) => t.id === id);
        // Updates transaction state with transactionToEdit
        setTransaction(transactionToEdit);
        // Set isEditing to true and editId to id
        setIsEditing(true);
        setEditId(id);
    };

    // Function to handle delete transaction
    const handleDelete = (id) => {
        // Make axios request to delete transaction with matching id
        axios.delete(`http://127.0.0.1:8000/api/v1/transactions/${id}/`,{
            // Include token in request headers
            headers: { 
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
            // Promise handler to update transactions state variable
            .then(() => {
                // Filter transactions state variable to remove transaction with matching id
                setTransactions(transactions.filter(t => t.id !== id));
            })
            // Log error if error deleting transaction
            .catch(error => {
                console.error('Error deleting transaction:', error);
                // Log error response if error response exists
                if (error.response) {
                    // Log error response data, status, and headers
                    console.error('Error response:', error.response.data);
                    console.error('Error response status:', error.response.status);
                    console.error('Response headers:', error.response.headers);
                // Log error request if error request exists
                } else if (error.request) {
                    console.error('Error request:', error.request);
                } else {
                // Log error message if error message exists
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
            {/* Render TransactionPieChart component with transactions prop */}
            <TransactionPieChart transactions={transactions} />
            <ul>
                {/* Map over transactions state variable and render transaction data */}
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