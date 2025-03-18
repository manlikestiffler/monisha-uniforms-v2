import React, { useState, useEffect } from 'react';
import { School, User, Package, ArrowRight, Plus, X, ChevronDown } from 'lucide-react';

const existingSchools = [
  {
    id: 1,
    name: "Delhi Public School",
    location: "Delhi, India",
    uniforms: {
      boys: {
        summer: ["White Shirt", "Grey Trousers", "Red Tie"],
        winter: ["Maroon Blazer", "Grey Sweater", "White Shirt"],
        sports: ["Track Suit", "House T-Shirt", "Sports Shoes"]
      },
      girls: {
        summer: ["White Shirt", "Grey Skirt", "Red Tie"],
        winter: ["Maroon Blazer", "Grey Sweater", "White Shirt"],
        sports: ["Track Suit", "House T-Shirt", "Sports Shoes"]
      }
    }
  },
  // ... other schools
];

const UNIFORM_CATEGORIES = {
  SUMMER: 'summer',
  WINTER: 'winter',
  SPORTS: 'sports',
  UNIVERSAL: 'universal'
};

const UNIFORM_TYPES = {
  summer: [
    { id: 'shirt', label: 'Shirts', variants: ['Half Sleeve', 'Full Sleeve'] },
    { id: 'skirt', label: 'Skirts', variants: ['Box Pleat', 'Knife Pleat'] },
    { id: 'shorts', label: 'Shorts', variants: ['Regular', 'Sports'] },
    { id: 'dress', label: 'Dresses', variants: ['Pinafore', 'A-Line'] },
    { id: 'trousers', label: 'Trousers', variants: ['Regular Fit', 'Slim Fit'] }
  ],
  winter: [
    { id: 'sweater', label: 'Sweaters', variants: ['V-Neck', 'Round Neck'] },
    { id: 'jacket', label: 'Jackets', variants: ['Regular', 'Padded'] },
    { id: 'blazer', label: 'Blazers', variants: ['Single Breasted', 'Double Breasted'] },
    { id: 'cardigan', label: 'Cardigans', variants: ['Button-up', 'Zip-up'] }
  ],
  sports: [
    { id: 'tracksuit', label: 'Tracksuits', variants: ['Full Set', 'Separate'] },
    { id: 'pe_kit', label: 'PE Kit', variants: ['Summer', 'Winter'] },
    { id: 'house_shirt', label: 'House Shirts', variants: ['Polo', 'T-Shirt'] },
    { id: 'sports_shorts', label: 'Sports Shorts', variants: ['Regular', 'Cycling'] }
  ],
  universal: [
    { id: 'tie', label: 'Ties', variants: ['Regular', 'Clip-on'] },
    { id: 'belt', label: 'Belts', variants: ['Regular', 'Elastic'] },
    { id: 'socks', label: 'Socks', variants: ['Ankle', 'Knee-high'] },
    { id: 'hat', label: 'Hats', variants: ['Cap', 'Beanie'] }
  ]
};

const addNewSchoolToList = (schoolData) => {
  // In a real app, this would be an API call
  const newSchool = {
    id: Date.now(), // In real app, this would come from backend
    name: schoolData.name,
    location: schoolData.location,
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800", // Default image
    students: "New",
    established: new Date().getFullYear(),
    uniforms: {
      boys: {
        summer: schoolData.uniformPricing.boys.summer.map(item => 
          `${item.type} ${item.variant}`).filter(Boolean),
        winter: schoolData.uniformPricing.boys.winter.map(item => 
          `${item.type} ${item.variant}`).filter(Boolean),
        sports: schoolData.uniformPricing.boys.sports.map(item => 
          `${item.type} ${item.variant}`).filter(Boolean),
        universal: schoolData.uniformPricing.boys.universal.map(item => 
          `${item.type} ${item.variant}`).filter(Boolean)
      },
      girls: {
        summer: schoolData.uniformPricing.girls.summer.map(item => 
          `${item.type} ${item.variant}`).filter(Boolean),
        winter: schoolData.uniformPricing.girls.winter.map(item => 
          `${item.type} ${item.variant}`).filter(Boolean),
        sports: schoolData.uniformPricing.girls.sports.map(item => 
          `${item.type} ${item.variant}`).filter(Boolean),
        universal: schoolData.uniformPricing.girls.universal.map(item => 
          `${item.type} ${item.variant}`).filter(Boolean)
      }
    },
    uniformPrice: {
      boys: calculateGrandTotal('boys'),
      girls: calculateGrandTotal('girls')
    },
    description: "New partner school",
    rating: 5.0,
    reviews: 0,
    accreditation: "Pending",
    facilities: [],
    timings: "8:00 AM - 2:30 PM",
    contact: {
      phone: schoolData.phone,
      email: schoolData.email
    },
    admissionOpen: true,
    uniformAvailability: "In Stock"
  };

  // Update the schools list
  const updatedSchools = [...existingSchools, newSchool];
  // In a real app, this would be handled by state management
  localStorage.setItem('schools', JSON.stringify(updatedSchools));
  
  return newSchool;
};

