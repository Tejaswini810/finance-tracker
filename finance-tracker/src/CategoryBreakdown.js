function CategoryBreakdown({ transactions }) {
  const expenses = transactions.filter(
    transaction => transaction.type === "Expense"
  );

  const categoryBreakdown = expenses.reduce((acc, transaction) => {
    const category = transaction.category;

    if (!acc[category]) {
      acc[category] = 0;
    }

    acc[category] += transaction.amount;

    return acc;
  }, {});

  return (
    <div>
      <h2>Category Breakdown</h2>

      {Object.entries(categoryBreakdown).map(([category, total]) => (
        <p key={category}>
          {category}: ${total}
        </p>
      ))}
    </div>
  );
}

export default CategoryBreakdown;