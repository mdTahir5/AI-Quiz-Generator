import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  Lock,
  Eye,
  EyeOff,
  BrainCircuit,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function RegisterPage({ onSwitchToLogin }) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    age: '',
    address: '',
    schoolOrInstitute: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (serverError) setServerError('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Full name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!formData.phoneNumber.trim() || formData.phoneNumber.trim().length < 8) {
      newErrors.phoneNumber = 'Enter a valid phone number (min 8 digits)';
    }

    const ageNum = parseInt(formData.age, 10);
    if (!formData.age || isNaN(ageNum) || ageNum < 5 || ageNum > 120) {
      newErrors.age = 'Age must be between 5 and 120';
    }

    if (!formData.address.trim() || formData.address.trim().length < 5) {
      newErrors.address = 'Address must be at least 5 characters';
    }

    if (!formData.schoolOrInstitute.trim() || formData.schoolOrInstitute.trim().length < 2) {
      newErrors.schoolOrInstitute = 'School / Institute name is required';
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError('');

    try {
      const payload = {
        ...formData,
        age: parseInt(formData.age, 10),
      };
      const res = await register(payload);
      if (!res.success) {
        setServerError(res.message || 'Registration failed.');
      }
    } catch (err) {
      const backendErrors = err?.response?.data?.data;
      if (backendErrors && typeof backendErrors === 'object') {
        setErrors(backendErrors);
        setServerError('Please fix the errors below.');
      } else {
        setServerError(err?.response?.data?.message || 'Registration failed. Please check credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-radial-gradient relative">
      {/* Top corner theme toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-2xl bg-white/90 dark:bg-[#111726]/90 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 mb-3 shadow-lg shadow-teal-500/20">
            <BrainCircuit className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Create CogniQuiz Account
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Join the competitive CS arena, generate AI quizzes & climb the leaderboard
          </p>
        </div>

        {/* Server Alert */}
        {serverError && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center space-x-3 text-red-500 dark:text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900/80 border rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none transition placeholder-slate-400 ${
                    errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-700/80 focus:border-teal-500'
                  }`}
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900/80 border rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none transition placeholder-slate-400 ${
                    errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700/80 focus:border-teal-500'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+1-555-0199"
                  className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900/80 border rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none transition placeholder-slate-400 ${
                    errors.phoneNumber ? 'border-red-500' : 'border-slate-200 dark:border-slate-700/80 focus:border-teal-500'
                  }`}
                />
              </div>
              {errors.phoneNumber && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.phoneNumber}</p>}
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Age <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  name="age"
                  min="5"
                  max="120"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="21"
                  className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900/80 border rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none transition placeholder-slate-400 ${
                    errors.age ? 'border-red-500' : 'border-slate-200 dark:border-slate-700/80 focus:border-teal-500'
                  }`}
                />
              </div>
              {errors.age && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.age}</p>}
            </div>
          </div>

          {/* School / Institute */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              School / College / Institute Name <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="schoolOrInstitute"
                value={formData.schoolOrInstitute}
                onChange={handleChange}
                placeholder="e.g. Stanford University / IIT Delhi"
                className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900/80 border rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none transition placeholder-slate-400 ${
                  errors.schoolOrInstitute ? 'border-red-500' : 'border-slate-200 dark:border-slate-700/80 focus:border-teal-500'
                }`}
              />
            </div>
            {errors.schoolOrInstitute && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.schoolOrInstitute}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Residential Address <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="City, State, Country"
                className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900/80 border rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none transition placeholder-slate-400 ${
                  errors.address ? 'border-red-500' : 'border-slate-200 dark:border-slate-700/80 focus:border-teal-500'
                }`}
              />
            </div>
            {errors.address && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.address}</p>}
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900/80 border rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none transition placeholder-slate-400 ${
                    errors.password ? 'border-red-500' : 'border-slate-200 dark:border-slate-700/80 focus:border-teal-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Confirm Password <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900/80 border rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none transition placeholder-slate-400 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-slate-200 dark:border-slate-700/80 focus:border-teal-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-semibold text-sm flex items-center justify-center space-x-2 transition shadow-lg shadow-teal-500/25 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Securing Credentials & Registering...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Switch to login */}
        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 font-semibold underline underline-offset-4 ml-1 transition"
          >
            Sign in here
          </button>
        </div>
      </div>
    </div>
  );
}
