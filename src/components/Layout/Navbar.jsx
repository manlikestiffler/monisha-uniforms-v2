import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary-600">Monisha</span>
            <span className="text-gray-600">Uniforms</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/collections" 
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Collections
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 