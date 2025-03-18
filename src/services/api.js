import firebaseService from './firebase';

const api = {
  getRecentProducts: async () => {
    try {
      const uniforms = await firebaseService.getRecentUniforms();
      return uniforms.map(uniform => transformUniformToProduct(uniform));
    } catch (error) {
      console.error("Error in getRecentProducts:", error);
      throw error;
    }
  },

  getTopRatedProducts: async () => {
    try {
      const uniforms = await firebaseService.getTopRatedUniforms();
      return uniforms.map(uniform => transformUniformToProduct(uniform));
    } catch (error) {
      console.error("Error in getTopRatedProducts:", error);
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      const uniform = await firebaseService.getUniformById(id);
      return transformUniformToProduct(uniform);
    } catch (error) {
      console.error("Error in getProductById:", error);
      throw error;
    }
  },

  getAllProducts: async () => {
    try {
      const uniforms = await firebaseService.getAllUniforms();
      return uniforms.map(uniform => transformUniformToProduct(uniform));
    } catch (error) {
      console.error("Error in getAllProducts:", error);
      throw error;
    }
  },

  getProductsByCategory: async (category) => {
    try {
      const uniforms = await firebaseService.getUniformsByCategory(category);
      return uniforms.map(uniform => transformUniformToProduct(uniform));
    } catch (error) {
      console.error("Error in getProductsByCategory:", error);
      throw error;
    }
  },

  getProductsBySchool: async (schoolId) => {
    try {
      const uniforms = await firebaseService.getUniformsBySchool(schoolId);
      return uniforms.map(uniform => transformUniformToProduct(uniform));
    } catch (error) {
      console.error("Error in getProductsBySchool:", error);
      throw error;
    }
  },

  getAllSchools: async () => {
    try {
      return await firebaseService.getAllSchools();
    } catch (error) {
      console.error("Error in getAllSchools:", error);
      throw error;
    }
  },

  getSchoolById: async (id) => {
    try {
      return await firebaseService.getSchoolById(id);
    } catch (error) {
      console.error("Error in getSchoolById:", error);
      throw error;
    }
  }
};

// Helper function to transform uniform data to match the expected product format in UI
function transformUniformToProduct(uniform) {
  // Transform Firebase uniform document to match the expected product structure in the UI
  // Based on what we know about the uniform structure
  let schoolName = "";
  
  // Get school name if school ID is provided and it's a string
  if (uniform.school && typeof uniform.school === 'string') {
    try {
      // This is asynchronous, so we can't use it directly here
      // Instead we'll handle school name elsewhere in the UI
      schoolName = "School Information Loading..."; 
    } catch (error) {
      console.error("Error getting school name:", error);
    }
  }
  
  // Process colors to ensure they're in a consistent format
  let processedColors = null;
  if (uniform.colors) {
    if (Array.isArray(uniform.colors)) {
      processedColors = uniform.colors;
    } else if (typeof uniform.colors === 'string') {
      processedColors = [uniform.colors];
    } else if (typeof uniform.colors === 'object') {
      // Convert object to array
      processedColors = [uniform.colors];
    }
  } else if (uniform.color) {
    if (Array.isArray(uniform.color)) {
      processedColors = uniform.color;
    } else if (typeof uniform.color === 'string') {
      processedColors = [uniform.color];
    } else if (typeof uniform.color === 'object') {
      processedColors = [uniform.color];
    }
  }
  
  // Process variants to ensure they're in a consistent format
  let processedVariants = null;
  if (uniform.variants) {
    if (Array.isArray(uniform.variants)) {
      processedVariants = uniform.variants;
    } else if (typeof uniform.variants === 'string') {
      processedVariants = [uniform.variants];
    } else if (typeof uniform.variants === 'object') {
      // Convert object to array
      processedVariants = [uniform.variants];
    }
  } else if (uniform.variant) {
    if (Array.isArray(uniform.variant)) {
      processedVariants = uniform.variant;
    } else if (typeof uniform.variant === 'string') {
      processedVariants = [uniform.variant];
    } else if (typeof uniform.variant === 'object') {
      processedVariants = [uniform.variant];
    }
  }
  
  return {
    id: uniform.id,
    name: uniform.name || "Uniform",
    price: uniform.price || 0,
    description: uniform.description || "School uniform",
    images: Array.isArray(uniform.images) ? uniform.images : 
            uniform.image ? [uniform.image] : 
            ["https://placehold.co/800x1000/f3f4f6/64748b?text=School+Uniform"],
    stock: uniform.stock || 10,
    type: uniform.type || "uniform",
    category: uniform.category || "School Uniform",
    sizes: Array.isArray(uniform.sizes) ? uniform.sizes : 
           [
             { size: 'S', inStock: true },
             { size: 'M', inStock: true },
             { size: 'L', inStock: true }
           ],
    schoolName: schoolName,
    schoolId: uniform.school || "",
    gender: uniform.gender || "Unisex",
    rating: uniform.rating || 4.5,
    features: Array.isArray(uniform.features) ? uniform.features : 
              ["Quality uniform", "Comfortable fit", "Durable material"],
    // Use our processed variant information
    colors: processedColors,
    variants: processedVariants
  };
}

export default api; 