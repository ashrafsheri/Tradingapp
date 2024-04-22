import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/browse.css';

interface Trade {
    _id: string;
    title: string;
    description: string;
    imageUrl?: string;
    conditions?: string;
    username: string;
}

const Browse: React.FC = () => {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchTrades = async () => {
            try {
                const response = await axios.get('http://localhost:6969/api/trades/all');
                setTrades(response.data);
                if (response.data.length === 0) {
                    setError('No trades found.');
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error("Failed to fetch trades:", error.message);
                    setError('Failed to fetch trades.');
                } else {
                    console.error("An unexpected error occurred:", error);
                    setError('An unexpected error occurred.');
                }
            }
        };

        fetchTrades();
    }, []);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredTrades = trades.filter(trade =>
        trade.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleTradeClick = (tradeId: string) => {
        navigate(`/trade/${tradeId}`);
    };

    const handleSendOfferClick = (tradeId: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); 
        navigate(`/create-offer/${tradeId}`);
    };

    return (
        <div>
            <section className="search-section">
                <input
                    type="text"
                    id="searchBar"
                    placeholder="Search trades..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </section>

            <section className="trades-list">
                {filteredTrades.length > 0 ? (
                    filteredTrades.map((trade, index) => (
                        <div key={index} className="trade-item" onClick={() => handleTradeClick(trade._id)}>
                            <img src={trade.imageUrl ? `http://localhost:6969/${trade.imageUrl}` : "../tradeImage.jpg"} alt="Trade Image" className="trade-image"/>
                            <div className="trade-info">
                                <h3 className="trade-title">{trade.title}</h3>
                                <p className="trade-description">{trade.description}</p>
                                <div className="trade-conditions">
                                    Conditions:
                                    {trade.conditions ? trade.conditions.split(',').map((condition, idx) => (
                                        <span key={idx} className="condition-badge">{condition.trim()}</span>
                                    )) : <span className="condition-badge">No conditions listed</span>}
                                </div>
                                <p className="profile-name">Posted by: {trade.username}</p>
                            </div>
                            <button className="send-offer-btn" onClick={(e) => handleSendOfferClick(trade._id, e)}>Send Offer</button>
                        </div>
                    ))
                ) : (
                    <p>{error || 'No trades matching your criteria.'}</p>
                )}
            </section>
        </div>
    );
}

export default Browse;
