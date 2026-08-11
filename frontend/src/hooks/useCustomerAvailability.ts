"use client"

import { useEffect,useState } from "react";
import { fetchRevCustomer } from "../api/reservationApi";
import { type Reservation } from "../api/reservationApi";

export default function useCustomerAvailability (currentWeekStart: Date) {
	const [availability,setAvailability] = useState<Reservation[]>([]);

	// 空き状況表示
	useEffect (() => {
		const loadData = async () => {
			try{
				const data = await fetchRevCustomer();
				setAvailability(data);
			} catch (error){
				console.error("データ取得エラー",error);
				throw error;
			}
		}
		loadData();
	},[currentWeekStart])

	return{availability};
}
