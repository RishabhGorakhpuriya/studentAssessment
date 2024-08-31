import React, { useContext, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
    // Initial state for signup and login
    const initialSignupValue = { fullName: '', emailId: '', password: '', role: '' };
    const [credential, setCredential] = useState(initialSignupValue);
    const [error, setError] = useState('');
    const [formError, setFormError] = useState({});
    const initialLoginValue = { emailId: '', password: '' };
    const [credentialLogin, setCredentialLogin] = useState(initialLoginValue);
   
    // Handle changes for signup form
    const SignuphandleChange = (e) => {
        setCredential({ ...credential, [e.target.name]: e.target.value });
    };

    // Validate signup form fields
    const validateSignup = (values) => {
        const errors = {};
        if (!values.fullName) errors.fullName = 'Full name is required';
        if (!values.emailId) errors.emailId = 'Email is required';
        if (!values.password) errors.password = 'Password is required';
        if (!values.role) errors.role = 'Role is required';
        return errors;
    };

    // Handle form submission for signup
    const SignupHandleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateSignup(credential);
        setFormError(errors);

        if (Object.keys(errors).length > 0) {
            return { success: false };
        }

        try {
            await axios.post("http://localhost:4000/auth/signup", credential);
            // Handle successful signup
            return { success: true }; // Indicate success
        } catch (error) {
            setError('Registration failed. Please try again.');
            return { success: false }; // Indicate failure
        }
    };

    // Handle changes for login form
    const LoginHandleChange = (e) => {
        setCredentialLogin({ ...credentialLogin, [e.target.name]: e.target.value });
    };

    // Validate login form fields
    const validateLogin = (values) => {
        const errors = {};
        if (!values.emailId) errors.emailId = 'Email is required';
        if (!values.password) errors.password = 'Password is required';
        return errors;
    };

    // Handle form submission for login
    const LoginHandleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateLogin(credentialLogin);
        setFormError(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            const response = await axios.post("http://localhost:4000/auth/login", credentialLogin);
            // Handle successful login, e.g., store tokens, redirect
            const { token } = response.data;
            
            console.log(token)
        
        if (token) {
            // Store the token in local storage
            localStorage.setItem('token', token);
            const decoded = jwtDecode(token);
            localStorage.setItem('fullName', decoded.fullname);
            localStorage.setItem('id', decoded.id);
            localStorage.setItem('emailId', decoded.emailId)
            localStorage.setItem('role', decoded.role)
            // Optionally, you can also store additional information such as user info or role
            // localStorage.setItem('user', JSON.stringify(response.data.users));
            
            // Handle successful login (e.g., redirect to another page)
            console.log("Login successful!");
            return { success: true };
            // Redirect or update state as needed
        }
        } catch (error) {
            setError('Login failed. Please try again.');
        }
    };
   

    return (
        <AppContext.Provider value={{ 
            credential, 
            SignuphandleChange, 
            SignupHandleSubmit, 
            error, 
            formError, 
            LoginHandleChange, 
            LoginHandleSubmit, 
            credentialLogin, 
            setCredentialLogin 
        }}>
            {children}
        </AppContext.Provider>
    );
};

const useGlobalContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useGlobalContext must be used within an AppProvider');
    }
    return context;
};

export { AppContext, useGlobalContext, AppProvider };
