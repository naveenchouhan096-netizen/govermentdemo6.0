function showForm(type) {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const loginTabBtn = document.getElementById('loginTabBtn');
  const signupTabBtn = document.getElementById('signupTabBtn');

  if (type === 'login') {
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
    loginTabBtn.classList.add('active');
    signupTabBtn.classList.remove('active');
  } else {
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
    signupTabBtn.classList.add('active');
    loginTabBtn.classList.remove('active');
  }
}

function togglePassword(fieldId, icon) {
  const field = document.getElementById(fieldId);
  if (field.type === 'password') {
    field.type = 'text';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  } else {
    field.type = 'password';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  }
}

function setFieldError(inputEl, errorEl, isValid) {
  if (isValid) {
    inputEl.classList.remove('input-error');
    errorEl.classList.remove('show');
  } else {
    inputEl.classList.add('input-error');
    errorEl.classList.add('show');
  }
}

// Login form validation
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const userInput = document.getElementById('loginUser');
  const passwordInput = document.getElementById('loginPassword');
  let isValid = true;

  if (userInput.value.trim() === '') {
    setFieldError(userInput, document.getElementById('loginUserError'), false);
    isValid = false;
  } else {
    setFieldError(userInput, document.getElementById('loginUserError'), true);
  }

  if (passwordInput.value.trim() === '') {
    setFieldError(passwordInput, document.getElementById('loginPasswordError'), false);
    isValid = false;
  } else {
    setFieldError(passwordInput, document.getElementById('loginPasswordError'), true);
  }

  if (isValid) {
    document.getElementById('loginSuccess').classList.add('show');
    this.reset();
    setTimeout(() => {
      document.getElementById('loginSuccess').classList.remove('show');
    }, 3000);
  }
});

// Signup form validation
document.getElementById('signupForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const nameInput = document.getElementById('signupName');
  const emailInput = document.getElementById('signupEmail');
  const mobileInput = document.getElementById('signupMobile');
  const passwordInput = document.getElementById('signupPassword');
  const confirmPasswordInput = document.getElementById('signupConfirmPassword');

  let isValid = true;

  if (nameInput.value.trim() === '') {
    setFieldError(nameInput, document.getElementById('signupNameError'), false);
    isValid = false;
  } else {
    setFieldError(nameInput, document.getElementById('signupNameError'), true);
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailInput.value.trim())) {
    setFieldError(emailInput, document.getElementById('signupEmailError'), false);
    isValid = false;
  } else {
    setFieldError(emailInput, document.getElementById('signupEmailError'), true);
  }

  const mobilePattern = /^[6-9]\d{9}$/;
  if (!mobilePattern.test(mobileInput.value.trim())) {
    setFieldError(mobileInput, document.getElementById('signupMobileError'), false);
    isValid = false;
  } else {
    setFieldError(mobileInput, document.getElementById('signupMobileError'), true);
  }

  if (passwordInput.value.length < 8) {
    setFieldError(passwordInput, document.getElementById('signupPasswordError'), false);
    isValid = false;
  } else {
    setFieldError(passwordInput, document.getElementById('signupPasswordError'), true);
  }

  if (confirmPasswordInput.value !== passwordInput.value || confirmPasswordInput.value === '') {
    setFieldError(confirmPasswordInput, document.getElementById('signupConfirmPasswordError'), false);
    isValid = false;
  } else {
    setFieldError(confirmPasswordInput, document.getElementById('signupConfirmPasswordError'), true);
  }

  if (isValid) {
    document.getElementById('signupSuccess').classList.add('show');
    this.reset();
    setTimeout(() => {
      document.getElementById('signupSuccess').classList.remove('show');
      showForm('login');
    }, 2000);
  }
});