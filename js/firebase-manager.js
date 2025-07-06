// Firebase imports and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuZNXqQrfU0iE9jt0behXaFN_FKVmbH58",
  authDomain: "ratonludico.firebaseapp.com",
  projectId: "ratonludico",
  storageBucket: "ratonludico.firebasestorage.app",
  messagingSenderId: "122019479315",
  appId: "1:122019479315:web:425c7f3406735af8e924e6",
  measurementId: "G-YE73FV3ZJ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Database operations
const UserManager = {
  // Load all users and populate table
  async loadUsers() {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const tableBody = document.getElementById('users-table-body');
    
    if (loadingEl) loadingEl.style.display = 'block';
    if (errorEl) errorEl.style.display = 'none';
    
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const users = [];
      
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      this.displayUsers(users);
    } catch (error) {
      console.error('Error loading users:', error);
      if (errorEl && errorText) {
        errorText.textContent = 'Error cargando usuarios. Intenta nuevamente.';
        errorEl.style.display = 'block';
      }
    } finally {
      if (loadingEl) loadingEl.style.display = 'none';
    }
  },
  
  // Display users in table
  displayUsers(users) {
    const tableBody = document.getElementById('users-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.nombre}</td>
        <td>${user.correo}</td>
        <td>
          <a href="form.html?id=${user.id}" class="btn btn-primary" role="button">Editar</a>
          <a href="#" class="btn btn-danger" role="button" onclick="UserManager.deleteUser('${user.id}'); return false;" 
             onmousedown="return confirm('¿Seguro que deseas eliminar este usuario?');">Eliminar</a>
        </td>
      `;
      tableBody.appendChild(row);
    });
  },
  
  // Add new user
  async addUser(nombre, correo) {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error-message') || document.getElementById('errorAlert');
    const errorText = document.getElementById('error-text') || document.getElementById('errorList');
    const successEl = document.getElementById('success-message') || document.getElementById('successAlert');
    const successText = document.getElementById('success-text') || document.getElementById('successMessage');
    
    if (loadingEl) loadingEl.style.display = 'block';
    if (errorEl) errorEl.style.display = 'none';
    if (successEl) successEl.style.display = 'none';
    
    try {
      await addDoc(collection(db, 'users'), {
        nombre: nombre,
        correo: correo
      });
      
      if (successEl && successText) {
        successText.textContent = 'Usuario agregado exitosamente.';
        successEl.style.display = 'block';
      }
      
      // Clear form after successful add
      const form = document.getElementById('userForm');
      if (form) {
        form.reset();
      }
      
      // Redirect to register page after successful add
      setTimeout(() => {
        window.location.href = 'register';
      }, 1500);
      
    } catch (error) {
      console.error('Error adding user:', error);
      if (errorEl && errorText) {
        errorText.textContent = 'Error agregando usuario. Intenta nuevamente.';
        errorEl.style.display = 'block';
      }
    } finally {
      if (loadingEl) loadingEl.style.display = 'none';
    }
  },
  
  // Get user by ID
  async getUserById(userId) {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        throw new Error('Usuario no encontrado');
      }
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },
  
  // Update user
  async updateUser(userId, nombre, correo) {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error-message') || document.getElementById('errorAlert');
    const errorText = document.getElementById('error-text') || document.getElementById('errorList');
    const successEl = document.getElementById('success-message') || document.getElementById('successAlert');
    const successText = document.getElementById('success-text') || document.getElementById('successMessage');
    
    if (loadingEl) loadingEl.style.display = 'block';
    if (errorEl) errorEl.style.display = 'none';
    if (successEl) successEl.style.display = 'none';
    
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, {
        nombre: nombre,
        correo: correo
      });
      
      if (successEl && successText) {
        successText.textContent = 'Usuario actualizado exitosamente.';
        successEl.style.display = 'block';
      }
      
      // Redirect to register page after successful update
      setTimeout(() => {
        window.location.href = 'register';
      }, 1500);
      
    } catch (error) {
      console.error('Error updating user:', error);
      if (errorEl && errorText) {
        errorText.textContent = 'Error actualizando usuario. Intenta nuevamente.';
        errorEl.style.display = 'block';
      }
    } finally {
      if (loadingEl) loadingEl.style.display = 'none';
    }
  },
  
  // Delete user
  async deleteUser(userId) {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const successEl = document.getElementById('success-message');
    const successText = document.getElementById('success-text');
    
    if (loadingEl) loadingEl.style.display = 'block';
    if (errorEl) errorEl.style.display = 'none';
    if (successEl) successEl.style.display = 'none';
    
    try {
      await deleteDoc(doc(db, 'users', userId));
      
      if (successEl && successText) {
        successText.textContent = 'Usuario eliminado exitosamente.';
        successEl.style.display = 'block';
      }
      
      // Reload users after successful deletion
      setTimeout(() => {
        this.loadUsers();
      }, 1000);
      
    } catch (error) {
      console.error('Error deleting user:', error);
      if (errorEl && errorText) {
        errorText.textContent = 'Error eliminando usuario. Intenta nuevamente.';
        errorEl.style.display = 'block';
      }
    } finally {
      if (loadingEl) loadingEl.style.display = 'none';
    }
  }
};

// Form validation
const FormValidator = {
  validateForm(nombre, correo) {
    const errors = [];
    
    // Validate nombre (required, max 100 chars)
    if (!nombre || nombre.trim().length === 0) {
      errors.push('El nombre de usuario es requerido.');
    } else if (nombre.length > 100) {
      errors.push('El nombre de usuario no puede exceder 100 caracteres.');
    }
    
    // Validate correo (required, max 30 chars, basic email format)
    if (!correo || correo.trim().length === 0) {
      errors.push('El correo electrónico es requerido.');
    } else if (correo.length > 30) {
      errors.push('El correo electrónico no puede exceder 30 caracteres.');
    } else if (!this.isValidEmail(correo)) {
      errors.push('Por favor ingresa un correo electrónico válido.');
    }
    
    return errors;
  },
  
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  showValidationErrors(errors) {
    // Try both possible error elements
    const errorEl = document.getElementById('error-message') || document.getElementById('errorAlert');
    const errorText = document.getElementById('error-text') || document.getElementById('errorList');
    
    if (errors.length > 0 && errorEl && errorText) {
      errorText.innerHTML = errors.join('<br>');
      errorEl.style.display = 'block';
    } else if (errorEl) {
      errorEl.style.display = 'none';
    }
  }
};

// URL parameter helper
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Helper function to get current page name (handles both with and without .html extension)
function getCurrentPageName() {
  const currentPage = window.location.pathname.split('/').pop();
  // Remove .html extension if present, or return as-is if not
  return currentPage.replace('.html', '');
}

// Initialize based on current page
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing Firebase manager...');
  
  const currentPage = getCurrentPageName();
  console.log('Current page:', currentPage);
  
  if (currentPage === 'register') {
    console.log('Loading users for register page...');
    // Load users when on register page
    UserManager.loadUsers();
  } else if (currentPage === 'form') {
    console.log('Initializing form page...');
    // Handle form page logic
    const userId = getUrlParameter('id');
    console.log('User ID from URL:', userId);
    
    if (userId) {
      console.log('Editing existing user:', userId);
      // Editing existing user
      UserManager.getUserById(userId).then(user => {
        console.log('Loaded user for editing:', user);
        document.getElementById('nombre').value = user.nombre;
        document.getElementById('correo').value = user.correo;
        const form = document.getElementById('userForm');
        if (form) {
          form.dataset.userId = userId;
          // Update submit button text
          const submitBtnText = document.getElementById('submitBtnText');
          if (submitBtnText) {
            submitBtnText.textContent = 'Actualizar';
          }
        }
      }).catch(error => {
        console.error('Error loading user for edit:', error);
        const errorEl = document.getElementById('error-message') || document.getElementById('errorAlert');
        const errorText = document.getElementById('error-text') || document.getElementById('errorList');
        if (errorEl && errorText) {
          errorText.textContent = 'Error cargando usuario para editar.';
          errorEl.style.display = 'block';
        }
      });
    }
    
    // Handle form submission
    const form = document.getElementById('userForm');
    if (form) {
      console.log('Form found, adding event listener...');
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submitted');
        
        const nombre = document.getElementById('nombre').value.trim();
        const correo = document.getElementById('correo').value.trim();
        
        console.log('Form data:', { nombre, correo });
        
        // Validate form
        const errors = FormValidator.validateForm(nombre, correo);
        if (errors.length > 0) {
          console.log('Validation errors:', errors);
          FormValidator.showValidationErrors(errors);
          return;
        }
        
        // Clear previous errors
        FormValidator.showValidationErrors([]);
        
        // Show loading state
        const submitBtn = document.getElementById('submitBtn');
        const submitBtnText = document.getElementById('submitBtnText');
        const submitBtnSpinner = document.getElementById('submitBtnSpinner');
        
        if (submitBtn) submitBtn.disabled = true;
        if (submitBtnText) submitBtnText.style.display = 'none';
        if (submitBtnSpinner) submitBtnSpinner.style.display = 'inline-block';
        
        try {
          // Submit form
          const userId = form.dataset.userId;
          if (userId) {
            console.log('Updating user:', userId);
            // Update existing user
            await UserManager.updateUser(userId, nombre, correo);
          } else {
            console.log('Adding new user');
            // Add new user
            await UserManager.addUser(nombre, correo);
          }
        } catch (error) {
          console.error('Error submitting form:', error);
        } finally {
          // Reset loading state
          if (submitBtn) submitBtn.disabled = false;
          if (submitBtnText) submitBtnText.style.display = 'inline';
          if (submitBtnSpinner) submitBtnSpinner.style.display = 'none';
        }
      });
    } else {
      console.error('Form not found!');
    }
  }
});

// Make UserManager globally available for onclick handlers
window.UserManager = UserManager;
console.log('Firebase manager loaded successfully');
