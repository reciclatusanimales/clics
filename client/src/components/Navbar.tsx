import Link from "next/link";
import RedditLogo from "../images/reddit.svg";

import { useAuthState, useAuthDispatch } from "../context/auth";
import axios from "axios";
import { useEffect, useState } from "react";
import { Sub } from "../types";
import Image from "next/image";
import { useRouter } from "next/router";

const Navbar: React.FC = () => {
	const [search, setSearch] = useState("");
	const [subs, setSubs] = useState<Sub[]>([]);
	const [timer, setTimer] = useState(null);

	const { authenticated, loading } = useAuthState();
	const dispatch = useAuthDispatch();

	const router = useRouter();

	const handleLogout = () => {
		axios
			.get("/auth/logout")
			.then(() => {
				dispatch("LOGOUT");
				window.location.reload();
			})
			.catch((error) => console.error(error));
	};

	useEffect(() => {
		if (search.trim() === "") {
			setSubs([]);
			return;
		}
		searchSubs();
	}, [search]);

	const searchSubs = async () => {
		clearTimeout(timer);
		setTimer(
			setTimeout(async () => {
				try {
					const { data } = await axios.get(`/subs/search/${search}`);
					setSubs(data);
				} catch (error) {
					console.error(error);
				}
			}, 250)
		);
	};

	const goToSub = (subName: string) => {
		router.push(`/r/${subName}`);
		setSearch("");
	};

	return (
		<div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white">
			<div className="flex items-center">
				<Link href="/">
					<a>
						<RedditLogo className="w-8 h-8 mr-2 outline-none" />
					</a>
				</Link>

				<span className="text-2xl font-semibold">
					<Link href="/">reddit</Link>
				</span>
			</div>

			<div className="relative flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-200 hover:bg-white">
				<i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
				<input
					type="text"
					className="py-1 pr-3 rounded focus:outline-none w-160"
					placeholder="Search"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<div
					className="absolute left-0 right-0 bg-white"
					style={{ top: "100%" }}
				>
					{subs?.map((sub) => (
						<div
							className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200"
							onClick={() => goToSub(sub.name)}
						>
							<Image
								src={sub.imageUrl}
								alt="Sub"
								height={(8 * 16) / 4}
								width={(8 * 16) / 4}
								className="rounded-full"
							/>
							<div className="ml-4 text-sm">
								<p className="font-medium">{sub.name}</p>
								<p className="text-gray-600">{sub.title}</p>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="flex">
				{!loading &&
					(authenticated ? (
						<button
							className="mr-4 hollow blue button"
							onClick={handleLogout}
						>
							log out
						</button>
					) : (
						<>
							<Link href="/login">
								<a className="mr-4 hollow blue button">
									log in
								</a>
							</Link>

							<Link href="/register">
								<a className="blue button">sign up</a>
							</Link>
						</>
					))}
			</div>
		</div>
	);
};

export default Navbar;
