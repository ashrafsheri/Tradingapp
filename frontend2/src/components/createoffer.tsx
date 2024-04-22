import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import "../styles/createoffer.css"; 

const socket = io('http://localhost:6969');

interface FormData {
    quantity: string;
    description: string;
    price: string;
}

interface OfferDetails extends FormData {
    senderUsername: string | null;
    tradeOwnerUsername: string;
}

const CreateOffer: React.FC = () => {
    const { tradeId } = useParams<{ tradeId: string }>();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        quantity: '',
        description: '',
        price: ''
    });
    const [tradeOwner, setTradeOwner] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        axios.get(`http://localhost:6969/api/trades/${tradeId}`)
            .then(response => {
                if (response.data && response.data.username) {
                    setTradeOwner(response.data.username);
                } else {
                    setError('Trade owner information not available.');
                }
            })
            .catch(error => {
                console.error('Failed to fetch trade details', error);
                setError('Unable to fetch trade details.');
                navigate('/browse');
            });

        socket.emit('joinTradeRoom', tradeId);
        return () => {
            socket.emit('leaveTradeRoom', tradeId);
        };
    }, [tradeId, navigate]);

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!tradeOwner) {
            setError('Trade owner is not defined. Cannot submit offer.');
            return;
        }

        const offerDetails: OfferDetails = {
            ...formData,
            senderUsername: localStorage.getItem('username'),
            tradeOwnerUsername: tradeOwner
        };

        socket.emit('sendOffer', { tradeId, offerDetails }, (response: { error: boolean; message: string }) => {
            if (response.error) {
                console.error('Error submitting offer:', response.message);
                setError(response.message);
            } else {
                console.log('Offer submitted successfully:', response);
            }
        });

        navigate('/browse');
    };

    return (
        <div className="create-offer-container">
            <a href="#" className="back-link" onClick={() => navigate(-1)}>← Back</a>
            <form id="create-offer-form" onSubmit={handleSubmit}>
                <h1>Submit Your Offer</h1>

                <label htmlFor="quantity">Quantity:</label>
                <input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} min="1" required />

                <label htmlFor="description">Description:</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} required />

                <label htmlFor="price">Cash Offer ($):</label>
                <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} min="1" step="any" required />

                <button type="submit" className="submit-btn">Submit Offer</button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default CreateOffer;
