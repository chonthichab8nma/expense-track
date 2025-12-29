import { useState } from "react";
import {
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  PiggyBank,
  Trash2,
  CalendarDays,
  X,
} from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { useTransaction } from "./useTransaction";
import { TransactionForm } from "./TransactionForm";

type FilterType = "all" | "income" | "expense" | "saving";
type PeriodType = "day" | "month" | "year";

export default function Dashboard() {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    balance,
    totalIncome,
    totalExpense,
    totalSaving,
  } = useTransaction();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");

  const [enablePeriodFilter, setEnablePeriodFilter] = useState(false);
  const [period, setPeriod] = useState<PeriodType>("month");

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [showCalendar, setShowCalendar] = useState(false);

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "ทั้งหมด" },
    { key: "income", label: "รายรับ" },
    { key: "expense", label: "รายจ่าย" },
    { key: "saving", label: "ออม" },
  ];

  const formatDate = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const d = new Date(date.getTime() - offset * 60 * 1000);
    return d.toISOString().split("T")[0];
  };

  const togglePeriod = () => {
    console.log("togglePeriod", !enablePeriodFilter);
    // return;
    if (!enablePeriodFilter) {
      setEnablePeriodFilter(true);
      setPeriod("month");
    } else {
      if (period === "month") setPeriod("year");
      else if (period === "year") setPeriod("day");
      else {
        setEnablePeriodFilter(false);
        setPeriod("month");
      }
    }
  };

  const filterByPeriod = (t: (typeof transactions)[number]) => {
    if (!enablePeriodFilter) {
      return true;
    }

    const d = new Date(t.date);
    const tYear = d.getFullYear();
    const tMonth = d.getMonth() + 1;

    // if (period === "year") {
    //   return tYear === selectedYear;
    // }

    // if (period === "month") {
    //   return tYear === selectedYear && tMonth === selectedMonth;
    // }

    // if (period === "day") {
    //   return t.date === selectedDate;
    // }

    // return true;

    switch (period) {
      case "year":
        return tYear === selectedYear;
      case "month":
        return tYear === selectedYear && tMonth === selectedMonth;
      case "day":
        return t.date === selectedDate;

        default: 
        return true;
    }
  };

  const filteredTransactions = transactions
    .filter((t) => (filter === "all" ? true : t.type === filter))
    .filter(filterByPeriod);

  const totalByFilter = filteredTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-24 font-sans text-slate-900">
      <div className="max-w-md mx-auto">
        <div className="bg-indigo-600 text-white p-6 rounded-3xl mb-4 shadow-lg shadow-indigo-200">
          <p className="text-sm opacity-80 mb-1">ยอดคงเหลือสุทธิ</p>
          <h1 className="text-4xl font-bold mb-6">
            ฿{balance.toLocaleString()}
          </h1>

          <div className="grid grid-cols-3 gap-2 text-sm bg-indigo-700/30 p-3 rounded-2xl backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <span className="flex items-center gap-1 opacity-80 mb-1">
                <ArrowUpCircle size={14} /> รับ
              </span>
              <span className="font-semibold">
                {totalIncome.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col items-center border-l border-white/10">
              <span className="flex items-center gap-1 opacity-80 mb-1">
                <ArrowDownCircle size={14} /> จ่าย
              </span>
              <span className="font-semibold">
                {totalExpense.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col items-center border-l border-white/10">
              <span className="flex items-center gap-1 opacity-80 mb-1">
                <PiggyBank size={14} /> ออม
              </span>
              <span className="font-semibold">
                {totalSaving.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={togglePeriod}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all shadow-sm ${
              enablePeriodFilter
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <CalendarDays size={18} />
            {enablePeriodFilter && (
              <span className="text-xs font-bold uppercase tracking-wide">
                {period === "day"
                  ? "รายวัน"
                  : period === "month"
                  ? "รายเดือน"
                  : "รายปี"}
              </span>
            )}
          </button>
          <div className="grid grid-cols-4 gap-2 flex-1">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`py-2 rounded-xl border text-xs font-medium transition-all shadow-sm ${
                  filter === f.key
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        {enablePeriodFilter && (
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm mb-4 animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="flex gap-2">
              {(period === "year" || period === "month") && (
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {[2023, 2024, 2025].map((y) => (
                    <option key={y} value={y}>
                      ปี {y}
                    </option>
                  ))}
                </select>
              )}
              {period === "month" && (
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      เดือน {m}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {period === "day" && (
              <div className="relative">
                <button
                  onClick={() => setShowCalendar((p) => !p)}
                  className="flex items-center justify-between w-full rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 text-sm hover:bg-slate-100 transition-colors"
                >
                  <span className="font-medium">วันที่: {selectedDate}</span>
                  {showCalendar ? (
                    <X size={16} />
                  ) : (
                    <CalendarDays size={16} className="text-indigo-600" />
                  )}
                </button>

                {showCalendar && (
                  <div className="absolute top-full left-0 z-20 mt-2 w-full shadow-xl rounded-2xl border border-slate-200 overflow-hidden">
                    <Calendar
                      onChange={(date) => {
                        setSelectedDate(formatDate(date as Date));
                        setShowCalendar(false);
                      }}
                      value={new Date(selectedDate)}
                      className="border-none w-full"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <p>ไม่มีรายการ</p>
            </div>
          ) : (
            filteredTransactions.map((t) => (
              <div
                key={t.id}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      t.type === "income"
                        ? "bg-green-100 text-green-600"
                        : t.type === "expense"
                        ? "bg-red-100 text-red-600"
                        : "bg-indigo-100 text-indigo-600"
                    }`}
                  >
                    {t.type === "income" && <ArrowUpCircle size={20} />}
                    {t.type === "expense" && <ArrowDownCircle size={20} />}
                    {t.type === "saving" && <PiggyBank size={20} />}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{t.title}</div>
                    <div className="text-xs text-slate-400 font-medium">
                      {t.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-bold text-lg ${
                      t.type === "income"
                        ? "text-green-600"
                        : t.type === "expense"
                        ? "text-red-600"
                        : "text-indigo-600"
                    }`}
                  >
                    {t.type === "expense" ? "-" : "+"}
                    {t.amount.toLocaleString()}
                  </span>

                  <button
                    onClick={() => deleteTransaction(t.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {filteredTransactions.length > 0 && (
          <div className="mt-6 text-center">
            <div className="inline-block px-4 py-2 bg-slate-200 rounded-full text-sm font-bold text-slate-600">
              ยอดรวมตามตัวกรอง: ฿{totalByFilter.toLocaleString()}
            </div>
          </div>
        )}

        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-300 transition-all hover:scale-110 active:scale-95 z-30"
        >
          <Plus size={28} />
        </button>

        <TransactionForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={addTransaction}
        />
      </div>
    </div>
  );
}
