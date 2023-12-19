function Balance({ balance, loan, maxLoan }) {
  return (
    <div className="account">
      <p>Balance: ${balance}</p>
      <p>
        Loan: ${loan} / ${maxLoan}
      </p>
    </div>
  );
}

export default Balance;
