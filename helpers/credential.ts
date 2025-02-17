function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

interface AuthErrors {
  email: string;
  password: string;
}

function validatePassword(password: string) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

function validAuthUser(email: string, password: string): AuthErrors {
  const errors = {} as AuthErrors;

  if (!validateEmail(email)) {
    errors.email = 'Invalid email';
  }
  if (!validatePassword(password)) {
    errors.password = 'Invalid password';
  }
  return errors;
}

export { validateEmail, validatePassword, validAuthUser };
