import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import ExpenseVsBudgetChart from './ExpenseVsBudgetChart';
import IncomeVsBudgetChart from './IncomeVsBudgetChart';

const GoalsForm = () => {
    // Initialize state variable goal with object containing
    // spending_limit and saving_limit properties. Both are set to empty strings.
    const [goal, setGoal] = useState({ spending_limit: '', saving_limit: '' });
    // Initialize state variable goals with empty array. And setGoals function to update goals.
    const [goals, setGoals] = useState([]);
    // Initialize state variable isEditing with false. And setIsEditing function to update isEditing.
    const [isEditing, setIsEditing] = useState(false);
    // Initialize state variable editId with null. And setEditId function to update editId.
    const [editId, setEditId] = useState(null);
    // Initialize state variable transactions with empty array. And setTransactions function to update transactions.
    const [transactions, setTransactions] = useState([]);

    // useEffect hook to fetch goals and transactions when component mounts.
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/v1/goals/', {
            // Set headers with Authorization token from localStorage
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        // If successful, set goals state with response data.
        .then(response => {
            setGoals(response.data);
        })
        // If error, log error to console.
        .catch(error => {
            console.error('Error fetching goals:', error);
        });

        // Fetch transactions from API
        axios.get('http://127.0.0.1:8000/api/v1/transactions/', {
            // Set headers with Authorization token from localStorage
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        // If successful, set transactions state with response data.
        .then(response => {
            // Map over response data and set amount property to number.
            // Using spread operator to copy all properties of transaction object.
            // Override amount property with number value.
            // Convert t.amount to number using Number() function.
            setTransactions(response.data.map(t => ({ ...t, amount: Number(t.amount) })));
        })
        // If error, log error to console.
        .catch(error => {
            console.error('Error fetching transactions:', error);
        });
    }, []);

    // Function to handle change event on input fields.
    const handleChange = (event) => {
        // Destructure name and value from event.target.
        const { name, value } = event.target;
        // Update goal state with new value.
        setGoal({ ...goal, [name]: value });
    };

    // Define function to handle form submission.
    const handleSubmit = (event) => {
        // Prevent default form submission behavior.
        event.preventDefault();
        // Determine URL based on whether editing (isEditing = True) or adding new goal (isEditing = False).
        const url = isEditing 
            ? `http://127.0.0.1:8000/api/v1/goals/${editId}/` 
            : 'http://127.0.0.1:8000/api/v1/goals/';
        
        // Determine HTTP method based on whether editing (isEditing = True) or adding new goal (isEditing = False).
        const method = isEditing ? 'put' : 'post';

        // Make a request to the API using axios.
        axios({
            // Set method to put or post based on isEditing value.
            method: method,
            // Set URL based on isEditing value.
            url: url,
            // Set data to goal state.
            data: goal,
            // Set headers with Authorization token from localStorage.
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        // If successful, update goals state with new goal data.
        .then(response => {
            // If editing, update goal in goals array with new goal data.
            if (isEditing) {
                // Map over goals array and update goal with matching id.
                setGoals(goals.map(g => g.id === editId ? response.data : g));
            // If adding new goal, add new goal data to goals array.
            } else {
                // Spread goals array and add new goal data to end of array.
                setGoals([...goals, response.data]);
            }
            // Reset goal state to empty strings.
            setGoal({ spending_limit: '', saving_limit: '' });
            // Set isEditing to false to exit editing mode.
            setIsEditing(false);
            // Set editId to null to clear editId.
            setEditId(null);
        })
        // If error, log error to console.
        .catch(error => {
            console.error('Error creating/updating goal:', error);
        });
    };

    // Define function to handle edit button click.
    // Taking in id as argument, which represents the id of the goal to edit.
    const handleEdit = (id) => {
        // Find goal with matching id from goals array.
        const goalToEdit = goals.find((g) => g.id === id);
        // Update goal state with goalToEdit data.
        // Populate input fields with goal data for editing.
        setGoal(goalToEdit);
        // Set isEditing to true to enter editing mode.
        setIsEditing(true);
        // Set editId to id to store id of goal being edited.
        setEditId(id);
    };

    // Define function to handle delete button click.
    // Taking in id as argument, which represents the id of the goal to delete.
    const handleDelete = (id) => {
        // Make a request to the API to delete the goal with matching id.
        axios.delete(`http://127.0.0.1:8000/api/v1/goals/${id}/`, {
            // Set headers with Authorization token from localStorage.
            headers: { 
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        // If successful, update goals state by filtering out the goal with matching id.
        .then(() => {
            // Filter out goal with matching id and update
            // goals state with new array that excludes the deleted goal.
            setGoals(goals.filter(g => g.id !== id));
        })
        // If error, log error to console.
        .catch(error => {
            console.error('Error deleting goal:', error);
        });
    };

    // Get spending limit from first goal in goals array.
    // If goals array is empty, set spending limit to 0
    // to prevent errors when rendering chart.
    // Convert spending limit to number using Number() function.
    // This is used to pass spending limit to ExpenseVsBudgetChart component.
    const spendingLimit = goals.length > 0 ? Number(goals[0].spending_limit) : 0;
    const savingLimit = goals.length > 0 ? Number(goals[0].saving_limit) : 0;

    return (
        // Display goals form and list of goals.
        // Form contains input fields for spending limit and saving limit.
        <div>
            <h1>Goals</h1>
            {/* Form to add or update goals */}
            <form onSubmit={handleSubmit}>
                {/* Input field for spending limit */}
                <input
                /* Set type to number */
                    type="number"
                /* Set name to spending_limit */
                    name="spending_limit"
                /* Set value to spending_limit property in goal state */
                    value={goal.spending_limit}
                /* Set onChange event handler to handleChange function */
                    onChange={handleChange}
                    placeholder="Spending Limit Goal"
                    required
                />
                <input
                /* Same as above but for saving limit */
                    type="number"
                    name="saving_limit"
                    value={goal.saving_limit}
                    onChange={handleChange}
                    placeholder="Saving Limit Goal"
                    required
                />
                {/* Button to add or update goal */}
                <Button variant="primary" type="submit" size= "sm" style={{ marginLeft: '5px', marginBottom: '5px'} }>
                    {/* If isEditing is true, display 'Update', otherwise display 'Add' */}
                    {isEditing ? 'Update' : 'Add'} Goal
                </Button>
            </form>
            {/* Expense vs Budget chart component */}
            {/* Pass transactions and spending limit as props */}
            <ExpenseVsBudgetChart transactions={transactions} spendingLimit={Number(spendingLimit)} />
            <IncomeVsBudgetChart transactions={transactions} savingLimit={Number(savingLimit)} />
            {/* List of goals */}
            <ul>
                {/* Map over goals array and display each goal */}
                {goals.map((g) => (
                    // Display spending limit and saving limit for each goal
                    <li key={g.id}>
                        Spending Limit - ${g.spending_limit}<br />
                        Saving Limit - ${g.saving_limit}
                        {/* Button to edit goal */}
                        {/* Pass id of goal to handleEdit function */}
                        <Button variant="primary" size="sm" onClick={() => handleEdit(g.id)} style={{ marginRight: '5px', marginBottom: '5px'} }>
                            Edit
                        </Button>
                        {/* Button to delete goal */}
                        {/* Pass id of goal to handleDelete function */}
                        <Button variant="primary" size="sm" onClick={() => handleDelete(g.id)} style={{ marginRight: '5px', marginBottom: '5px'} }>
                            Delete
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GoalsForm;