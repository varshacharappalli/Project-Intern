import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { viewGSTINs } from '../store/action.js';
import axios from 'axios';
import * as XLSX from 'xlsx';

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
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const fileFormats = [
    { id: 'GSTR1', name: 'GSTR-1' },
    { id: 'GSTR3B', name: 'GSTR-3B' },
    { id: 'GSTR9', name: 'GSTR-9' },
    { id: 'GSTR9C', name: 'GSTR-9C' }
  ];

  useEffect(() => {
    dispatch(viewGSTINs());
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
          setDueMonth('');
        }
      }
    };

    fetchDueMonth();
  }, [selectedGstin]);

  const handleGstinChange = (e) => {
    setSelectedGstin(e.target.value);
    setError('');
    setShowOtpInput(false);
    setOtp('');
    setSelectedFormat('');
    setSelectedFile(null);
    setPreviewData(null);
    setShowPreview(false);
  };

  const handleFormatChange = (e) => {
    setSelectedFormat(e.target.value);
    setSelectedFile(null);
    setPreviewData(null);
    setShowPreview(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setError('');

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Take first 5 rows for preview
        const preview = jsonData.slice(0, 5);
        setPreviewData(preview);
        setShowPreview(true);
      };
      reader.readAsBinaryString(file);
    } catch (error) {
      console.error('Error reading file:', error);
      setError('Error reading file. Please try again.');
    }
  };

  const handleFileNow = async () => {
    if (!selectedGstin || !selectedFormat || !selectedFile) {
      setError('Please select GSTIN, format, and upload file');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5001/api/filling/generate-otp', {
        gstin: selectedGstin
      });
      
      if (response.data.message) {
        setShowOtpInput(true);
        setEmail(response.data.email || '');
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
      const formData = new FormData();
      formData.append('otp', otp);
      formData.append('email', email);
      formData.append('file', selectedFile);
      formData.append('gstin', selectedGstin);
      formData.append('format', selectedFormat);

      const response = await axios.post('http://localhost:5001/api/filling/verify-otp', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.message === 'OTP verified successfully!') {
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

              {selectedGstin && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Select File Format</label>
                  <select
                    value={selectedFormat}
                    onChange={handleFormatChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select format</option>
                    {fileFormats.map((format) => (
                      <option key={format.id} value={format.id}>
                        {format.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedFormat && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Upload File</label>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}

              {showPreview && previewData && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">File Preview</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <tbody className="bg-white divide-y divide-gray-200">
                        {previewData.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {error && (
                <div className="text-red-500 text-sm mt-2">
                  {error}
                </div>
              )}

              {selectedGstin && selectedFormat && selectedFile && !showOtpInput && (
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
