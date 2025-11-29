import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, PresentationControls } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause, RotateCw, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product3DModel } from "./Product3DModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const products = [
    {
        id: 1,
        name: "Áo Thun Local Brand",
        description: "Thiết kế độc đáo, chất liệu cotton cao cấp",
        price: "299.000đ",
        modelPath: "/models/tshirt.glb",
        scale: 4,
        badge: "Best Seller",
        gradient: "from-pink-500/20 to-purple-500/20",
    },
    {
        id: 2,
        name: "Giày Sneaker Streetwear",
        description: "Phong cách urban, thoải mái cả ngày",
        price: "899.000đ",
        modelPath: "/models/base_basic_shaded.glb",
        scale: 10,
        badge: "New Arrival",
        gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
        id: 3,
        name: "Mũ Bucket Hat",
        description: "Trendy, bảo vệ khỏi nắng hiệu quả",
        price: "149.000đ",
        modelPath: "/models/buckethat_shared.glb",
        scale: 13,
        badge: "Hot Deal",
        gradient: "from-green-500/20 to-emerald-500/20",
    },
    {
        id: 4,
        name: "Máy Xay Sinh Tố",
        description: "Công suất mạnh, phù hợp cho gia đình",
        price: "1.299.000đ",
        modelPath: "/models/blender.glb",
        scale: 5,
        badge: "Premium",
        gradient: "from-orange-500/20 to-red-500/20",
    },
];

