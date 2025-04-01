import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { viewGSTINs } from '../store/action.js';
import axios from 'axios';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const gstins = useSelector((state) => state.gstinState.gstins);
  const [selectedGstin, setSelectedGstin] = useState('');
  const [dueMonth, setDueMonth] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    dispatch(viewGSTINs()); // Fetch GSTINs when the component mounts
  }, [dispatch]);

  useEffect(() => {
    // Fetch due month when GSTIN is selected
    const fetchDueMonth = async () => {
      if (selectedGstin) {
        try {
          const response = await fetch(`http://localhost:5000/api/gstin/${selectedGstin}/due-month`);
          const data = await response.json();
          setDueMonth(data.dueMonth);
        } catch (error) {
          console.error('Error fetching due month:', error);
          setDueMonth(''); // Reset due month on error
        }
      }
    };

    fetchDueMonth();
  }, [selectedGstin]);

  const handleGstinChange = (e) => {
    setSelectedGstin(e.target.value);
    setError(''); // Clear any previous errors
    setShowOtpInput(false); // Reset OTP input visibility
    setOtp(''); // Clear OTP
  };

  const handleFileNow = async () => {
    if (!selectedGstin) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5001/api/filling/generate-otp', {
        gstin: selectedGstin
      });
      
      if (response.data.message) {
        setShowOtpInput(true);
        setEmail(response.data.email || ''); // Store email if provided in response
      } else {
        setError('Failed to generate OTP');
      }
    } catch (error) {
      console.error('Error generating OTP:', error);
      setError(error.response?.data?.error || 'Failed to generate OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError('Please enter OTP');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5001/api/filling/verify-otp', {
        otp,
        email
      });

      if (response.data.message === 'OTP verified successfully!') {
        // Navigate to filing page with selected GSTIN
        navigate(`/filing/${selectedGstin}`);
      } else {
        setError('Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError(error.response?.data?.error || 'Failed to verify OTP');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-48 bg-white border-r p-4 flex flex-col">
        <div className="mb-8">
          <img src="/api/placeholder/120/32" alt="FinCorpX Logo" className="mb-8" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center p-2 bg-gray-100 text-gray-700 font-medium rounded">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
            <span>Dashboard</span>
          </div>
          <div 
            className="flex items-center p-2 text-gray-500 hover:bg-gray-100 rounded cursor-pointer"
            onClick={() => navigate('/')}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <span>GSTINs</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-medium text-gray-800">GST Filing Dashboard</h1>
          </div>

          <div className="bg-white rounded-md shadow-sm p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Select GSTIN</label>
                <select
                  value={selectedGstin}
                  onChange={handleGstinChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select a GSTIN</option>
                  {gstins.map((gstin) => (
                    <option key={gstin._id} value={gstin.gstin}>
                      {gstin.gstUsername} - {gstin.gstin}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="text-red-500 text-sm mt-2">
                  {error}
                </div>
              )}

              {selectedGstin && !showOtpInput && (
                <button
                  onClick={handleFileNow}
                  disabled={isLoading}
                  className={`w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md mt-2 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Generating OTP...' : `File Now ${dueMonth ? `- Due for ${dueMonth}` : ''}`}
                </button>
              )}

              {showOtpInput && (
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP sent to your email"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <button
                    onClick={handleVerifyOtp}
                    disabled={isVerifying}
                    className={`w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md ${
                      isVerifying ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isVerifying ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
