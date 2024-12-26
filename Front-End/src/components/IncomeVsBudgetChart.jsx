import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';

const IncomeVsBudgetChart = ({ transactions, savingLimit }) => {
    const [totalIncome, setTotalIncome] = useState(0);


    useEffect(() => {
        if (transactions && transactions.length > 0) {
            const income = transactions
                .filter(t => t.trans_type === 'income')
                .reduce((sum, t) => sum + Number(t.amount), 0);
                console.log('Total income:', income);
                console.log('Saving limit:', savingLimit);

            setTotalIncome(income);
        }
    }, [transactions, savingLimit]);

    return (
        <Plot
            data={[
                {
                    x: ['Income', 'Saving Limit'],
                    y: [totalIncome, savingLimit],
                    type: 'bar',
                    marker: { color: ['#035AFC', '#0A7827'] }
                }
            ]}

            layout={{ title: 'Income vs Saving Limit' }}
        />
    );
};

IncomeVsBudgetChart.propTypes = {
    transactions: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            amount: PropTypes.number.isRequired,
            trans_type: PropTypes
        })
    ).isRequired,
    savingLimit: PropTypes.number.isRequired
};

export default IncomeVsBudgetChart;