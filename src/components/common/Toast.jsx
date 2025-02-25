import { FiCheck, FiX, FiInfo } from "react-icons/fi";

export default function Toast({ show, message, type, onClose }) {
  if (!show) return null;
  
  const icons = {
    success: <FiCheck className="mr-2" />,
    error: <FiX className="mr-2" />,
    info: <FiInfo className="mr-2" />
  };
  
  const styles = {
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800"
  };
  
  return (
    <div 
      className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 flex items-center ${styles[type] || styles.info}`}
    >
      {icons[type]}
      <span>{message}</span>
      {onClose && (
        <button className="ml-4 text-gray-500 hover:text-gray-700" onClick={onClose}>
          <FiX />
        </button>
      )}
    </div>
  );
}