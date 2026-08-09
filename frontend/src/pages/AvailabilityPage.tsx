"use client";

import CalendarView from "../components/CalendarView";
import useReservations from "../hooks/useReservations";
import AvailabilityTable from "../components/AvailabilityTable";


export default function AvailabilityPage () {

    return (
        <div className="bg-[#2A1D17]">
            <div className="text-center pt-20">
                <h1 className="">
                <img src="/Availaibility.png" alt="Grazioso Logo" className="inline-block h-hull w-40" />
                </h1>
                <span className="text-[#D5BA7A] text-[14px] tracking-[0.17em] font-cormorant inline-block pb-14 mt-5">AVAILABILITY</span>
            </div>
        <section className="h-auto lg:h-full !flex flex-col min-w-0 shrink-0">
              <div className="flex-1 h-full w-full">
                <AvailabilityTable
                />
              </div>
        </section>
        </div>
    )
}