import { useReducer, useState } from "react";
import Header from "./components/Header";
import { accountInitialState, accountReducer } from "./features/accountReducer";
import Balance from "./components/Balance";
import LoanInfo from "./components/LoanInfo";
import AlertNotice from "./components/AlertNotice";

/* 
Instruction
- Open account and receive 500 to the balance
- can request loan 1 time (if there no loan)
  but if the account has exist loan balance, cannot request new loan until pay loan
- can close account when no balance and no loan
*/

export default function App() {
  const [{ balance, loan, isActive, loanRecords }, dispatch] = useReducer(
    accountReducer,
    accountInitialState
  );

  const [value, setValue] = useState("");
  const [purpose, setPurpose] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [alert, setAlert] = useState("");

  const maxLoan = 2000;

  function deposit(value) {
    if (!value) return alertMessage("Please input the amount to deposit");
    dispatch({ type: "deposit", payload: Number(value) });
    setValue("");
  }

  function withdraw(value) {
    if (!value) return alertMessage("Please input the amount to withdraw");
    if (!balance) return alertMessage("Your account has no money");
    if (balance - value < loan)
      return alertMessage(
        "Insufficient funds due to existing loan. Please repay the loan first."
      );
    dispatch({ type: "withdraw", payload: Number(value) });
    setValue("");
  }

  function requestLoan(value, purpose) {
    if (!value || !purpose)
      return alertMessage(
        "Please input amount and purpose to request the loan"
      );

    if (loan + value > maxLoan)
      return alertMessage(
        `Sorry, the requested amount exceeds the maximum loan limit.`
      );
    dispatch({ type: "requestLoan", payload: { value, purpose } });
    console.log(value);
    console.log(purpose);

    setValue("");
    setShowInput(false);
    setPurpose("");
  }

  function payLoan(value, purpose) {
    const amount = Number(value);
    const deletePurpose = purpose;
    // if (!value) return alertMessage("Please input the amount to pay loan");
    // if (!loan) return alertMessage("Your account has no loan");
    // if (value > loan)
    //   return alertMessage(
    //     "The amount exceeds your current loan balance, please enter a lower amount."
    //   );
    dispatch({ type: "payLoan", payload: { amount, deletePurpose } });
    setValue("");
  }

  function handleToggle() {
    setShowInput(!showInput);
    setValue("");
    setPurpose("");
  }

  function alertMessage(message) {
    setAlert(message);
    setTimeout(() => {
      setAlert("");
    }, 3000);
  }

  return (
    <div className="container">
      <Header message={alert} />

      <aside>{alert && <AlertNotice message={alert} />}</aside>

      <div className="displayBox">
        {isActive ? (
          <Balance balance={balance} loan={loan} maxLoan={maxLoan} />
        ) : (
          <div className="pre-open">
            <button onClick={() => dispatch({ type: "openAccount" })}>
              Open account
            </button>
            <h3>🎉 Open an account today and receive $500! 🎉</h3>
          </div>
        )}

        {balance === 0 && loan === 0 ? (
          <button
            onClick={() => dispatch({ type: "closeAccount" })}
            style={{ display: isActive ? "block" : "none" }}
          >
            Close account
          </button>
        ) : (
          <button
            className="custom-button"
            data-title="Your balance and loan must be 0 before close the account"
            disabled
          >
            Close account
          </button>
        )}

        {/* show everything when active account */}
        {isActive ? (
          <div className="content">
            <input
              type="number"
              value={value === 0 ? "" : value}
              onChange={(e) => setValue(Number(e.target.value))}
              placeholder="amount..."
            />
            {showInput && (
              <div className="miniBox">
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="your loan purpose..."
                />
                <button onClick={() => requestLoan(value, purpose)}>
                  Submit loan
                </button>
              </div>
            )}

            <div className="miniBox">
              <button onClick={() => deposit(value)} disabled={showInput}>
                Deposit
              </button>
              <button onClick={() => withdraw(value)} disabled={showInput}>
                Withdraw
              </button>
            </div>

            {loan === maxLoan ? (
              <button
                className="custom-button"
                disabled
                data-title="You've reached your maximum loan limit. Please repay the existing loan before requesting a new one."
              >
                Request a loan
              </button>
            ) : (
              <button onClick={handleToggle}>
                {showInput ? "Close request" : "Request a loan"}
              </button>
            )}

            <LoanInfo
              loan={loan}
              loanRecords={loanRecords}
              onPayLoan={payLoan}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
