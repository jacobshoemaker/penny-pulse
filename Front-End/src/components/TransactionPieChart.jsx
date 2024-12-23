import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';

const TransactionPieChart = ({ transactions }) => {
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);

    useEffect(() => {
        const income = transactions
            .filter(t => t.trans_type === 'income')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const expenses = transactions
            .filter(t => t.trans_type === 'expense')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        setTotalIncome(income);
        setTotalExpenses(expenses);
    }, [transactions]);

    return (
        <Plot
            data={[
                {
                    values: [totalIncome, totalExpenses],
                    labels: ['Income', 'Expenses'],
                    type: 'pie'
                }
            ]}
            layout={{ title: 'Income vs Expenses' }}
        />
    );
};

TransactionPieChart.propTypes = {
    transactions: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            amount: PropTypes.number.isRequired,
            trans_type: PropTypes.string.isRequired
        })
    ).isRequired
};

export default TransactionPieChart;