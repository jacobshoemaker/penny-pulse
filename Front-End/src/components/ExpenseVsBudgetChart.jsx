import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';

const ExpenseVsBudgetChart = ({ transactions, spendingLimit }) => {
    const [totalExpenses, setTotalExpenses] = useState(0);

    useEffect(() => {
        if (transactions && transactions.length > 0) {
            const expenses = transactions
                .filter(t => t.trans_type === 'expense')
                .reduce((sum, t) => sum + Number(t.amount), 0);
            
                console.log('Total expenses:', expenses);
                console.log('Spending limit:', spendingLimit);

            setTotalExpenses(expenses);
        }
    }, [transactions, spendingLimit]);

    return (
        <Plot
            data={[
                {
                    x: ['Expenses', 'Spending Limit'],
                    y: [totalExpenses, spendingLimit],
                    type: 'bar',
                    marker: { color: ['#035AFC', '#FC6F03'] }
                }
            ]}
            layout={{ title: 'Expenses vs Spending Limit' }}
        />
    );
};

ExpenseVsBudgetChart.propTypes = {
    transactions: PropTypes.arrayOf(
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