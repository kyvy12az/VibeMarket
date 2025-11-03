import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product3DModel } from "./Product3DModal";
import { Skeleton } from "@/components/ui/skeleton";

const products = [
	{
		id: 1,
		name: "Áo Thun Local Brand",
		description: "Thiết kế độc đáo, chất liệu cotton cao cấp",
		// color: "#FF6B9D",
		price: "299.000đ",
		modelPath: "/models/tshirt.glb",
		scale: 4,
	},
	{
		id: 2,
		name: "Giày Sneaker Streetwear",
		description: "Phong cách urban, thoải mái cả ngày",
		// color: "#4ECDC4",
		price: "899.000đ",
		modelPath: "/models/base_basic_shaded.glb",
		scale: 10,
	},
	{
		id: 3,
		name: "Mũ Bucket Hat",
		description: "Trendy, bảo vệ khỏi nắng hiệu quả",
		// color: "#A8E6CF",
		price: "149.000đ",
		modelPath: "/models/buckethat_shared.glb",
		scale: 13,
	},
    {
        id: 4,
        name: "Máy Xay Sinh Tố",
        description: "Công suất mạnh, phù hợp cho gia đình",
        price: "1.299.000đ",
        modelPath: "/models/blender.glb",
        scale: 5,
    },
];

export function ProductShowcase3D() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [isAutoRotate, setIsAutoRotate] = useState(true);

	const handlePrevious = () => {
		setActiveIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
	};

	const handleNext = () => {
		setActiveIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
	};

	const activeProduct = products[activeIndex];

	return (
		<section className="sm:py-20 py-10 px-4 relative overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background -z-10" />

			<div className="container mx-auto max-w-7xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-12"
				>
					<h2 className="text-3xl md:text-5xl font-bold mb-4">
						Sản phẩm nổi bật
					</h2>
					<p className="text-lg text-muted-foreground">
						Khám phá những thiết kế độc đáo từ local brands Việt
					</p>
				</motion.div>

				<div className="grid md:grid-cols-2 gap-8 items-center">
					{/* 3D Canvas */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className="relative h-[400px] md:h-[600px] rounded-3xl overflow-hidden border border-border bg-card/50 backdrop-blur-sm"
					>
						<Suspense
							fallback={
								<div className="w-full h-full flex items-center justify-center">
									<Skeleton className="w-full h-full" />
								</div>
							}
						>
							<Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
								<ambientLight intensity={0.6} />
								<spotLight
									position={[10, 10, 10]}
									angle={0.15}
									penumbra={1}
									intensity={1}
									castShadow
								/>
								<pointLight position={[-10, -10, -10]} intensity={0.5} />

								{/* Load model for active product */}
								<Product3DModel
									modelPath={activeProduct.modelPath}
									scale={activeProduct.scale}
									// color={activeProduct.color}
								/>

								<OrbitControls
									enableZoom={true}
									enablePan={false}
									autoRotate={isAutoRotate}
									autoRotateSpeed={2}
									minDistance={3}
									maxDistance={8}
								/>
							</Canvas>
						</Suspense>

						{/* Auto-rotate toggle */}
						<Button
							variant="outline"
							size="icon"
							className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm"
							onClick={() => setIsAutoRotate(!isAutoRotate)}
						>
							{isAutoRotate ? (
								<Pause className="h-4 w-4" />
							) : (
								<Play className="h-4 w-4" />
							)}
						</Button>
					</motion.div>

					{/* Product Info */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className="space-y-6"
					>
						<AnimatePresence mode="wait">
							<motion.div
								key={activeIndex}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.3 }}
								className="space-y-4"
							>
								<div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20">
									<span className="text-sm font-medium text-primary">
										{activeIndex + 1} / {products.length}
									</span>
								</div>

								<h3 className="text-3xl md:text-4xl font-bold">
									{activeProduct.name}
								</h3>

								<p className="text-lg text-muted-foreground">
									{activeProduct.description}
								</p>

								<div className="flex items-center gap-2">
									<span className="text-2xl font-bold text-primary">
										{activeProduct.price}
									</span>
								</div>
							</motion.div>
						</AnimatePresence>

						{/* Navigation Controls */}
						<div className="flex items-center gap-4 pt-4">
							<Button
								variant="outline"
								size="icon"
								onClick={handlePrevious}
								className="rounded-full"
							>
								<ChevronLeft className="h-5 w-5" />
							</Button>

							{/* Dot Indicators */}
							<div className="flex gap-2">
								{products.map((_, index) => (
									<button
										key={index}
										onClick={() => setActiveIndex(index)}
										className={`h-2 rounded-full transition-all ${
											index === activeIndex
												? "w-8 bg-primary"
												: "w-2 bg-primary/30 hover:bg-primary/50"
										}`}
										aria-label={`Go to product ${index + 1}`}
									/>
								))}
							</div>

							<Button
								variant="outline"
								size="icon"
								onClick={handleNext}
								className="rounded-full"
							>
								<ChevronRight className="h-5 w-5" />
							</Button>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
