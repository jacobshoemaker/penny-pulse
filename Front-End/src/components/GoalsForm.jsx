import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseVsBudgetChart from './ExpenseVsBudgetChart';

const GoalsForm = () => {
    const [goal, setGoal] = useState({ spending_limit: '', saving_limit: '' });
    const [goals, setGoals] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/v1/goals/', {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setGoals(response.data);
        })
        .catch(error => {
            console.error('Error fetching goals:', error);
        });

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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setGoal({ ...goal, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const url = isEditing 
            ? `http://127.0.0.1:8000/api/v1/goals/${editId}/` 
            : 'http://127.0.0.1:8000/api/v1/goals/';
        
        const method = isEditing ? 'put' : 'post';

        axios({
            method: method,
            url: url,
            data: goal,
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            if (isEditing) {
                setGoals(goals.map(g => g.id === editId ? response.data : g));
            } else {
                setGoals([...goals, response.data]);
            }
            setGoal({ spending_limit: '', saving_limit: '' });
            setIsEditing(false);
            setEditId(null);
        })
        .catch(error => {
            console.error('Error creating/updating goal:', error);
        });
    };

    const handleEdit = (id) => {
        const goalToEdit = goals.find((g) => g.id === id);
        setGoal(goalToEdit);
        setIsEditing(true);
        setEditId(id);
    };

    const handleDelete = (id) => {
        axios.delete(`http://127.0.0.1:8000/api/v1/goals/${id}/`, {
            headers: { 
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then(() => {
            setGoals(goals.filter(g => g.id !== id));
        })
        .catch(error => {
            console.error('Error deleting goal:', error);
        });
    };

    const spendingLimit = goals.length > 0 ? Number(goals[0].spending_limit) : 0;

    return (
        <div>
            <h1>Goals</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    name="spending_limit"
                    value={goal.spending_limit}
                    onChange={handleChange}
                    placeholder="Spending Limit Goal"
                    required
                />
                <input
                    type="number"
                    name="saving_limit"
                    value={goal.saving_limit}
                    onChange={handleChange}
                    placeholder="Saving Limit Goal"
                    required
                />
                <button type="submit">{isEditing ? 'Update' : 'Add'} Goal</button>
            </form>
            <ExpenseVsBudgetChart transactions={transactions} spendingLimit={Number(spendingLimit)} />
            <ul>
                {goals.map((g) => (
                    <li key={g.id}>
                        Spending Limit - ${g.spending_limit}<br />
                        Saving Limit - ${g.saving_limit}
                        <button onClick={() => handleEdit(g.id)}>Edit</button>
                        <button onClick={() => handleDelete(g.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GoalsForm;