'use client';

import { useState } from 'react';

interface ServiceFormData {
  name: string;
  overview: string;
  commitment: string;
  contact: string;
  price: number;
  whyChoose: { feature: string; description: string }[];
  whoCanBenefit: { type: string; description: string }[];
  diseasesSupported: { name: string; relevance: string }[];
  process: { step: string; description: string }[];
  faqs: { question: string; answer: string }[];
}

export default function ServiceForm() {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    overview: '',
    commitment: '',
    contact: '',
    price: 0,
    whyChoose: [{ feature: '', description: '' }],
    whoCanBenefit: [{ type: '', description: '' }],
    diseasesSupported: [{ name: '', relevance: '' }],
    process: [{ step: '', description: '' }],
    faqs: [{ question: '', answer: '' }],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (
    index: number,
    field: keyof Pick<ServiceFormData, 'whyChoose' | 'whoCanBenefit' | 'diseasesSupported' | 'process' | 'faqs'>,
    subField: string,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) =>
        i === index ? { ...item, [subField]: value } : item
      ),
    }));
  };

  const addArrayItem = (
    field: keyof Pick<ServiceFormData, 'whyChoose' | 'whoCanBenefit' | 'diseasesSupported' | 'process' | 'faqs'>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], getEmptyItem(field)],
    }));
  };

  const removeArrayItem = (
    field: keyof Pick<ServiceFormData, 'whyChoose' | 'whoCanBenefit' | 'diseasesSupported' | 'process' | 'faqs'>,
    index: number
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const getEmptyItem = (field: keyof ServiceFormData) => {
    switch (field) {
      case 'whyChoose':
        return { feature: '', description: '' };
      case 'whoCanBenefit':
        return { type: '', description: '' };
      case 'diseasesSupported':
        return { name: '', relevance: '' };
      case 'process':
        return { step: '', description: '' };
      case 'faqs':
        return { question: '', answer: '' };
      default:
        return {};
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add service');
      }

      setMessage('Service added successfully!');
      setFormData({
        name: '',
        overview: '',
        commitment: '',
        contact: '',
        price: 0,
        whyChoose: [{ feature: '', description: '' }],
        whoCanBenefit: [{ type: '', description: '' }],
        diseasesSupported: [{ name: '', relevance: '' }],
        process: [{ step: '', description: '' }],
        faqs: [{ question: '', answer: '' }],
      });
    } catch (error) {
      setMessage('Failed to add service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Add New Service</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Service Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="overview" className="block text-sm font-medium text-gray-700">
              Overview
            </label>
            <textarea
              id="overview"
              name="overview"
              required
              value={formData.overview}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="commitment" className="block text-sm font-medium text-gray-700">
              Commitment
            </label>
            <textarea
              id="commitment"
              name="commitment"
              required
              value={formData.commitment}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
              Contact Information
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              required
              value={formData.contact}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price (USD)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Why Choose</h3>
            <button
              type="button"
              onClick={() => addArrayItem('whyChoose')}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              + Add Feature
            </button>
          </div>
          {formData.whyChoose.map((item, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-md">
              <div className="flex justify-between">
                <h4 className="text-sm font-medium">Feature {index + 1}</h4>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('whyChoose', index)}
                    className="text-sm text-red-600 hover:text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                value={item.feature}
                onChange={(e) => handleArrayChange(index, 'whyChoose', 'feature', e.target.value)}
                placeholder="Feature"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <textarea
                value={item.description}
                onChange={(e) => handleArrayChange(index, 'whyChoose', 'description', e.target.value)}
                placeholder="Description"
                rows={2}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          ))}
        </div>

        {/* Who Can Benefit Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Who Can Benefit</h3>
            <button
              type="button"
              onClick={() => addArrayItem('whoCanBenefit')}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              + Add Beneficiary Type
            </button>
          </div>
          {formData.whoCanBenefit.map((item, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-md">
              <div className="flex justify-between">
                <h4 className="text-sm font-medium">Beneficiary Type {index + 1}</h4>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('whoCanBenefit', index)}
                    className="text-sm text-red-600 hover:text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                value={item.type}
                onChange={(e) => handleArrayChange(index, 'whoCanBenefit', 'type', e.target.value)}
                placeholder="Type"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <textarea
                value={item.description}
                onChange={(e) => handleArrayChange(index, 'whoCanBenefit', 'description', e.target.value)}
                placeholder="Description"
                rows={2}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          ))}
        </div>

        {/* Diseases Supported Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Diseases Supported</h3>
            <button
              type="button"
              onClick={() => addArrayItem('diseasesSupported')}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              + Add Disease
            </button>
          </div>
          {formData.diseasesSupported.map((item, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-md">
              <div className="flex justify-between">
                <h4 className="text-sm font-medium">Disease {index + 1}</h4>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('diseasesSupported', index)}
                    className="text-sm text-red-600 hover:text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleArrayChange(index, 'diseasesSupported', 'name', e.target.value)}
                placeholder="Disease Name"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <textarea
                value={item.relevance}
                onChange={(e) => handleArrayChange(index, 'diseasesSupported', 'relevance', e.target.value)}
                placeholder="Relevance"
                rows={2}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          ))}
        </div>

        {/* Process Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Process Steps</h3>
            <button
              type="button"
              onClick={() => addArrayItem('process')}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              + Add Step
            </button>
          </div>
          {formData.process.map((item, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-md">
              <div className="flex justify-between">
                <h4 className="text-sm font-medium">Step {index + 1}</h4>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('process', index)}
                    className="text-sm text-red-600 hover:text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                value={item.step}
                onChange={(e) => handleArrayChange(index, 'process', 'step', e.target.value)}
                placeholder="Step Title"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <textarea
                value={item.description}
                onChange={(e) => handleArrayChange(index, 'process', 'description', e.target.value)}
                placeholder="Step Description"
                rows={2}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          ))}
        </div>

        {/* FAQs Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">FAQs</h3>
            <button
              type="button"
              onClick={() => addArrayItem('faqs')}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              + Add FAQ
            </button>
          </div>
          {formData.faqs.map((item, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-md">
              <div className="flex justify-between">
                <h4 className="text-sm font-medium">FAQ {index + 1}</h4>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('faqs', index)}
                    className="text-sm text-red-600 hover:text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                value={item.question}
                onChange={(e) => handleArrayChange(index, 'faqs', 'question', e.target.value)}
                placeholder="Question"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <textarea
                value={item.answer}
                onChange={(e) => handleArrayChange(index, 'faqs', 'answer', e.target.value)}
                placeholder="Answer"
                rows={2}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          ))}
        </div>

        {message && (
          <div className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          {loading ? 'Adding...' : 'Add Service'}
        </button>
      </form>
    </div>
  );
} 