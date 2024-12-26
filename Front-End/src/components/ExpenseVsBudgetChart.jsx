import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';

// This component displays a bar chart that compares the total expenses to the spending limit.
const ExpenseVsBudgetChart = ({ transactions, spendingLimit }) => {
    // State to store the total expenses
    const [totalExpenses, setTotalExpenses] = useState(0);


    // Calculate the total expenses when the transactions or spending limit change
    useEffect(() => {
        // Filter the transactions to get only the expenses and calculate the total
        if (transactions && transactions.length > 0) {
            // Calculate the total expenses
            const expenses = transactions
            // Filter the transactions to get only the expenses
                .filter(t => t.trans_type === 'expense')
                // Calculate the total
                .reduce((sum, t) => sum + Number(t.amount), 0);

                // Log the total expenses and spending limit
                console.log('Total expenses:', expenses);
                console.log('Spending limit:', spendingLimit);

                // Set the total expenses
            setTotalExpenses(expenses);
        }
    
    }, [transactions, spendingLimit]);

    // Return the bar chart
    return (
        // Display the bar chart
        <Plot
            // Set the x and y axis data
            data={[
                {
                    x: ['Expenses', 'Spending Limit'],
                    y: [totalExpenses, spendingLimit],
                    type: 'bar',
                    marker: { color: ['#035AFC', '#FC6F03'] }
                }
            ]}
            // Set the layout of the chart
            layout={{ title: 'Expenses vs Spending Limit' }}
        />
    );
};

// Define the prop types to set expectations for data types
ExpenseVsBudgetChart.propTypes = {
    // Specifying that transactions is an array of objects with specific properties
    transactions: PropTypes.arrayOf(
        // Specifying the properties of each transaction object
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            amount: PropTypes.number.isRequired,
            trans_type: PropTypes.string.isRequired
        })
    ).isRequired,
    spendingLimit: PropTypes.number.isRequired
};

export default ExpenseVsBudgetChart;