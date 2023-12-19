export const accountInitialState = {
  balance: 0,
  loan: 0,
  isActive: false,
  loanRecords: [],
};

export function accountReducer(state, action) {
  switch (action.type) {
    case "openAccount":
      return {
        ...state,
        isActive: true,
        balance: 500,
      };

    case "deposit":
      return { ...state, balance: state.balance + action.payload };

    case "withdraw":
      return {
        ...state,
        balance:
          state.balance > 0 ? state.balance - action.payload : state.balance,
      };

    case "requestLoan":
      const { value, purpose } = action.payload;
      const newLoan = {
        id: Date.now(),
        amount: value,
        purpose,
      };

      const updatedLoanRecords = [...state.loanRecords, newLoan];

      return {
        ...state,
        loan: state.loan + value,
        balance: state.balance + value,
        loanRecords: updatedLoanRecords,
      };

    case "payLoan":
      const { amount, deletePurpose } = action.payload;

      const deleteLoanRecords = state.loanRecords.filter(
        (record) =>
          !(record.amount === amount && record.purpose === deletePurpose)
      );

      return {
        ...state,
        loan: state.loan - amount,
        balance: state.balance - amount,
        loanRecords: deleteLoanRecords,
      };

    case "closeAccount":
      return { ...accountInitialState, isActive: false };

    default:
      throw new Error("Cannot prrocess");
  }
}
