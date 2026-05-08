export const validateName = (name) => {
  if (!name) return "Name is required.";
  if (name.length < 1) return "Name must be at least 1 characters.";
  if (name.length > 20) return "Name must not exceed 20 characters.";
  return "";
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required.";
  if (!regex.test(email)) return "Enter a valid email address.";
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Password is required.";
  if (password.length < 8 || password.length > 16)
    return "Password must be 8-16 characters.";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter.";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    return "Password must contain at least one special character.";
  return "";
};

export const validateAddress = (address) => {
  if (address && address.length > 400)
    return "Address must not exceed 400 characters.";
  return "";
};