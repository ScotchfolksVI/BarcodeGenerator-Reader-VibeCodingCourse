import React, { useState, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Upload, Image as ImageIcon, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface BarcodeReaderProps {}

const BarcodeReader: React.FC<BarcodeReaderProps> = () => {
  const [decodedText, setDecodedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const codeReader = new BrowserMultiFormatReader();

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setError('');
    setDecodedText('');

    try {
      // Create image preview
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);

      // Create an image element for decoding
      const img = new Image();
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);

          const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
          if (imageData) {
            const result = await codeReader.decodeFromImageData(imageData);
            setDecodedText(result.getText());
          }
        } catch (err) {
          setError('Could not decode barcode from this image. Please try a clearer image.');
        } finally {
          setIsProcessing(false);
          URL.revokeObjectURL(imageUrl);
        }
      };
      img.src = imageUrl;
    } catch (err) {
      setError('Error processing image. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
    
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (PNG, JPG, GIF)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    processImage(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(decodedText);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Upload Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Upload Barcode Image</h2>
          </div>
          
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
              isDragOver
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
          >
            <Upload className={`h-12 w-12 mx-auto mb-4 ${
              isDragOver ? 'text-blue-500' : 'text-gray-400'
            }`} />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop your barcode image here
            </p>
            <p className="text-sm text-gray-600 mb-4">
              or click to browse files
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Choose File'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {uploadedImage && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Image:</p>
              <img
                src={uploadedImage}
                alt="Uploaded barcode"
                className="max-w-full h-auto border border-gray-200 rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Status */}
        {(error || decodedText) && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            error 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {error ? (
              <>
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">{error}</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Barcode decoded successfully</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Result Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Decoded Text</h2>
            </div>
            {decodedText && (
              <button
                onClick={copyToClipboard}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                Copy
              </button>
            )}
          </div>
          
          <div className="relative">
            <textarea
              value={decodedText}
              readOnly
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 resize-none font-mono text-sm"
              placeholder={isProcessing ? "Processing image..." : "Decoded text will appear here..."}
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <h3 className="font-semibold text-green-900 mb-2">Supported Formats:</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-green-800">
            <div>• Code 128</div>
            <div>• Code 39</div>
            <div>• EAN-13</div>
            <div>• EAN-8</div>
            <div>• UPC-A</div>
            <div>• QR Code</div>
            <div>• Data Matrix</div>
            <div>• PDF417</div>
          </div>
          <p className="text-xs text-green-700 mt-2">
            For best results, ensure the barcode is clear, well-lit, and not distorted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BarcodeReader;