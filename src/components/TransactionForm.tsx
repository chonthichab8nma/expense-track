import { useTransaction } from "./useTransaction";

export default function TransactionForm() {
  
 
  const { title, setTitle, amount, setAmount, type, setType, handleSave ,date,setDate } = useTransaction();
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-greenbloom rounded-2xl p-8 w-full max-w-md shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-cream">รายรับ-รายจ่าย <span className="text-sm font-normal text-gray-500 bg-pink px-3 py-1 rounded-full">
               วันที่: {date}
            </span></h1>
        
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-medium text-sm">เลือกวันที่</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-gray-50 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 outline-none w-full"
              />
            </div>
            <label>รายการ</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className=" bg-cream p-2 rounded text-green"
              placeholder="ค่าอาหาร"
            />
            
            <label>จำนวนเงิน</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-cream p-2 rounded text-green"
              placeholder="0"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            
            {(["income", "expense", "saving"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`p-2 rounded-xl border ${type === t ? 'bg-pinkbloom text-white' : 'bg-gray-100'}`}
              >
                {t === "income" ? "รายรับ" : t === "expense" ? "รายจ่าย" : "เงินออม"}
              </button>
            ))}
          </div>

          <button type="submit" className="w-full bg-pink text-brown p-3 rounded-xl mt-4">
            บันทึก
          </button>
        </form>
      </div>
    </div>
  );
}