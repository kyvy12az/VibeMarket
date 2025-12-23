import { useEffect, useRef, useState } from 'react';
import goongjs from '@goongmaps/goong-js';
import './OrderTracking.css';

goongjs.accessToken = 'R3f5s1XKU2wK0rzipv3qLVEyX8MU1lI0PQkJIZTB';

const store: [number, number] = [107.0823, 16.8164];
const customer: [number, number] = [105.8522, 21.0285];
const VN_BOUNDS: [[number, number], [number, number]] = [
    [102.1446, 8.1791],   // Tây Nam
    [109.4646, 23.3926]  // Đông Bắc
];

export default function OrderTracking() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<goongjs.Map | null>(null);

    const shipperMarker = useRef<goongjs.Marker | null>(null);
    const routeCoords = useRef<[number, number][]>([]);
    const indexRef = useRef(0);

    const [status, setStatus] = useState('Đang giao');

    /* INIT MAP */
    useEffect(() => {
        mapRef.current = new goongjs.Map({
            container: mapContainer.current!,
            style: 'https://tiles.goong.io/assets/goong_map_web.json',
            center: [105.8, 16.5], // tâm Việt Nam
            zoom: 5.2,             // 👈 CHUẨN: thấy đủ VN + tên tỉnh
            minZoom: 4.8,          // ❌ không cho zoom ra xa hơn
            maxZoom: 6,            // ❌ không zoom gần để lộ xã/huyện
            maxBounds: VN_BOUNDS,  // 🔒 khóa trong VN
            pitch: 0,
            bearing: 0,
            antialias: true
        });

        mapRef.current.on('load', () => {
            mapRef.current!.setLayoutProperty(
                'admin-1-label',
                'visibility',
                'visible'
            );
            const map = mapRef.current!;
            // map.scrollZoom.disable();
            // map.dragRotate.disable();
            // map.touchPitch.disable();

            // ❌ Ẩn xã / phường
            map.setLayoutProperty('admin-3-label', 'visibility', 'none');

            // ❌ Ẩn quận / huyện
            map.setLayoutProperty('admin-2-label', 'visibility', 'none');

            // ✅ Giữ lại tỉnh / thành
            map.setLayoutProperty('admin-1-label', 'visibility', 'visible');

            console.log('✅ Map loaded & layer configured');
        });

        mapRef.current.on('moveend', () => {
            const center = mapRef.current!.getCenter();
            const zoom = mapRef.current!.getZoom();

            console.log('📍 Map center:', {
                lng: center.lng,
                lat: center.lat,
                zoom: zoom
            });
        });

        new goongjs.Marker({ color: 'green' })
            .setLngLat(store)
            .addTo(mapRef.current);

        new goongjs.Marker({ color: 'red' })
            .setLngLat(customer)
            .addTo(mapRef.current);

        fetchRoute();

        return () => mapRef.current?.remove();
    }, []);

    /* FETCH ROUTE */
    const fetchRoute = async () => {
        try {
            const res = await fetch(
                `https://rsapi.goong.io/Direction?origin=${store[1]},${store[0]}&destination=${customer[1]},${customer[0]}&vehicle=car&api_key=UKirNjHesKurftkfpvLtnfqmskY7YNwjdm1ze6rg`
            );

            const data = await res.json();

            if (!data.routes || data.routes.length === 0) {
                console.error('Không lấy được tuyến đường', data);
                return;
            }

            const encoded = data.routes[0].overview_polyline.points;
            routeCoords.current = decodePolyline(encoded);
            drawRoute();
        } catch (err) {
            console.error('Fetch route failed', err);
        }
    };


    /* DRAW ROUTE */
    const drawRoute = () => {
        if (!mapRef.current) return;
        const map = mapRef.current;

        if (map.getSource('route')) return;

        /* SOURCE */
        map.addSource('route', {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: routeCoords.current
                }
            }
        });

        /* 1️⃣ GLOW (bóng mờ phía dưới) */
        map.addLayer({
            id: 'route-glow',
            type: 'line',
            source: 'route',
            paint: {
                'line-color': '#00e5ff',
                'line-width': 14,
                'line-opacity': 0.25,
                'line-blur': 6
            }
        });

        /* 2️⃣ OUTLINE (viền trắng) */
        map.addLayer({
            id: 'route-outline',
            type: 'line',
            source: 'route',
            paint: {
                'line-color': '#00f2ea',
                // #00b14f
                'line-width': 8,
                'line-opacity': 0.9
            }
        });

        /* 3️⃣ ROUTE CHÍNH */
        map.addLayer({
            id: 'route-main',
            type: 'line',
            source: 'route',
            paint: {
                'line-color': '#00c2ff', // xanh kiểu Grab
                'line-width': 5,
                'line-opacity': 1,
                'line-linecap': 'round',
                'line-linejoin': 'round'
            }
        });

        /* 4️⃣ DASH CHẠY (hiệu ứng chuyển động) */
        map.addLayer({
            id: 'route-dash',
            type: 'line',
            source: 'route',
            paint: {
                'line-color': '#ffffff',
                'line-width': 2,
                'line-dasharray': [2, 4],
                'line-opacity': 0.9
            }
        });

        animateRouteDash(map);

        if (!shipperMarker.current && routeCoords.current.length) {
            const el = document.createElement('div');
            el.className = 'shipper-marker';

            // Create marker using the DOM element constructor to ensure compatibility
            shipperMarker.current = new goongjs.Marker(el)
                .setLngLat(routeCoords.current[0])
                .addTo(map);

            indexRef.current = 0; // reset index
            animate(); // start movement
        }
    };

    const animateRouteDash = (map: goongjs.Map) => {
        let dash = 0;

        const animate = () => {
            dash = (dash + 0.5) % 6;

            map.setPaintProperty('route-dash', 'line-dasharray', [
                2,
                4,
                dash
            ]);

            requestAnimationFrame(animate);
        };

        animate();
    };



    /* ANIMATION */
    const animate = () => {
        if (!shipperMarker.current) return; // safety

        let idx = 0;
        let t = 0; // interpolation factor between idx and idx+1
        let last = performance.now();

        const frame = (now: number) => {
            const dt = now - last;
            last = now;

            if (!routeCoords.current.length) return;

            if (idx >= routeCoords.current.length - 1) {
                // reached end
                shipperMarker.current!.setLngLat(routeCoords.current[routeCoords.current.length - 1]);
                setStatus('Đã giao');
                return;
            }

            const a = routeCoords.current[idx];
            const b = routeCoords.current[idx + 1];

            // duration per segment (ms) - adjust for speed
            const duration = 150; // ms between points (smaller = faster)

            t += dt / duration;

            if (t >= 1) {
                // move to next segment
                idx++;
                t = t - 1;
            }

            const lng = a[0] + (b[0] - a[0]) * t;
            const lat = a[1] + (b[1] - a[1]) * t;

            shipperMarker.current!.setLngLat([lng, lat]);

            // rotation (only when we have a next point)
            const angle = Math.atan2(b[1] - a[1], b[0] - a[0]) * (180 / Math.PI);
            shipperMarker.current!.getElement().style.transform = `rotate(${angle}deg)`;

            requestAnimationFrame(frame);
        };

        requestAnimationFrame(frame);
    };

    return (
        <>
            <div ref={mapContainer} className="map-container" />

            {/* Bottom Sheet */}
            <div className="bottom-sheet">
                <div className="handle" />
                <h3>🚚 Đơn hàng #123456</h3>
                <p>Trạng thái: <b>{status}</b></p>
                <p>📍 Cửa hàng → Khách hàng</p>
            </div>
        </>
    );
}

/* POLYLINE DECODER */
function decodePolyline(encoded: string): [number, number][] {
    let points: [number, number][] = [];
    let index = 0, lat = 0, lng = 0;

    while (index < encoded.length) {
        let b, shift = 0, result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        lat += (result & 1) ? ~(result >> 1) : (result >> 1);

        shift = 0;
        result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        lng += (result & 1) ? ~(result >> 1) : (result >> 1);

        // 🔥 CHUẨN GOONG: [lng, lat]
        points.push([lng / 1e5, lat / 1e5]);
    }

    return points;
}

