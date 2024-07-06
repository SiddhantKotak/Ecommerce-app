import React, { useContext, useEffect } from "react";
import { useCart } from "../hooks/useCart";
import Loading from "../components/Loading";
import CartItemCard from "../components/CartItemCard";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { AppContext, Context } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Cart: React.FC = () => {
	const BACKEND_URL = import.meta.env.VITE_DATABASE_URL;
	const { cartItems, orderDetails } = useCart();

	const navigate = useNavigate();
	const { loggedIn } = useContext(AppContext) as Context;

	useEffect(() => {
		if (!loggedIn) navigate("/");
	}, []);

	async function handleRemove(id: string) {
		try {
			const res = await axios.delete(`${BACKEND_URL}/api/v1/cart/removeItem`, {
				headers: {
					Authorization: localStorage.getItem("token"),
				},
				data: {
					id: id,
				},
			});

			if (res.status == 200) {
				toast("Item removed from cart successfully!", {
					icon: "✅",
					style: {
						borderRadius: "10px",
						background: "#333",
						color: "#fff",
					},
				});
				setTimeout(() => {
					window.location.reload();
				}, 700);
			} else {
				toast((t) => (
					<div className="flex justify-between bg-red-700 text-white p-4 rounded-md shadow-lg -mx-5 -my-3 w-96">
						<span className="font-bold">Error while removing item</span>
						<button
							className="ml-2 text-red-500"
							onClick={() => {
								toast.dismiss(t.id);
							}}
						>
							❌
						</button>
					</div>
				));
			}
		} catch (error) {
			// Handle error if needed
			alert("error while removing the item");
		}
	}

	const formatDate = (date: Date) => {
		// Array of month names
		const months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];

		// Get day, month name, and year
		const day = date.getDate();
		const monthName = months[date.getMonth()];
		const year = date.getFullYear();

		// Format into a readable string
		const formattedDate = `${day} ${monthName} ${year}`;

		return formattedDate;
	};

	return (
		<div className="flex flex-col items-center min-h-screen bg-gray-900 text-white overflow-hidden">
			<Toaster />
			<Navbar />
			{cartItems.length === 0 ? (
				<Loading />
			) : (
				<div className="w-full flex flex-col lg:flex-row my-20 min-h-screen">
					<div className="w-full lg:w-1/2 h-full overflow-y-auto flex flex-col gap-6 px-4 lg:px-0">
						{cartItems.map((item) => (
							<CartItemCard
								key={item.id}
								item={item}
								handleRemove={handleRemove}
							/>
						))}
					</div>
					<div className="w-full lg:w-1/2 h-full lg:fixed lg:top-20 lg:right-0">
						<Card className="h-full bg-gray-800 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
							<CardHeader>
								<h2 className="text-2xl font-bold">Order Summary</h2>
							</CardHeader>
							<CardBody>
								<div className="mb-4">
									<strong className="text-lg">Order Content:</strong>
									<div className="text-gray-300">
										{/* Display your order content here */}
										{orderDetails.orderContent}
									</div>
								</div>
								<div className="mb-4">
									<strong className="text-lg">Date:</strong>{" "}
									{formatDate(orderDetails.orderDate)}
								</div>
								<div className="flex items-center">
									<strong className="text-lg">Total:</strong>
									<div className="ml-2 text-xl font-bold text-blue-400">
										${orderDetails.orderPrice}
									</div>
								</div>
							</CardBody>
							<CardFooter className="bg-gray-700 w-full flex justify-center items-center rounded-b-2xl hover:bg-gray-600 transition-all duration-300">
								<button className="py-3 px-6 text-white font-semibold bg-blue-700 rounded-md hover:bg-blue-500 transition-colors duration-300">
									Order Items
								</button>
							</CardFooter>
						</Card>
					</div>
				</div>
			)}
			<Footer />
		</div>
	);
};

export default Cart;