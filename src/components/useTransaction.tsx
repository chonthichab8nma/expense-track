import { useState,useEffect } from "react";



export type TransactionType = "income" | "expense" | "saving";

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: TransactionType;
  date: string;
}

export function useTransaction() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [
       {
      id: 1,
      title: "ยอดยกมา",
      amount: 5000,
      type: "income",
      date: "2023-10-01",
    },
    ];
  });
   useEffect(() => {
  localStorage.setItem("transactions",JSON.stringify(transactions));
},[transactions])

    
  const addTransaction = (tx: Transaction) => {
    setTransactions((prev) => [tx, ...prev]);
  };

  const deleteTransaction = (id: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSaving = transactions
    .filter((t) => t.type === "saving")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense - totalSaving;

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    totalIncome,
    totalExpense,
    totalSaving,
    balance,
  };
}
