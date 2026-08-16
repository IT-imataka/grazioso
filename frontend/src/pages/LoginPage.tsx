import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function LoginPage(){
	const [email,setEmail] = useState("");
	const [password,setPassword] = useState("");
	const [loading,setLoading] = useState(false);
	const [error,setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		// Supabase Authのログイン処理
		const { error } = await supabase.auth.signInWithPassword({
			email,password
		})

		if (error) {
			setError("ログインに失敗しました。メールアドレスまたはパスワードを確認してください。")
			setLoading(false)
		} else {
			// ログイン成功でリダイレクト
			navigate("/dashboard");
		}
	}

	return (
		<div className="bg-[#2A1D17]">
			<div className="max-w-lg mx-auto min-h-screen grid place-items-center text-[#D5BA7A] px-4">
				<div className="-full max-w-sm bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/10">
					<h1 className="text-xl font-bold text-center mb-6 tracking-wider">ログイン</h1>
					{error && (
						<div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-xs text-red-200">
							{error}
						</div>
					)}
					<form onSubmit={handleLogin} className="space-y-4">

						<div className="mb-6">
							<label className="block text-xs mb-3 text-white/80">メールアドレス</label>
							<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#D5BA7A]"
							placeholder="admin@example.com"
							/>
						</div>

						<div className="mb-6">
							<label className="block text-xs mb-3 text-white/80">パスワード</label>
							<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#D5BA7A]"
							placeholder="••••••••"
							/>
						</div>

						<button
						type="submit"
						disabled={loading}
						className="w-full py-2.5 mt-2 bg-[#D5BA7A] text-[#2A1D17] font-bold rounded-lg hover:bg-[#e2c888] transition-colors disabled:opacity-50"
						>
							{loading ? "ログイン中……" : "ログイン"}
						</button>
					</form>
				</div>
			</div>
		</div>
	)

}