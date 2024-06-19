// import { FC, useState } from "react";
// import { MdKeyboardArrowDown } from "react-icons/md";

// import AccountListCard from "./AccountListCard";
// import NavHistory from "../NavHistory";

// const AccountHistory: FC = () => {
//   const [sortOpen, setSortOpen] = useState(false);
//   const [eventOpen, setEventOpen] = useState(false);
//   return (
//     <div className="w-full">
//       <NavHistory sortOpen={sortOpen} setSortOpen={setSortOpen} />
//       <div className="flex mt-6 w-full ">
//         <div className="w-[300px]  h-full pr-4">
//           <button
//             className="flex justify-between items-center h-12 px-[10px] w-full font-semibold outline-none hover:bg-[#F5F5F5] rounded-[10px]"
//             onClick={() => setEventOpen(!eventOpen)}
//           >
//             <span>Event Type</span>
//             <MdKeyboardArrowDown
//               size={24}
//               className={`duration-200 ${eventOpen && "rotate-180"}`}
//             />{" "}
//           </button>
//         </div>
//         <div className="w-full">
//           <div className="flex justify-between p-4 text-[#545454] border-b border-[#E2E2E2] ">
//             <div className="w-[140px]"></div>
//             <div className="w-[228px]">Item</div>
//             <div className="w-[87px] text-end">Price</div>
//             <div className="w-[76px] text-end">From</div>
//             <div className="w-[76px] text-end">To</div>
//             <div className="w-[76px] text-end">Time</div>
//           </div>
//           <AccountListCard />
//           <AccountListCard />
//           <AccountListCard />
//           <AccountListCard />
//           <AccountListCard />
//           <AccountListCard />
//           <AccountListCard />
//           <AccountListCard />
//           <AccountListCard />
//           <AccountListCard />
//           <AccountListCard />
//           <AccountListCard />
//           <AccountListCard />
//           <AccountListCard />
//           <AccountListCard />
//           <AccountListCard />
//           <AccountListCard />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccountHistory;
