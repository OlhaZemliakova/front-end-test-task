import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppSelector } from "../store/store";
import { useFetchBreedsQuery } from "../services/catsService";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	LineChart,
	Line,
} from "recharts";

const COLORS = [
	"#0088FE",
	"#00C49F",
	"#FFBB28",
	"#FF8042",
	"#8884d8",
	"#82ca9d",
];

interface ChartData {
	name: string;
	value: number;
}

interface LifeSpanData {
	name: string;
	years: number;
}

const HomePage: React.FC = () => {
	const navigate = useNavigate();
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	const { data: cats = [], error, isLoading } = useFetchBreedsQuery();

	const [sortOption, setSortOption] = useState("name");
	const [filterOrigin, setFilterOrigin] = useState("");

	const [adaptabilityData, setAdaptabilityData] = useState<ChartData[]>([]);
	const [affectionData, setAffectionData] = useState<ChartData[]>([]);
	const [originData, setOriginData] = useState<ChartData[]>([]);
	const [indoorData, setIndoorData] = useState<ChartData[]>([]);
	const [lapData, setLapData] = useState<ChartData[]>([]);
	const [lifeSpanData, setLifeSpanData] = useState<LifeSpanData[]>([]);

	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/sign-in");
		}
	}, [isAuthenticated, navigate]);

	useEffect(() => {
		if (!cats.length) return;

		setAdaptabilityData(
			cats.map((cat) => ({
				name: cat.name,
				value: cat.adaptability,
			}))
		);

		setAffectionData(
			cats.map((cat) => ({
				name: cat.name,
				value: cat.affection_level,
			}))
		);

		const originCount = cats.reduce((acc, cat) => {
			const origin = acc.find((o) => o.name === cat.origin);
			if (origin) {
				origin.value += 1;
			} else {
				acc.push({ name: cat.origin || "Unknown", value: 1 });
			}
			return acc;
		}, [] as ChartData[]);

		setOriginData(originCount);

		const indoorCount = cats.reduce(
			(acc, cat) => {
				if (cat.indoor === 1) {
					acc.indoor += 1;
				} else {
					acc.outdoor += 1;
				}
				return acc;
			},
			{ indoor: 0, outdoor: 0 }
		);

		setIndoorData([
			{ name: "Indoor", value: indoorCount.indoor },
			{ name: "Outdoor", value: indoorCount.outdoor },
		]);

		setLapData([
			{ name: "Lap Cat", value: cats.filter((cat) => cat.lap === 1).length },
			{ name: "Not Lap Cat", value: cats.filter((cat) => cat.lap === 0).length },
		]);

		setLifeSpanData(
			cats.map((cat) => ({
				name: cat.name,
				years: parseInt(cat.life_span.split(" ")[0]) || 0,
			}))
		);
	}, [cats]);

	const sortedCats = [...cats].sort((a, b) => {
		if (sortOption === "name") {
			return a.name.localeCompare(b.name);
		} else if (sortOption === "adaptability") {
			return b.adaptability - a.adaptability; // Sort by adaptability descending
		}
		return 0;
	});

	// Filtering logic
	const filteredCats = filterOrigin
		? sortedCats.filter((cat) => cat.origin === filterOrigin)
		: sortedCats;


	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-red-500">Error loading cats data</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-4xl font-bold mb-8">Cat Breeds Statistics</h1>

			{/* Sorting and Filtering UI */}
			<div className="mb-4 flex justify-between">
				<div>
					<label htmlFor="sort" className="mr-2">Sort by:</label>
					<select
						id="sort"
						value={sortOption}
						onChange={(e) => setSortOption(e.target.value)}
						className="border rounded p-1"
					>
						<option value="name">Name</option>
						<option value="adaptability">Adaptability</option>
					</select>
				</div>
				<div>
					<label htmlFor="filter" className="mr-2">Filter by Origin:</label>
					<select
						id="filter"
						value={filterOrigin}
						onChange={(e) => setFilterOrigin(e.target.value)}
						className="border rounded p-1"
					>
						<option value="">All</option>
						{[...new Set(cats.map(cat => cat.origin))].map((origin) => (
							<option key={origin} value={origin}>{origin}</option>
						))}
					</select>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Adaptability Chart */}
				<div className="bg-white p-4 rounded-xl shadow-sm">
					<h2 className="text-xl font-semibold mb-4">Adaptability Distribution</h2>
					<div className="h-[300px]">
						<ResponsiveContainer>
							<BarChart data={adaptabilityData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
								<Bar dataKey="value" fill="#0088FE" />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Affection Levels */}
				<div className="bg-white p-4 rounded-xl shadow-sm">
					<h2 className="text-xl font-semibold mb-4">Affection Levels</h2>
					<div className="h-[300px]">
						<ResponsiveContainer>
							<BarChart data={affectionData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
								<Bar dataKey="value" fill="#00C49F" />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Top Origins */}
				<div className="bg-white p-4 rounded-xl shadow-sm">
					<h2 className="text-xl font-semibold mb-4">Top Origins</h2>
					<div className="h-[300px]">
						<ResponsiveContainer>
							<PieChart>
								<Pie
									data={originData}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
									outerRadius={100}
									label>
									{originData.map((_, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Indoor vs Outdoor Chart */}
				<div className="bg-white p-4 rounded-xl shadow-sm">
					<h2 className="text-xl font-semibold mb-4">Indoor vs Outdoor Preference</h2>
					<div className="h-[300px]">
						<ResponsiveContainer>
							<PieChart>
								<Pie
									data={indoorData}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
									outerRadius={100}
									label>
									{indoorData.map((_, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Lap Cat Distribution */}
				<div className="bg-white p-4 rounded-xl shadow-sm">
					<h2 className="text-xl font-semibold mb-4">Lap Cat Distribution</h2>
					<div className="h-[300px]">
						<ResponsiveContainer>
							<PieChart>
								<Pie
									data={lapData}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
									outerRadius={100}
									label>
									{lapData.map((_, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Life Span Distribution */}
				<div className="bg-white p-4 rounded-xl shadow-sm">
					<h2 className="text-xl font-semibold mb-4">Life Span Distribution</h2>
					<div className="h-[300px]">
						<ResponsiveContainer>
							<LineChart data={lifeSpanData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
								<Line type="monotone" dataKey="years" stroke="#8884d8" />
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>

			{/* Cats Grid */}
			<div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredCats.map((cat) => (
					<div key={cat.id} className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
						<div className="p-4 md:p-6">
							<h3 className="text-xl font-semibold text-gray-800 mb-2">{cat.name}</h3>
							<span className="block mb-1 text-xs font-semibold uppercase text-blue-600">
								Origin: {cat.origin || "Unknown"}
							</span>
							<p className="mt-3 text-gray-500 line-clamp-3">
								{cat.description || "No description available"}
							</p>
							<div className="mt-4 space-y-2">
								<div className="flex justify-between">
									<span>Adaptability:</span>
									<span>{cat.adaptability}/5</span>
								</div>
								<div className="flex justify-between">
									<span>Affection Level:</span>
									<span>{cat.affection_level}/5</span>
								</div>
								<div className="flex justify-between">
									<span>Life Span:</span>
									<span>{cat.life_span}</span>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default HomePage;