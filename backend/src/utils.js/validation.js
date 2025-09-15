const validateEmployee = (data) => {
  console.log(data.hireDate, isValidDate(data.hireDate), 'testing21', data)
  const errors = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Valid email is required');
  }
  
  if (!data.position || data.position.trim().length < 2) {
    errors.push('Position must be at least 2 characters long');
  }
  
  if (!data.department || data.department.trim().length < 2) {
    errors.push('Department must be at least 2 characters long');
  }
  
  if (!data.salary || data.salary <= 0) {
    errors.push('Salary must be a positive number');
  }
  
  if (!data.hireDate || !isValidDate(data.hireDate)) {
    errors.push('Valid hire date is required');
  }
  
  return errors;
};

const validateLogin = (data) => {
  const errors = [];
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Valid email is required');
  }
  
  if (!data.password || data.password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  return errors;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};


module.exports = {
  validateEmployee,
  validateLogin,
  isValidEmail,
  isValidDate
};