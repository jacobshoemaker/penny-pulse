import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';

// This component displays a pie chart that compares the total income to the total expenses.
// It takes a list of transactions as a prop and calculates the total income and expenses.
const TransactionPieChart = ({ transactions }) => {
    // State variables to store the total income and expenses
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);

    // Hook that runs provided function when transactions change
    useEffect(() => {
        const income = transactions
            // Filter the transactions to get only the income and calculate the total
            .filter(t => t.trans_type === 'income')
            // Calculate the total
            .reduce((sum, t) => sum + Number(t.amount), 0);

        // Filter the transactions to get only the expenses and calculate the total
        const expenses = transactions
            .filter(t => t.trans_type === 'expense')
            // Sum amount of filtered transactions to get total expenses
            .reduce((sum, t) => sum + Number(t.amount), 0);

        // Update totalIncome and totalExpenses state variables
        setTotalIncome(income);
        setTotalExpenses(expenses);
        // Run this hook whenever transactions change
    }, [transactions]);

    return (
        //Rendering Plot component from react-plotly.js
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <div style={{ width: '50%' }}>
                <Plot
                    // Pass data and layout props to Plot component
                    data={[
                        {
                            // Set values to totalIncome and totalExpenses
                            values: [totalIncome, totalExpenses],
                            // Set labels to 'Income' and 'Expenses'
                            labels: ['Income', 'Expenses'],
                            // Set type to 'pie' for pie chart
                            type: 'pie',
                            marker: {
                                colors: ['#1f77b4', '#ff7f0e'],
                            },
                            textinfo: 'label+percent',
                            hoverinfo: 'label+percent+value',
                            hovertemplate: '%{label}: %{percent}<br>Total: %{value:$,.2f}<extra></extra>',
                        }
                    ]}
                    // Set layout title to 'Income vs Expenses'
                    layout={{ 
                        title: 'Income vs Expenses',
                        paper_bgcolor: '#65bbd7',
                        plot_bgcolor: '#65bbd7',
                        font: {
                            family: 'Arial, sans-serif',
                            size: 14,
                            color: '#131d65'
                        },
                        margin: {
                            l: 20,
                            r: 20,
                            b: 20,
                            t: 40,
                        },
                        showlegend: true,
                        legend: {
                            x: 1,
                            y: 0.5,
                            bgcolor: '#003366',
                            bordercolor: 'black',
                            borderwidth: 1,
                            font: {
                                color: "#d3d6eb"
                            },
                        },
                    }}
                    style = {{ width: '100%', height: '100%' }}
                />
            </div>
        </div>
    );
};

// Define prop types for TransactionPieChart component
TransactionPieChart.propTypes = {
    // Specifies that transactions prop is an array of objects
    transactions: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired, // id property should be a number
            title: PropTypes.string.isRequired, // title property should be a string
            amount: PropTypes.number.isRequired, // amount property should be a number
            trans_type: PropTypes.string.isRequired // trans_type property should be a string
        })
    ).isRequired // transactions prop is required
};

export default TransactionPieChart;