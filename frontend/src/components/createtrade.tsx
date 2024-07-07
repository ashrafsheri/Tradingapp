import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import "../styles/maketrade.css";

interface FormData {
    username: string | null;
    title: string;
    description: string;
    conditions: string;
    image: File | null;
}

const MakeTrade: React.FC = () => {
    const username = localStorage.getItem('username'); 
    const [formData, setFormData] = useState<FormData>({
        username: username,
        title: '',
        description: '',
        conditions: '',
        image: null
    });
    const [message, setMessage] = useState<string>('');

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        if (name === "image") {
            const file = (event.target as HTMLInputElement).files?.[0];
            setFormData(prevFormData => ({
                ...prevFormData,
                image: file || null
            }));
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        const data = new FormData();

        data.append('username', formData.username || '');
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('conditions', formData.conditions);
        if (formData.image) {
            data.append('image', formData.image); 
        }
    
        try {
            const response = await axios.post('http://localhost:6969/api/trades', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage('Trade created successfully!');
            console.log(response.data);
        } catch (error: any) { 
            setMessage('Failed to create trade. Please try again.');
            console.error(error);
        }
    };
    

    return (
        <div className="make-trade-container">
            <div>
                <h1>Create a Trade</h1>
                <form onSubmit={handleSubmit}>
                    <label>Title:</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />

                    <label>Description:</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required />

                    <label>Conditions:</label>
                    <input type="text" name="conditions" value={formData.conditions} onChange={handleChange} />

                    <label>Image:</label>
                    <input type="file" name="image" onChange={handleChange} accept="image/*" />

                    <button type="submit">Submit Trade</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}

export default MakeTrade;
