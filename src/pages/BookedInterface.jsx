import { useNavigate, useLocation } from 'react-router-dom';
import { Car, Bus, Key, Train, Package, User, CheckCircle, Send, Loader } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../supabaseClient'; // Left to avoid breaking other things if exported differently, but removed usage

import { useEffect, useState } from 'react';
import navBarImg from '../assets/nav bar.png';
import centerImg from '../assets/center.png';
import logoImg from '../assets/logo.png';
import mapImgAsset from '../assets/map.png';
import chatImgAsset from '../assets/chat.png';
import rideDetailsImgAsset from '../assets/ride details.png';
import driverDetailsImgAsset from '../assets/driver details.png';
import scootyAsset from '../assets/scooty.png';
import bikeIcon from '../assets/bike.png';
import autoIcon from '../assets/auto.png';
import cabNonAcIcon from '../assets/cab non ac.png';
import cabPremiumIcon from '../assets/cab premium.png';
import cabXlIcon from '../assets/cab xl.png';
import maheshImg from '../assets/mahesh.png';

// ─── Custom Map Markers ───
const pickupIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="width:18px;height:18px;background:#22c55e;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.5);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

const dropIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="width:16px;height:16px;background:#ef4444;border:3px solid #fff;border-radius:3px;box-shadow:0 2px 8px rgba(0,0,0,0.5);"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
});

// ─── Auto-fit map bounds ───
const FitBounds = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
        if (coords && coords.length >= 2) {
            const bounds = L.latLngBounds(coords);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }
    }, [coords, map]);
    return null;
};

