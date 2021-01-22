import Head from "next/head";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useSWR, { useSWRInfinite } from "swr";
// import { GetServerSideProps } from "next";

import { Post, Sub } from "../types";
import PostCard from "../components/PostCard";
import Image from "next/image";
import Link from "next/link";

import { useAuthState } from "../context/auth";
import { useEffect, useState } from "react";

dayjs.extend(relativeTime);

export default function Home() {
	const description =
		"Reddit is a network of communities based on people's interests. Find communities you're interested in, and become part of an online community!";
	const title = "Reddit: The front page of the internerd.";

	const [observedPost, setObservedPost] = useState("");
	// const { data: posts } = useSWR<Post[]>("/posts");
	const { data: topSubs } = useSWR<Sub[]>("/misc/top-subs");

	const { authenticated } = useAuthState();

	const {
		data,
		error,
		size: page,
		setSize: setPage,
		isValidating,
		revalidate,
	} = useSWRInfinite((index) => `/posts?page=${index}`);

	const isInitialLoading = !data && !error;

	const posts: Post[] = data ? [].concat(...data) : [];

	useEffect(() => {
		if (!posts || posts.length === 0) return;

		const id = posts[posts.length - 1].identifier;

		if (id !== observedPost) {
			setObservedPost(id);
			observeElement(document.getElementById(id));
		}
	}, [posts]);

	const observeElement = (element: HTMLElement) => {
		if (!element) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setPage(page + 1);
					observer.unobserve(element);
				}
			},
			{ threshold: 1 }
		);
		observer.observe(element);
	};

	return (
		<>
			<Head>
				<title>{title}</title>
				<meta name="description" content={description} />
				<meta property="og:description" content={description} />
				<meta property="og:title" content={title} />
				<meta property="twitter:description" content={description} />
				<meta property="twitter:title" content={title} />
			</Head>

			<div className="container flex pt-4">
				<div className="w-full px-4 md:w-160 md:p-0">
					{isInitialLoading && (
						<p className="text-lg text-center">Loading...</p>
					)}
					{posts?.map((post) => (
						<PostCard
							key={post.identifier}
							post={post}
							revalidate={revalidate}
						/>
					))}
					{isInitialLoading && posts.length > 0 && (
						<p className="text-lg text-center">Loading more...</p>
					)}
				</div>

				<div className="hidden ml-6 md:block w-80">
					<div className="bg-white rounded">
						<div className="p-4 border-b-2">
							<p className="text-lg font-semibold text-center">
								Top Communities
							</p>
						</div>
						<div>
							{topSubs?.map((sub) => (
								<div
									key={sub.name}
									className="flex items-center px-4 py-2 text-xs border-b"
								>
									<Link href={`/r/${sub.name}`}>
										<a>
											<Image
												src={sub.imageUrl}
												className="rounded-full cursor-pointer"
												alt="Sub"
												width={(6 * 16) / 4}
												height={(6 * 16) / 4}
											/>
										</a>
									</Link>
									<Link href={`/r/${sub.name}`}>
										<a className="ml-2 font-bold hover:cursor-pointer">
											/r/{sub.name}
										</a>
									</Link>
									<p className="ml-auto font-med">
										{sub.postCount}
									</p>
								</div>
							))}
						</div>

						{authenticated && (
							<div className="p-4 border-t-2">
								<Link href="/subs/create">
									<a className="w-full px-2 py-1 blue button">
										Create Community
									</a>
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

// Server side render
// export const getServerSideProps: GetServerSideProps = async (_) => {
// 	try {
// 		const response = await axios.get("/posts");

// 		return { props: { posts: response.data } };
// 	} catch (error) {
// 		return { props: { error: "Something went wrong." } };
// 	}
// };
