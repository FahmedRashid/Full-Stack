import React, { useState, useEffect } from "react";
import { useSignup } from "../hooks/useSignup";
import "../CSS/SignUp.css"; // Now points to the new renamed CSS

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signup, error: signupError, isLoading } = useSignup();

  const expanded =
    hover ||
    firstName.length > 0 ||
    lastName.length > 0 ||
    birthDate.length > 0 ||
    email.length > 0 ||
    password.length > 0 ||
    confirmPassword.length > 0;
  useEffect(() => {
    let angle = 0;
    let animationFrameId: number;

    const animate = () => {
      angle = (angle + 1) % 360;
      const form = document.querySelector<HTMLElement>(".signup-form");
      if (form) {
        form.style.setProperty("--angle", `${angle}deg`);
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);
  useEffect(() => {
    if (
      formError === "Passwords do not match" &&
      password === confirmPassword
    ) {
      setFormError(null);
    }
  }, [password, confirmPassword, formError]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }
    // Most browsers do not prevent manually typing future dates or modifying via dev tools. blocking this from here
    const birthDateobj = new Date(birthDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (birthDateobj > today) {
      setFormError("Birth Date cannot be in the future.");
      return;
    }
    await signup(
      firstName.trim(),
      lastName.trim(),
      birthDate.trim(),
      email.trim(),
      password,
      confirmPassword
    );
  };

  const EyeIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.32 18.32 0 0 1 5-5" />
      <line x1="1" y1="1" x2="23" y2="23" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  return (
    <div className="signup-container">
      <video className="signup-background" autoPlay muted loop playsInline>
        <source src="/SL_VID_1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <form
        className={`signup-form ${expanded ? "expanded" : ""}`}
        onSubmit={handleSubmit}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <h2 className="signup-title">Sign Up</h2>

        <label htmlFor="firstName" className="signup-label">
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          className="signup-input"
          placeholder="Enter your firstname"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <label htmlFor="lastName" className="signup-label">
          Last Name
        </label>
        <input
          type="text"
          id="lastName"
          className="signup-input"
          placeholder="Enter your last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <label htmlFor="birthDate" className="signup-label">
          Birth Date
        </label>
        <input
          type="date"
          id="birthDate"
          className="signup-input"
          placeholder="Enter your email"
          value={birthDate}
          onChange={(e) => setBirthdate(e.target.value)}
          required
        />

        <label htmlFor="email" className="signup-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="signup-input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password" className="signup-label">
          Password
        </label>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className="signup-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        <label htmlFor="Confirm Password" className="signup-label">
          Confirm Password
        </label>
        <div className="password-wrapper">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirm-password"
            className="signup-input"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            // onPaste={(e) => e.preventDefault()}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {(formError || signupError) && (
          <div className="signup-error">{formError || signupError}</div>
        )}
        <button type="submit" className="signup-button" disabled={!!isLoading}>
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
