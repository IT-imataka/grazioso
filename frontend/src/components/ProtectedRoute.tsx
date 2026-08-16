import { Navigate,Outlet } from "react-router-dom";
import { useEffect,useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { type Session } from "@supabase/supabase-js";

export const ProtectedRoute = () => {
	const [session,setSession] = useState<Session | null>(null);
	const [loading,setLoading] = useState(true);
	
	useEffect(() => {
		// 読み込み時のセッション確認
		supabase.auth.getSession().then(({ data: {session} }) => {
			setSession(session);
			setLoading(false);
		})

		// 認証状態の変化を監視
		const {data : {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		})

		return () => subscription.unsubscribe();
	},[]);

	if (loading) {
		return <div>読み込み中……</div>
	}

	// 
	return session ? <Outlet/> : <Navigate to={"/login"}/>
}