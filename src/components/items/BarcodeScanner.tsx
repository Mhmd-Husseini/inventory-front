import React, { useState } from 'react';
import { useZxing } from 'react-zxing';
import Button from '../common/Button';
import '../../styles/components/BarcodeScanner.css';

interface BarcodeScannerProps {
  onResult: (result: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onResult, onClose }) => {
  const [error, setError] = useState<string | null>(null);
  
  const { ref } = useZxing({
    onDecodeResult(result) {
      onResult(result.getText());
    },
    onError(error) {
      console.error("Scanner error:", error);
      setError("Failed to access camera or decode barcode. Please try again.");
    },
  });

  return (
    <div className="barcode-scanner-container">
      <div className="barcode-scanner-header">
        <h3>Scan Barcode</h3>
        <button className="close-scanner" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      
      <div className="video-container">
        <video ref={ref} className="scanner-video" />
        <div className="scan-area">
          <div className="scan-line"></div>
        </div>
      </div>
      
      {error && <div className="scanner-error">{error}</div>}
      
      <div className="scanner-instructions">
        <p>Position the barcode within the frame to scan.</p>
        <p>Ensure good lighting for better scanning results.</p>
      </div>
      
      <div className="scanner-actions">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default BarcodeScanner; 