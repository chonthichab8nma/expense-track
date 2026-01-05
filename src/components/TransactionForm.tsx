import React, { useState } from "react";
import { Plus, X, CalendarDays } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
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
  const [showCalendar, setShowCalendar] = useState(false);

  const formatDate = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const d = new Date(date.getTime() - offset * 60 * 1000);
    return d.toISOString().split("T")[0];
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-pink/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm bg-cream  rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="flex items-center justify-between px-5 py-4 bg-cream">
          <h3 className="text-black font-semibold flex items-center gap-2">
            <Plus size={18} />
            เพิ่มรายการใหม่
          </h3>
          <button onClick={onClose} className="text-black hover:opacity-80">
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

            <div className="relative">
              <label className="block text-sm text-gray-600 mb-1">วันที่</label>
              <button
                type="button"
                onClick={() => setShowCalendar((p) => !p)}
                className="flex items-center justify-between w-full rounded-xl border border-pink px-3 py-2 bg-white text-sm transition-colors"
              >
                <span className="font-medium">{date}</span>
                <CalendarDays size={16} className="text-pinkold" />
              </button>
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
                      ? "bg-pinkold text-white"
                      : "bg-pink text-greenold"
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
            className="w-full bg-green text-greenold py-3 rounded-2xl font-semibold hover:opacity-90 transition"
          >
            บันทึก
          </button>
        </form>

        {showCalendar && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 rounded-3xl ">
            <div className="bg-pink p-4 rounded-2xl shadow-2xl w-86">
              <Calendar
                onChange={(d) => {
                  setDate(formatDate(d as Date));
                  setShowCalendar(false);
                }}
                value={new Date(date)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
