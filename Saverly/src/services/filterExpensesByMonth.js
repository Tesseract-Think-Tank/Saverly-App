function filterExpensesByMonth(expenseList, month) {
    if (month === 'All') {
      return expenseList;
    }
  
    return expenseList.filter(expense => {
      const date = new Date(expense.dateAndTime.seconds * 1000);
      const expenseMonth = date.toLocaleString('default', { month: 'long' });
      return expenseMonth === month;
    });
  }
export { filterExpensesByMonth };
