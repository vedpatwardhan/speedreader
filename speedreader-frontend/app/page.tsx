import Body from "@/components/Body";

const Page = async ({ searchParams }: { searchParams: Promise<{ name?: string }> }) => {
	const name = (await searchParams).name;

	return (
		<div className="h-[100vh] w-full flex flex-col">
			<Body name={name} />
		</div>
	);
}

export default Page;
