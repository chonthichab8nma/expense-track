import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import type { Transaction, TransactionType } from "./useTransaction";

interface FormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Transaction) => void;
}

export function TransactionForm({ isOpen, onClose, onSave }: FormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("income");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    onSave({
      id: Date.now(),
      title,
      amount: Number(amount),
      type,
      date,
    });

    setTitle("");
    setAmount("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm bg-cream rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 bg-cream">
          <h3 className="text-pinkold font-semibold flex items-center gap-2">
            <Plus size={18} />
            เพิ่มรายการใหม่
          </h3>
          <button onClick={onClose} className="text-pinkold hover:opacity-80">
            <X />
          </button>
        </div>

        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
         
          <div>
            <label className="block text-sm text-gray-600 mb-1">รายการ</label>
            <input
              placeholder="ค่าอาหาร"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl bg-white px-4 py-2 focus:ring-2 focus:ring-pink outline-none"
            />
          </div>

          {/* Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
            <label className="block text-sm text-gray-600 mb-1">
              จำนวนเงิน
            </label>
            <input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl bg-white px-4 py-2 focus:ring-2 focus:ring-pink outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">วันที่</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl bg-white px-4 py-2 focus:ring-2 focus:ring-pink outline-none"
            />
          </div>
          </div>

          
          <div className="grid grid-cols-3 gap-3">
            {(["income", "expense", "saving"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`rounded-xl py-2 text-sm font-medium transition
                  ${
                    type === t
                      ? "bg-pinkold text-white shadow"
                      : "bg-pink text-white"
                  }`}
              >
                {t === "income"
                  ? "รายรับ"
                  : t === "expense"
                  ? "รายจ่าย"
                  : "เงินออม"}
              </button>
            ))}
          </div>

        
          <button
            type="submit"
            className="w-full bg-green text-white py-3 rounded-2xl font-semibold hover:opacity-90 transition"
          >
            บันทึก
          </button>
        </form>
      </div>
    </div>
  );
}