export function ProductShowcase3D() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAutoRotate, setIsAutoRotate] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handlePrevious = () => {
        setActiveIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
    };

    const activeProduct = products[activeIndex];

    return (
        <section className="py-8 px-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.1),transparent_50%)]" />
                <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${activeProduct.gradient} opacity-30 blur-3xl`}
                    key={activeIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{ willChange: 'opacity' }}
                />
            </div>

            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-12"
                    style={{ willChange: 'transform, opacity' }}
                >
                    <Badge variant="outline" className="mb-4 text-sm px-4 py-1">
                        🎯 Featured Products
                    </Badge>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Sản phẩm nổi bật
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Khám phá những thiết kế độc đáo với công nghệ 3D tương tác
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* 3D Canvas Container */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        {/* Glass Card Effect */}
                        <div className="relative h-[400px] md:h-[600px] rounded-3xl overflow-hidden border border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl shadow-2xl">
                            {/* Decorative Elements */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                            
                            {/* Canvas */}
                            <Suspense
                                fallback={
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                                        <div className="relative">
                                            <div className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <RotateCw className="w-8 h-8 text-primary animate-pulse" />
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground animate-pulse">
                                            Loading 3D Model...
                                        </p>
                                    </div>
                                }
                            >
                                <Canvas
                                    shadows
                                    camera={{ position: [0, 0, 5], fov: 50 }}
                                    className="cursor-grab active:cursor-grabbing"
                                >
                                    {/* Lighting */}
                                    <ambientLight intensity={0.5} />
                                    <spotLight
                                        position={[10, 10, 10]}
                                        angle={0.15}
                                        penumbra={1}
                                        intensity={1}
                                        castShadow
                                        shadow-mapSize={[2048, 2048]}
                                    />
                                    <pointLight position={[-10, -10, -10]} intensity={0.5} />
                                    <pointLight position={[10, 5, -5]} intensity={0.3} color="#60a5fa" />

                                    {/* Environment for reflections */}
                                    <Environment preset="studio" />

                                    {/* Product Model with Presentation Controls */}
                                    <PresentationControls
                                        global
                                        config={{ mass: 2, tension: 500 }}
                                        snap={{ mass: 4, tension: 1500 }}
                                        rotation={[0, 0, 0]}
                                        polar={[-Math.PI / 3, Math.PI / 3]}
                                        azimuth={[-Math.PI / 1.4, Math.PI / 2]}
                                    >
                                        <Product3DModel
                                            modelPath={activeProduct.modelPath}
                                            scale={activeProduct.scale}
                                        />
                                    </PresentationControls>

                                    {/* Shadows */}
                                    <ContactShadows
                                        position={[0, -1.4, 0]}
                                        opacity={0.5}
                                        scale={10}
                                        blur={2.5}
                                        far={4}
                                    />

                                    <OrbitControls
                                        enableZoom={true}
                                        enablePan={false}
                                        autoRotate={isAutoRotate}
                                        autoRotateSpeed={2}
                                        minDistance={3}
                                        maxDistance={8}
                                        maxPolarAngle={Math.PI / 2}
                                    />
                                </Canvas>
                            </Suspense>

                            {/* Control Panel */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                                {/* Auto-rotate toggle */}
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="bg-background/80 backdrop-blur-md hover:bg-background/90 border-border/50 shadow-lg"
                                        onClick={() => setIsAutoRotate(!isAutoRotate)}
                                    >
                                        {isAutoRotate ? (
                                            <Pause className="h-4 w-4" />
                                        ) : (
                                            <Play className="h-4 w-4" />
                                        )}
                                    </Button>
                                </motion.div>

                                {/* Fullscreen toggle */}
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="bg-background/80 backdrop-blur-md hover:bg-background/90 border-border/50 shadow-lg"
                                        onClick={() => setIsFullscreen(!isFullscreen)}
                                    >
                                        <Maximize2 className="h-4 w-4" />
                                    </Button>
                                </motion.div>
                            </div>

                            {/* Instructions */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-lg">
                                <p className="text-xs text-muted-foreground flex items-center gap-2">
                                    <RotateCw className="w-3 h-3" />
                                    Drag to rotate • Scroll to zoom
                                </p>
                            </div>

                            {/* Product Badge */}
                            <div className="absolute top-4 left-4">
                                <Badge className="bg-primary/90 backdrop-blur-md text-primary-foreground shadow-lg border-0">
                                    {activeProduct.badge}
                                </Badge>
                            </div>
                        </div>

                        {/* Decorative Glow */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 blur-3xl -z-10 opacity-60" />
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
                                className="space-y-6"
                            >
                                {/* Counter Badge */}
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 backdrop-blur-sm">
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        <span className="text-sm font-medium text-primary">
                                            {activeIndex + 1} / {products.length}
                                        </span>
                                    </div>
                                </div>

                                {/* Product Title */}
                                <div>
                                    <h3 className="text-3xl md:text-5xl font-bold mb-3 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                                        {activeProduct.name}
                                    </h3>
                                    <div className="h-1 w-20 bg-gradient-to-r from-primary to-transparent rounded-full" />
                                </div>

                                {/* Description */}
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {activeProduct.description}
                                </p>

                                {/* Price Section */}
                                <div className="flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Giá bán</p>
                                        <span className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                            {activeProduct.price}
                                        </span>
                                    </div>
                                    <div className="flex-1" />
                                    <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
                                        Xem chi tiết
                                    </Button>
                                </div>

                                {/* Features */}
                                <div className="grid grid-cols-3 gap-3">
                                    {["Chính hãng", "Miễn phí ship", "Đổi trả 7 ngày"].map((feature, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="p-3 rounded-xl bg-card/50 border border-border/50 text-center backdrop-blur-sm"
                                        >
                                            <p className="text-xs text-muted-foreground">{feature}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Controls */}
                        <div className="flex items-center gap-4 pt-6">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handlePrevious}
                                    className="rounded-full h-12 w-12 border-2 hover:border-primary hover:bg-primary/10"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                            </motion.div>

                            {/* Dot Indicators */}
                            <div className="flex gap-2 flex-1 justify-center">
                                {products.map((_, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => setActiveIndex(index)}
                                        className={`h-2 rounded-full transition-all ${
                                            index === activeIndex
                                                ? "w-8 bg-primary shadow-lg shadow-primary/50"
                                                : "w-2 bg-primary/30 hover:bg-primary/50"
                                        }`}
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                        aria-label={`Go to product ${index + 1}`}
                                    />
                                ))}
                            </div>

                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleNext}
                                    className="rounded-full h-12 w-12 border-2 hover:border-primary hover:bg-primary/10"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}