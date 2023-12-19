function LoanInfo({ loanRecords, onPayLoan }) {
  return (
    <div className="loanBox">
      {loanRecords.length > 0 &&
        loanRecords.map((record) => (
          <div className="perLoan" key={record.id}>
            <p>
              The loan purpose is <strong>{record.purpose}</strong> with a total
              of <strong>${record.amount}</strong>
            </p>
            <button
              className="payloan"
              onClick={() => onPayLoan(record.amount, record.purpose)}
            >
              Pay loan
            </button>
          </div>
        ))}
    </div>
  );
}

export default LoanInfo;
