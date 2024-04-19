import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ExcelUploadForm.css'; // Import your CSS file

function ExcelUploadForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [userData, setUserData] = useState([]);
    const [showUserData, setShowUserData] = useState(false); // New state to control the visibility of user data

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/users'); 
            setUserData(response.data);
            setShowUserData(true); // Show user data after fetching
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            // Clear form fields after successful submission
            setName('');
            setEmail('');
            setFile(null);
            // Refetch user data after submission
            fetchData();
            // Show toast message
        
        } catch (error) {
            console.error('Error uploading file:', error);
            setError('Error uploading file. Please try again.');
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(userData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'UserData');
        XLSX.writeFile(workbook, 'userData.xlsx');
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <h1>Upload Excel File</h1>
            </div>
            <div className="form-content">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="file">Choose Excel File:</label>
                        <input type="file" id="file" name="file" onChange={(e) => setFile(e.target.files[0])} />

                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <input type="submit" value="Submit" />
                    </div>
                </form>

                    <div className="form-group">
                        <button type="export" onClick={exportToExcel}>Export File</button>
                    </div>


            </div>

            {showUserData && (
                <div className="user-data">
                    <h2>User Data</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userData.map(user => (
                                <tr key={user.id}>
                                    <td>{user.firstname}</td>
                                    <td>{user.lastname}</td>
                                    <td>{user.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {/* <ToastContainer /> */}
        </div>
    );
}

export default ExcelUploadForm;