const LEVEL_TYPES = {
  ALL: {
    id: 'all',
    label: 'All Students',
    description: 'Order uniforms for all forms'
  },
  O_LEVEL: {
    id: 'o_level',
    label: 'Form 1-4 (O Level)',
    forms: ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
    description: 'Secondary school (O Level) uniforms'
  },
  A_LEVEL: {
    id: 'a_level',
    label: 'Form 1-6 (A Level)',
    forms: ['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5', 'Form 6'],
    description: 'Secondary school (A Level) uniforms'
  }
};

const UniformItemRow = ({ gender, category, item, index, onUpdate, onRemove }) => {
  return (
    <div className="grid grid-cols-12 gap-4 p-4 bg-white rounded-lg border border-gray-200">
      <div className="col-span-4">
        <select
          value={item.type || ''}
          onChange={(e) => onUpdate(index, 'type', e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
        >
          <option value="">Select Type</option>
          {UNIFORM_TYPES[category].map(type => (
            <option key={type.id} value={type.id}>{type.label}</option>
          ))}
        </select>
      </div>

      <div className="col-span-3">
        <select
          value={item.variant || ''}
          onChange={(e) => onUpdate(index, 'variant', e.target.value)}
          disabled={!item.type}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
        >
          <option value="">Variant</option>
          {item.type && UNIFORM_TYPES[category]
            .find(t => t.id === item.type)?.variants
            .map(variant => (
              <option key={variant} value={variant}>{variant}</option>
            ))}
        </select>
      </div>

      <div className="col-span-2">
        <input
          type="number"
          value={item.quantity || ''}
          onChange={(e) => onUpdate(index, 'quantity', parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
          placeholder="Qty"
          min="0"
        />
      </div>

      <div className="col-span-2">
        <div className="flex items-center">
          <span className="text-gray-500 mr-1">$</span>
          <input
            type="number"
            value={item.price || ''}
            onChange={(e) => onUpdate(index, 'price', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </div>
      </div>

      <div className="col-span-1 flex justify-end">
        <button
          onClick={() => onRemove(index)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const SchoolBulkOrder = () => {
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isNewSchool, setIsNewSchool] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [activeGender, setActiveGender] = useState('boys');
  const [activeCategory, setActiveCategory] = useState('summer');
  const [uniformPricing, setUniformPricing] = useState({
    boys: { 
      summer: [], 
      winter: [], 
      sports: [],
      universal: []
    },
    girls: { 
      summer: [], 
      winter: [], 
      sports: [],
      universal: []
    }
  });

  const handleAddItem = (gender, category) => {
    const updated = { ...uniformPricing };
    updated[gender][category] = [
      ...updated[gender][category],
      { 
        id: Date.now(), 
        type: '',
        variant: '',
        price: '',
        quantity: 0
      }
    ];
    setUniformPricing(updated);
  };

  const handleRemoveItem = (gender, category, index) => {
    const updated = { ...uniformPricing };
    updated[gender][category] = updated[gender][category].filter((_, i) => i !== index);
    setUniformPricing(updated);
  };

  const handleUpdateItem = (gender, category, index, field, value) => {
    const updated = { ...uniformPricing };
    updated[gender][category][index] = {
      ...updated[gender][category][index],
      [field]: value,
      totalPrice: field === 'price' || field === 'quantity' 
        ? (parseFloat(field === 'price' ? value : updated[gender][category][index].price) || 0) * 
          (parseInt(field === 'quantity' ? value : updated[gender][category][index].quantity) || 0)
        : updated[gender][category][index].totalPrice
    };
    setUniformPricing(updated);
  };

  const calculateTotal = (gender, category) => {
    return uniformPricing[gender][category].reduce((sum, item) => 
      sum + ((parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0)), 0);
  };

  const calculateGrandTotal = (gender) => {
    return Object.values(UNIFORM_CATEGORIES).reduce((total, category) => 
      total + calculateTotal(gender, category.toLowerCase()), 0);
  };

  const calculateOverallTotal = () => {
    return calculateGrandTotal('boys') + calculateGrandTotal('girls');
  };

  const handleBulkOrderSubmit = () => {
    const schoolData = {
      id: Date.now(),
      name: document.getElementById('schoolName').value,
      location: document.getElementById('schoolLocation').value,
      contact: {
        person: document.getElementById('contactPerson').value,
        phone: document.getElementById('contactPhone').value,
        email: document.getElementById('contactEmail').value
      },
      level: selectedLevel,
      uniforms: {
        boys: Object.entries(uniformPricing.boys).reduce((acc, [category, items]) => ({
          ...acc,
          [category]: items.map(item => ({
            ...item,
            levelType: item.level || selectedLevel?.id,
            totalPrice: (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0)
          }))
        }), {}),
        girls: Object.entries(uniformPricing.girls).reduce((acc, [category, items]) => ({
          ...acc,
          [category]: items.map(item => ({
            ...item,
            levelType: item.level || selectedLevel?.id,
            totalPrice: (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0)
          }))
        }), {})
      },
      orderDate: new Date().toISOString(),
      status: 'pending',
      totalAmount: calculateOverallTotal()
    };

    // Save to schools if new school
    if (isNewSchool) {
      const schoolDetails = {
        ...schoolData,
        image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
        students: "New",
        established: new Date().getFullYear(),
        rating: 5.0,
        reviews: 0,
        accreditation: "Pending",
        facilities: ["Digital Labs", "Auditorium"],
        timings: "8:00 AM - 2:30 PM",
        admissionOpen: true,
        uniformAvailability: "In Stock"
      };

      const existingSchools = JSON.parse(localStorage.getItem('schools')) || [];
      localStorage.setItem('schools', JSON.stringify([...existingSchools, schoolDetails]));
    }

    // Save bulk order
    const bulkOrders = JSON.parse(localStorage.getItem('bulkOrders')) || [];
    localStorage.setItem('bulkOrders', JSON.stringify([...bulkOrders, schoolData]));

    // Show success message
    alert('Order submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">School Bulk Order</h1>
              <p className="text-sm text-gray-500 mt-1">Create and manage school uniform orders</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                  <button
                    onClick={() => setActiveGender('boys')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                      ${activeGender === 'boys' 
                        ? 'bg-white text-red-600 shadow-sm' 
                        : 'text-gray-600 hover:bg-white/50'}`}
                  >
                    Boys
                  </button>
                  <button
                    onClick={() => setActiveGender('girls')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                      ${activeGender === 'girls' 
                        ? 'bg-white text-red-600 shadow-sm' 
                        : 'text-gray-600 hover:bg-white/50'}`}
                  >
                    Girls
                  </button>
                </div>

                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm bg-white min-w-[140px]"
                >
                  {Object.entries(UNIFORM_CATEGORIES).map(([key, value]) => (
                    <option key={value} value={value}>
                      {key.charAt(0) + key.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Header - School Selection */}
      <div className="w-full bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <select
                className="w-[400px] px-4 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:ring-2 focus:ring-red-500"
                onChange={(e) => {
                  const school = existingSchools.find(s => s.id === parseInt(e.target.value));
                  setSelectedSchool(school);
                  setIsNewSchool(false);
                }}
                value={selectedSchool?.id || ''}
              >
                <option value="">Select existing school</option>
                {existingSchools.map(school => (
                  <option key={school.id} value={school.id}>{school.name}</option>
                ))}
              </select>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">or</span>
                <button
                  onClick={() => {
                    setIsNewSchool(true);
                    setSelectedSchool(null);
                  }}
                  className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 
                           transition-colors text-sm font-medium inline-flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add New School
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1600px] mx-auto px-8 py-6">
        <div className="flex gap-8">
          {/* Left Side - Main Content */}
          <div className="flex-[3]">
            {/* New School Form - Show when isNewSchool is true */}
            {isNewSchool && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">School Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                    <input
                      id="schoolName"
                      type="text"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500"
                      placeholder="Enter school name"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      id="schoolLocation"
                      type="text"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500"
                      placeholder="Enter school location"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                    <input
                      id="contactPerson"
                      type="text"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500"
                      placeholder="Contact person name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      id="contactPhone"
                      type="tel"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500"
                      placeholder="Contact phone number"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      id="contactEmail"
                      type="email"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500"
                      placeholder="Contact email address"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Level Selection */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Level</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.values(LEVEL_TYPES).map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level)}
                    className={`p-4 rounded-xl border-2 transition-all text-left relative
                      ${selectedLevel?.id === level.id 
                        ? 'border-red-500 bg-red-50/50' 
                        : 'border-gray-200 hover:border-red-200 hover:bg-red-50/10'}`}
                  >
                    <h4 className="font-medium text-gray-900">{level.label}</h4>
                    <p className="text-sm text-gray-500 mt-1">{level.description}</p>
                    {level.forms && selectedLevel?.id === level.id && (
                      <div className="mt-3 space-y-1.5">
                        {level.forms.map((form) => (
                          <div key={form} className="text-sm text-gray-600 bg-white/80 px-2 py-1 rounded-lg border border-red-100">
                            {form}
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Uniform Items */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    {activeGender === 'boys' ? "Boys'" : "Girls'"} {activeCategory} Uniforms
                  </h3>
                  <button
                    onClick={() => handleAddItem(activeGender, activeCategory)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 
                             transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Item
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {uniformPricing[activeGender][activeCategory].map((item, index) => (
                    <UniformItemRow
                      key={item.id}
                      gender={activeGender}
                      category={activeCategory}
                      item={item}
                      index={index}
                      onUpdate={(index, field, value) => 
                        handleUpdateItem(activeGender, activeCategory, index, field, value)}
                      onRemove={(index) => 
                        handleRemoveItem(activeGender, activeCategory, index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Summary */}
          <div className="flex-1">
            <div className="sticky top-[104px] space-y-4">
              <OrderSummaryCard uniformPricing={uniformPricing} />
              
              <button
                onClick={handleBulkOrderSubmit}
                className="w-full py-4 bg-red-600 text-white rounded-xl font-medium 
                         hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <Package className="h-5 w-5" />
                Submit Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Order = () => {
  const [orderType, setOrderType] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isNewSchool, setIsNewSchool] = useState(false);
  const [formClasses, setFormClasses] = useState([]);
  const [uniformTypes, setUniformTypes] = useState([]);
  const [uniformPricing, setUniformPricing] = useState({
    boys: { 
      summer: [], 
      winter: [], 
      sports: [],
      universal: []
    },
    girls: { 
      summer: [], 
      winter: [], 
      sports: [],
      universal: []
    }
  });
  const [quantities, setQuantities] = useState({
    boys: {
      summer: {},
      winter: {},
      sports: {},
      universal: {}
    },
    girls: {
      summer: {},
      winter: {},
      sports: {},
      universal: {}
    }
  });
  const [orderTotals, setOrderTotals] = useState({
    boys: {
      summerTotal: 0,
      winterTotal: 0,
      sportsTotal: 0,
      grandTotal: 0
    },
    girls: {
      summerTotal: 0,
      winterTotal: 0,
      sportsTotal: 0,
      grandTotal: 0
    },
    overallTotal: 0
  });
  const [orderStatus, setOrderStatus] = useState('pending');
  const [showOrderStatus, setShowOrderStatus] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [activeGender, setActiveGender] = useState('boys');
  const [activeCategory, setActiveCategory] = useState('summer');
  const [orderToVerify, setOrderToVerify] = useState(null);

  const calculateTotal = (gender, season) => {
    if (!uniformPricing[gender] || !uniformPricing[gender][season]) {
      return 0;
    }
    return uniformPricing[gender][season].reduce((total, item) => {
      return total + (parseFloat(item.price) || 0);
    }, 0);
  };

  const calculateGrandTotal = (gender) => {
    if (!uniformPricing[gender]) {
      return 0;
    }
    return Object.keys(UNIFORM_CATEGORIES).reduce((total, category) => {
      const categoryValue = UNIFORM_CATEGORIES[category].toLowerCase();
      return total + calculateTotal(gender, categoryValue);
    }, 0);
  };

  const calculateOverallTotal = () => {
    return calculateGrandTotal('boys') + calculateGrandTotal('girls');
  };

  const handleClassAdd = () => {
    setFormClasses([...formClasses, { name: '', boys: 0, girls: 0 }]);
  };

  const handleClassRemove = (index) => {
    setFormClasses(formClasses.filter((_, i) => i !== index));
  };

  const handleAddItem = (gender, season) => {
    const updated = { ...uniformPricing };
    updated[gender][season] = [
      ...updated[gender][season],
      { 
        id: Date.now(), 
        type: '',
        variant: '',
        price: '',
        quantity: 0
      }
    ];
    setUniformPricing(updated);
  };

  const handleRemoveItem = (gender, season, index) => {
    const updated = { ...uniformPricing };
    updated[gender][season] = updated[gender][season].filter((_, i) => i !== index);
    setUniformPricing(updated);
  };

  const handleUpdateItem = (gender, category, index, field, value) => {
    const updated = { ...uniformPricing };
    updated[gender][category][index] = {
      ...updated[gender][category][index],
      [field]: value,
      totalPrice: field === 'price' || field === 'quantity' 
        ? (parseFloat(field === 'price' ? value : updated[gender][category][index].price) || 0) * 
          (parseInt(field === 'quantity' ? value : updated[gender][category][index].quantity) || 0)
        : updated[gender][category][index].totalPrice
    };
    setUniformPricing(updated);
  };

  const calculateItemTotal = (gender, season, itemId) => {
    if (!uniformPricing[gender] || !uniformPricing[gender][season]) {
      return 0;
    }
    const item = uniformPricing[gender][season].find(i => i.id === itemId);
    const quantity = quantities[gender][season][itemId] || 0;
    return (parseFloat(item?.price) || 0) * quantity;
  };

  const calculateSeasonTotal = (gender, season) => {
    if (!uniformPricing[gender] || !uniformPricing[gender][season]) {
      return 0;
    }
    return uniformPricing[gender][season].reduce((total, item) => {
      return total + calculateItemTotal(gender, season, item.id);
    }, 0);
  };

  const calculateGenderTotal = (gender) => {
    if (!uniformPricing[gender]) {
      return 0;
    }
    return Object.values(UNIFORM_CATEGORIES).reduce((total, season) => {
      return total + calculateSeasonTotal(gender, season.toLowerCase());
    }, 0);
  };

  useEffect(() => {
    const newTotals = {
      boys: {
        summerTotal: calculateSeasonTotal('boys', 'summer'),
        winterTotal: calculateSeasonTotal('boys', 'winter'),
        sportsTotal: calculateSeasonTotal('boys', 'sports'),
        grandTotal: calculateGenderTotal('boys')
      },
      girls: {
        summerTotal: calculateSeasonTotal('girls', 'summer'),
        winterTotal: calculateSeasonTotal('girls', 'winter'),
        sportsTotal: calculateSeasonTotal('girls', 'sports'),
        grandTotal: calculateGenderTotal('girls')
      },
      overallTotal: calculateOverallTotal()
    };

    setOrderTotals(newTotals);
  }, [quantities, uniformPricing]);

  const handleQuantityChange = (gender, season, itemId, value) => {
    const numValue = parseInt(value) || 0;
    if (numValue < 0) return; // Prevent negative values
    
    setQuantities(prev => ({
      ...prev,
      [gender]: {
        ...prev[gender],
        [season]: {
          ...prev[gender][season],
          [itemId]: numValue
        }
      }
    }));
  };

  const handlePriceChange = (gender, season, index, value) => {
    const numValue = parseFloat(value) || 0;
    if (numValue < 0) return; // Prevent negative values
    
    const updated = { ...uniformPricing };
    updated[gender][season][index].price = numValue.toString();
    setUniformPricing(updated);
  };

  const handleNewSchoolSubmit = () => {
    if (!isNewSchool) return;

    const schoolData = {
      name: document.getElementById('schoolName').value,
      location: document.getElementById('schoolLocation').value,
      uniformPricing,
      phone: document.getElementById('contactPhone').value,
      email: document.getElementById('contactEmail').value,
    };

    const newSchool = addNewSchoolToList(schoolData);
    setSelectedSchool(newSchool);
    setIsNewSchool(false);

    // Show success message
    alert('School added successfully!');
  };

  const handleBulkOrderSubmit = () => {
    const schoolData = {
      id: Date.now(),
      name: document.getElementById('schoolName').value,
      location: document.getElementById('schoolLocation').value,
      contact: {
        person: document.getElementById('contactPerson').value,
        phone: document.getElementById('contactPhone').value,
        email: document.getElementById('contactEmail').value
      },
      level: selectedLevel,
      uniforms: {
        boys: Object.entries(uniformPricing.boys).reduce((acc, [category, items]) => ({
          ...acc,
          [category]: items.map(item => ({
            ...item,
            levelType: item.level || selectedLevel?.id,
            totalPrice: (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0)
          }))
        }), {}),
        girls: Object.entries(uniformPricing.girls).reduce((acc, [category, items]) => ({
          ...acc,
          [category]: items.map(item => ({
            ...item,
            levelType: item.level || selectedLevel?.id,
            totalPrice: (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0)
          }))
        }), {})
      },
      orderDate: new Date().toISOString(),
      status: 'pending',
      totalAmount: calculateOverallTotal()
    };

    setOrderToVerify(schoolData);
  };

  const renderForm = () => {
    if (!orderType) {
      return (
        <div className="min-h-screen bg-gray-50 pt-[104px]">
          <div className="max-w-[1600px] mx-auto px-8 py-12">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gray-900">Place Your Order</h1>
              <p className="mt-2 text-gray-600">Choose your order type to get started</p>
            </div>

            <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
              <button
                onClick={() => setOrderType('school')}
                className="bg-white p-8 rounded-xl border border-gray-200 hover:border-red-200 
                         hover:shadow-lg transition-all group text-left"
              >
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                  <School className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">School Bulk Order</h3>
                <p className="mt-2 text-gray-600">Place bulk orders for school uniforms with customization options</p>
                <div className="mt-4 flex items-center text-red-600 font-medium">
                  Get Started 
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button
                onClick={() => setOrderType('parent')}
                className="bg-white p-8 rounded-xl border border-gray-200 hover:border-red-200 
                         hover:shadow-lg transition-all group text-left"
              >
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                  <User className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Parent Order</h3>
                <p className="mt-2 text-gray-600">Order uniforms for individual students</p>
                <div className="mt-4 flex items-center text-red-600 font-medium">
                  Get Started 
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (orderType === 'school') {
      return <SchoolBulkOrder />;
    }

    if (orderType === 'parent') {
      return <ParentOrderForm />;
    }

    return null;
  };

  const OrderStatusModal = ({ status, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            {status === 'pending' ? (
              <>
                <div className="animate-spin w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Your Order</h3>
                <p className="text-gray-600">Please wait while we submit your order...</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Order Submitted Successfully!</h3>
                <p className="text-gray-600 mb-4">
                  Your order has been submitted and is awaiting approval from Monisha Uniforms. 
                  We'll notify you once it's approved.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  View Order Status
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const OrderSummaryCard = ({ uniformPricing }) => {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-4">Order Summary</h4>
        
        <div className="space-y-4">
          {['boys', 'girls'].map(gender => (
            <div key={gender} className="p-4 bg-gray-50/50 rounded-lg border border-gray-100">
              <h5 className="font-medium text-gray-800 capitalize mb-3">{gender}</h5>
              
              {Object.entries(UNIFORM_CATEGORIES).map(([key, category]) => {
                const items = uniformPricing[gender][category];
                const categoryTotal = items.reduce((sum, item) => 
                  sum + ((parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0)), 0);
                
                return categoryTotal > 0 ? (
                  <div key={category} className="flex justify-between text-sm py-1.5">
                    <span className="text-gray-600">{key.charAt(0) + key.slice(1).toLowerCase()}</span>
                    <span className="font-medium">${categoryTotal.toFixed(2)}</span>
                  </div>
                ) : null;
              })}
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-red-600 font-bold">${calculateGrandTotal(gender).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Grand Total</span>
              <span className="text-xl font-bold text-red-600">
                ${calculateOverallTotal().toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const OrderVerificationModal = ({ order, onConfirm, onCancel }) => {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Verify Order Details</h3>
            <p className="text-sm text-gray-500 mt-1">Please review your order details before submitting</p>
          </div>

          <div className="p-6 space-y-6">
            {/* School Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">School Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">School Name:</span>
                  <span className="ml-2 text-gray-900">{order.name}</span>
                </div>
                <div>
                  <span className="text-gray-500">Location:</span>
                  <span className="ml-2 text-gray-900">{order.location}</span>
                </div>
                <div>
                  <span className="text-gray-500">Contact Person:</span>
                  <span className="ml-2 text-gray-900">{order.contact.person}</span>
                </div>
                <div>
                  <span className="text-gray-500">Phone:</span>
                  <span className="ml-2 text-gray-900">{order.contact.phone}</span>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>
                  <span className="ml-2 text-gray-900">{order.contact.email}</span>
                </div>
                <div>
                  <span className="text-gray-500">Academic Level:</span>
                  <span className="ml-2 text-gray-900">{order.level?.label}</span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
              {['boys', 'girls'].map(gender => (
                <div key={gender} className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 capitalize mb-2">{gender}</h5>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {Object.entries(order.uniforms[gender]).map(([category, items]) => {
                      const categoryTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
                      if (items.length === 0 || categoryTotal === 0) return null;

                      return (
                        <div key={category} className="mb-4 last:mb-0">
                          <div className="text-sm font-medium text-gray-700 capitalize mb-2">
                            {category}
                          </div>
                          <div className="space-y-2">
                            {items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  {item.type} - {item.variant} (x{item.quantity})
                                </span>
                                <span className="font-medium">${item.totalPrice.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Total Amount</span>
                  <span className="text-xl font-bold text-red-600">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                       transition-colors flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[104px]">
      {renderForm()}

      {/* Verification Modal */}
      {orderToVerify && (
        <OrderVerificationModal
          order={orderToVerify}
          onCancel={() => setOrderToVerify(null)}
          onConfirm={() => {
            setShowOrderStatus(true);
            setOrderStatus('pending');

            // Save to schools if new school
            if (isNewSchool) {
              const schoolDetails = {
                ...orderToVerify,
                image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
                students: "New",
                established: new Date().getFullYear(),
                rating: 5.0,
                reviews: 0,
                accreditation: "Pending",
                facilities: ["Digital Labs", "Auditorium"],
                timings: "8:00 AM - 2:30 PM",
                admissionOpen: true,
                uniformAvailability: "In Stock"
              };

              const existingSchools = JSON.parse(localStorage.getItem('schools')) || [];
              localStorage.setItem('schools', JSON.stringify([...existingSchools, schoolDetails]));
            }

            // Save bulk order
            const bulkOrders = JSON.parse(localStorage.getItem('bulkOrders')) || [];
            localStorage.setItem('bulkOrders', JSON.stringify([...bulkOrders, orderToVerify]));

            setOrderToVerify(null);

            // Show success after delay
            setTimeout(() => {
              setOrderStatus('submitted');
            }, 2000);
          }}
        />
      )}

      {/* Order Status Modal */}
      {showOrderStatus && (
        <OrderStatusModal
          status={orderStatus}
          onClose={() => setShowOrderStatus(false)}
        />
      )}
    </div>
  );
};

export default Order; 