import React, { useState } from 'react';
import { Zap, Scan, BarChart3 } from 'lucide-react';
import BarcodeGenerator from './components/BarcodeGenerator';
import BarcodeReader from './components/BarcodeReader';

function App() {
  const [activeTab, setActiveTab] = useState<'generate' | 'read'>('generate');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Barcode Studio</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Professional barcode generation and reading tool. Create barcodes from text or decode existing barcode images with ease.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 shadow-lg border border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('generate')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === 'generate'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Zap className="h-4 w-4" />
                Generate Barcode
              </button>
              <button
                onClick={() => setActiveTab('read')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === 'read'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Scan className="h-4 w-4" />
                Read Barcode
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'generate' && <BarcodeGenerator />}
          {activeTab === 'read' && <BarcodeReader />}
        </div>
      </div>
    </div>
  );
}

export default App;