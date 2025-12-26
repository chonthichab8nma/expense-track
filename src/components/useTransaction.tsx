import {useState} from "react";
export type TransactionType = "income" | "expense" | "saving";

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: TransactionType;
  date: string;
}

export function useTransaction() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("income");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const resetForm = () => {
    setTitle("");
    setAmount("");
    setType("income");
    setDate(new Date().toISOString().split('T')[0]);
  };
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const newEntry: Transaction = {
      id: Date.now(),
      title,
      amount: Number(amount),
      type,
      date,
    };

    setTransactions([newEntry, ...transactions]); 
    resetForm();

    console.log("บันทึก:", newEntry);
    resetForm();
    alert("บันทึกสำเร็จ!");
  };
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSaving = transactions
    .filter(t => t.type === "saving")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense; // ยอดคงเหลือ

  return {
    transactions, 
    balance, totalIncome, totalExpense, totalSaving,
    // handleSave,
    title, setTitle,
    amount, setAmount,
    type, setType,
    date,setDate,
    handleSave
  };
}