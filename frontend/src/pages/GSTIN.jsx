import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addGSTIN, viewGSTINs } from '../store/action.js';


const GSTIN = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const gstins = useSelector((state) => state.gstinState.gstins);
  const error = useSelector((state) => state.gstinState.error);



  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGstin, setNewGstin] = useState({
    name: '',
    gstin: '',
    stateCode: ''
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGstin({ ...newGstin, [name]: value });

    // Automatically extract state code from GSTIN
    if (name === 'gstin' && value.length >= 2) {
      setNewGstin(prev => ({ ...prev, stateCode: value.substring(0, 2) }));
    }
  };

  const handleAddGstin = () => {
    if (newGstin.name && newGstin.gstin) {
      dispatch(addGSTIN(newGstin.name, newGstin.gstin));
      setNewGstin({ name: '', gstin: '', stateCode: '' });
      closeModal();
    }
  };

  useEffect(() => {
    dispatch(viewGSTINs()); // Fetch GSTINs when the component mounts
  }, [dispatch]);

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-48 bg-white border-r p-4 flex flex-col">
        <div className="mb-8">
          <img src="/api/placeholder/120/32" alt="FinCorpX Logo" className="mb-8" />
        </div>
        <div className="space-y-2">
          <div 
            className="flex items-center p-2 text-gray-500 hover:bg-gray-100 rounded cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
            <span>Dashboard</span>
          </div>
          <div className="flex items-center p-2 bg-gray-100 text-gray-700 font-medium rounded">
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
            <h1 className="text-xl font-medium text-gray-800">Listed GSTINs</h1>
            <div className="flex">
              <div className="relative mr-4">
                <input
                  type="text"
                  className="pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Search"
                />
                <svg className="w-5 h-5 absolute left-2 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <button
                onClick={openModal}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
              >
                Add GSTIN
              </button>
            </div>
          </div>

          <div className="bg-white rounded-md shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GSTIN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Reconciled</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {gstins.map((gstin) => (
                  <tr key={gstin._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{gstin.gstUsername}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{gstin.gstin}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{gstin.stateCode}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-400">
                        Never
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Adding GSTIN */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 w-96 relative">
            <button 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            
            <h2 className="text-lg font-medium mb-6">Add GSTIN</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">GST Username</label>
                <input
                  type="text"
                  name="name"
                  value={newGstin.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-1">GSTIN</label>
                <input
                  type="text"
                  name="gstin"
                  value={newGstin.gstin}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-1">State Code</label>
                <input
                  type="text"
                  name="stateCode"
                  value={newGstin.stateCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  readOnly
                />
              </div>
              
              <button
                onClick={handleAddGstin}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md mt-2"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GSTIN;

