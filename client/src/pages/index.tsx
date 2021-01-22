import Head from "next/head";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useSWR from "swr";
// import { GetServerSideProps } from "next";

import { Post, Sub } from "../types";
import PostCard from "../components/PostCard";
import Image from "next/image";
import Link from "next/link";

dayjs.extend(relativeTime);

export default function Home() {
	const { data: posts } = useSWR<Post[]>("/posts");
	const { data: topSubs } = useSWR<Sub[]>("/misc/top-subs");

	return (
		<>
			<Head>
				<title>Reddit: The front page of the internerd.</title>
			</Head>

			<div className="container flex pt-4">
				<div className="w-160">
					{posts?.map((post) => (
						<PostCard key={post.identifier} post={post} />
					))}
				</div>

				<div className="ml-6 w-80">
					<div className="bg-white rounded">
						<div className="p-4 border-b-2">
							<p className="text-lg font-semibold text-center">
								Top Communities
							</p>
						</div>
						<div>
							{topSubs?.map((sub: Sub) => (
								<div className="flex items-center px-4 py-2 text-xs border-b">
									<Link href={`/r/${sub.name}`}>
										<Image
											src={sub.imageUrl}
											className="rounded-full cursor-pointer"
											alt="Sub"
											width={(6 * 16) / 4}
											height={(6 * 16) / 4}
										/>
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
