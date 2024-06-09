
function filterExpensesByCategory(expenseList, category)
{
    if (category === 'All')
    {
        return expenseList;
    }
    const categoryExpenses = []
    for (i in expenseList)
    {
        expense = expenseList[i];
        if (expense["category"] === category)
        {
            categoryExpenses.push(expense);
        }
    }
    
    return categoryExpenses;
}

export { filterExpensesByCategory };