const BookedInterface = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const rideId = location.state?.rideId;

    const [ride, setRide] = useState(null);
    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [showQuickTips, setShowQuickTips] = useState(true);

    useEffect(() => {
        if (!rideId) {
            navigate('/booking-interface');
            return;
        }

        const loadContent = () => {
            setLoading(true);
            const mockRide = location.state?.rideData || {
                vehicle_type: 'bike',
                pickup_name: 'Current Location',
                drop_name: 'Destination',
                fare: '₹50',
                distance: '5 km',
                otp: Math.floor(1000 + Math.random() * 9000).toString(),
                pickupCoords: { lat: 17.3850, lng: 78.4867 },
                dropCoords: { lat: 17.4050, lng: 78.5067 },
                routeCoords: []
            };
            mockRide.status = 'accepted';
            mockRide.otp = mockRide.otp || Math.floor(1000 + Math.random() * 9000).toString();
            
            const mockDriver = {
                name: 'Mahesh',
                vehicle_model: 'Honda Activa',
                vehicle_plate: 'TS09 EX 1234',
                rating: 4.8
            };

            setRide(mockRide);
            setDriver(mockDriver);
            setTimeout(() => setLoading(false), 800);
        };

        loadContent();

        // Simulate driver arriving after 10 seconds
        const arriveTimer = setTimeout(() => {
            setRide(prev => ({ ...prev, status: 'arrived' }));
        }, 10000);

        return () => clearTimeout(arriveTimer);
    }, [rideId, navigate, location.state]);

    const quickTips = [
        "Please come fast",
        "I'm at the pickup point",
        "I'm waiting"
    ];

    const getVehicleIcon = (type) => {
        switch(type) {
            case 'bike': return bikeIcon;
            case 'scooty': return scootyAsset;
            case 'auto': return autoIcon;
            case 'cab-non-ac': return cabNonAcIcon;
            case 'cab-premium': return cabPremiumIcon;
            case 'cab-xl': return cabXlIcon;
            default: return scootyAsset; // Default fallback
        }
    };

    const handleSendMessage = (text, type = 'bubble') => {
        if (!text.trim()) return;
        setMessages([...messages, { text, sender: 'user', type }]);
        setInputText('');
        if (type === 'plain') setShowQuickTips(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage(inputText, 'bubble');
            setShowQuickTips(false);
        }
    };

    const mainServices = [
        { name: 'booked interface', icon: <Car size={24} />, path: '/booked-interface' },
        { name: 'Bus', icon: <Bus size={24} />, path: '/bus-booking' },
        { name: 'Rentals', icon: <Key size={24} />, path: '/rentals' },
        { name: 'Metro', icon: <Train size={24} />, path: '/metro' },
        { name: 'Courier', icon: <Package size={24} />, path: '/courier' },
    ];

    return (
        <div className="customer-dashboard-new">
            <aside className="sidebar-nav" style={{ backgroundImage: `url("${navBarImg}")` }}>
                <div className="logo-container">
                    <img src={logoImg} alt="Logo" className="nav-logo" />
                </div>

                <div className="nav-items-wrapper">
                    {mainServices.map((service) => (
                        <button
                            key={service.name}
                            className={`nav-btn ${service.name === 'booked interface' ? 'active' : ''}`}
                            onClick={() => navigate(service.path)}
                            title={service.name}
                        >
                            {service.icon}
                        </button>
                    ))}
                </div>

                <div className="bottom-nav-items">
                    <button
                        className="nav-btn"
                        onClick={() => navigate('/profile')}
                        title="Profile"
                    >
                        <User size={24} />
                    </button>
                </div>
            </aside>

            <main className="main-content-area booked-interface-main">
                {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#fff' }}>
                        <Loader className="spin" size={40} />
                        <span style={{ marginLeft: '10px' }}>Loading trip details...</span>
                    </div>
                ) : (
                    <div className="booked-final-layout">
                        <div className="left-panel">
                            {ride?.pickupCoords && ride?.dropCoords ? (
                                <div className="map-view-img" style={{ position: 'relative', overflow: 'hidden', backgroundImage: `url("${mapImgAsset}")`, backgroundSize: '100% 100%', borderRadius: '2.5rem', WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}>
                                    <MapContainer
                                        center={[ride.pickupCoords.lat, ride.pickupCoords.lng]}
                                        zoom={13}
                                        style={{ width: '100%', height: '100%', zIndex: 1, borderRadius: 'inherit', background: 'transparent' }}
                                        zoomControl={false}
                                        attributionControl={false}
                                    >
                                        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                                        <Marker position={[ride.pickupCoords.lat, ride.pickupCoords.lng]} icon={pickupIcon} />
                                        <Marker position={[ride.dropCoords.lat, ride.dropCoords.lng]} icon={dropIcon} />
                                        {ride.routeCoords && ride.routeCoords.length > 0 && (
                                            <Polyline
                                                positions={ride.routeCoords}
                                                pathOptions={{ color: '#60a5fa', weight: 5, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }}
                                            />
                                        )}
                                        <FitBounds coords={[
                                            [ride.pickupCoords.lat, ride.pickupCoords.lng],
                                            [ride.dropCoords.lat, ride.dropCoords.lng]
                                        ]} />
                                    </MapContainer>
                                </div>
                            ) : (
                                <img src={mapImgAsset} alt="Map" className="map-view-img" />
                            )}
                            <div className="dynamic-driver-details" style={{ backgroundImage: `url("${driverDetailsImgAsset}")` }}>
                                <div className="driver-main-header">
                                    <div className="driver-avatar-large">
                                        <img src={maheshImg} alt="Driver" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                    </div>
                                    <div className="driver-meta">
                                        <div className="driver-name-row">
                                            <span className="driver-full-name">{driver?.name || driver?.username || 'Driver'}</span>
                                            <CheckCircle size={16} className="verified-icon-alt" />
                                        </div>
                                        <div className="driver-rating-row">
                                            <span className="star-icon">★</span>
                                            <span className="rating-value">4.8</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="vehicle-info-row">
                                    <img src={getVehicleIcon(ride?.vehicle_type)} alt="Vehicle" className="vehicle-large-img" />
                                    <div className="vehicle-details-text">
                                        <div className="vehicle-model">{driver?.vehicle_model || ride?.vehicle_type || 'Vehicle'}</div>
                                        <div className="vehicle-plate">{driver?.vehicle_plate || (ride?.status === 'accepted' ? 'Loading' : '')}</div>
                                    </div>
                                </div>

                                <div className="status-footer">
                                    <span className="current-status" style={{ textTransform: 'capitalize' }}>{ride?.status}</span>
                                </div>
                            </div>
                        </div>
                        <div className="right-panel">
                            <div className="mini-trip-details" style={{ backgroundImage: `url("${rideDetailsImgAsset}")` }}>
                                <h3 className="trip-details-title">Trip details</h3>
                                
                                <div className="mini-location-box">
                                    <div className="mini-location-indicator">
                                        <div className="mini-indicator-dot"></div>
                                        <div className="mini-indicator-line"></div>
                                        <div className="mini-indicator-square"></div>
                                    </div>
                                    <div className="mini-location-inputs">
                                        <div className="mini-location-text">{(ride?.pickup_name || '').split(',')[0]}</div>
                                        <div className="mini-location-divider"></div>
                                        <div className="mini-location-text">{(ride?.drop_name || '').split(',')[0]}</div>
                                    </div>
                                </div>

                                <div className="trip-stats-container">
                                    <div className="trip-stat-row">
                                        <span className="stat-label">OTP</span>
                                        <span className="stat-value otp-badge">{ride?.otp || '----'}</span>
                                    </div>
                                    <div className="trip-stat-divider"></div>
                                    <div className="trip-stat-row">
                                        <span className="stat-label">Fare</span>
                                        <span className="stat-value">{ride?.fare}</span>
                                    </div>
                                    <div className="trip-stat-divider"></div>
                                    <div className="trip-stat-row">
                                        <span className="stat-label">Distance</span>
                                        <span className="stat-value">{ride?.distance}</span>
                                    </div>
                                </div>

                                <button 
                                    className="cancel-ride-btn"
                                    onClick={() => {
                                        navigate('/booking-interface');
                                    }}
                                >Cancel Ride</button>
                            </div>
                            
                            <div className="dynamic-chat-container" style={{ backgroundImage: `url("${chatImgAsset}")` }}>
                                <div className="chat-header">
                                    <div className="driver-avatar-circle">
                                        <img src={maheshImg} alt="Driver" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                    </div>
                                    <div className="driver-info">
                                        <span className="driver-name">{driver?.name?.toLowerCase() || driver?.username?.toLowerCase() || 'driver'}</span>
                                        <CheckCircle size={14} className="verified-icon" />
                                    </div>
                                </div>

                                <div className="chat-messages-area">
                                    {messages.map((msg, index) => (
                                        <div key={index} className={`message-bubble ${msg.sender}`}>
                                            {msg.text}
                                        </div>
                                    ))}
                                    {showQuickTips && (
                                        <div className="quick-tips-container">
                                            {quickTips.map((tip, index) => (
                                                <button 
                                                    key={index} 
                                                    className="quick-tip-btn"
                                                    onClick={() => handleSendMessage(tip, 'plain')}
                                                >
                                                    {tip}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="chat-input-wrapper">
                                    <div className="chat-input-bar">
                                        <input 
                                            type="text" 
                                            placeholder="Type your message" 
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                        />
                                        <button 
                                            className="send-msg-btn"
                                            onClick={() => handleSendMessage(inputText)}
                                        >
                                            <Send size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default BookedInterface;
