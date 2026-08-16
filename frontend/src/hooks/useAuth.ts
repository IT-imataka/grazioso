import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function useAuth() {
	const navigate = useNavigate();
	
	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.log("ログアウトに失敗しました", error.message);
			return;
		}

		navigate("/login");
	}
	return { handleLogout };
}