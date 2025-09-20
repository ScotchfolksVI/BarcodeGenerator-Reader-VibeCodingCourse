import React, { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { Download, Type, Settings, CheckCircle, AlertCircle } from 'lucide-react';

interface BarcodeGeneratorProps {}

const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = () => {
  const [inputText, setInputText] = useState('Hello World');
  const [barcodeFormat, setBarcodeFormat] = useState('CODE128');
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const barcodeFormats = [
    { value: 'CODE128', label: 'Code 128 (Recommended)' },
    { value: 'CODE39', label: 'Code 39' },
    { value: 'EAN13', label: 'EAN-13' },
    { value: 'EAN8', label: 'EAN-8' },
    { value: 'UPC', label: 'UPC-A' },
    { value: 'ITF14', label: 'ITF-14' },
  ];

  useEffect(() => {
    generateBarcode();
  }, [inputText, barcodeFormat]);

  const generateBarcode = () => {
    if (!canvasRef.current || !inputText.trim()) {
      setIsValid(false);
      setError('Please enter text to generate barcode');
      return;
    }

    try {
      JsBarcode(canvasRef.current, inputText, {
        format: barcodeFormat,
        width: 2,
        height: 100,
        displayValue: true,
        fontSize: 14,
        textMargin: 10,
        margin: 10,
        background: '#ffffff',
        lineColor: '#000000',
      });
      setIsValid(true);
      setError('');
    } catch (err) {
      setIsValid(false);
      setError(`Invalid input for ${barcodeFormat} format`);
    }
  };

  const downloadBarcode = () => {
    if (!canvasRef.current || !isValid) return;
    
    const link = document.createElement('a');
    link.download = `barcode-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Type className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Input Text</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
                Text to encode
              </label>
              <textarea
                id="text-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={3}
                placeholder="Enter text to generate barcode..."
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
          </div>
          
          <div>
            <label htmlFor="format-select" className="block text-sm font-medium text-gray-700 mb-2">
              Barcode Format
            </label>
            <select
              id="format-select"
              value={barcodeFormat}
              onChange={(e) => setBarcodeFormat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {barcodeFormats.map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status */}
        <div className={`flex items-center gap-2 p-3 rounded-lg ${
          isValid 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {isValid ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Barcode generated successfully</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{error}</span>
            </>
          )}
        </div>
      </div>

      {/* Preview Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Barcode Preview</h2>
            <button
              onClick={downloadBarcode}
              disabled={!isValid}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isValid
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Download className="h-4 w-4" />
              Download PNG
            </button>
          </div>
          
          <div className="flex justify-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto border border-gray-200 rounded"
                style={{ display: isValid ? 'block' : 'none' }}
              />
              {!isValid && (
                <div className="w-full h-32 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 rounded">
                  Invalid barcode data
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Tips:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Code 128 works with most alphanumeric text</li>
            <li>• EAN-13 requires exactly 13 digits</li>
            <li>• UPC requires exactly 12 digits</li>
            <li>• Code 39 supports A-Z, 0-9, and some symbols</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BarcodeGenerator;