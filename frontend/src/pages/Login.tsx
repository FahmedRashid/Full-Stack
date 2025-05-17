import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../CSS/Login.css";
import { useLogin } from "../hooks/useLogin";
import { useAuthcontext } from "../hooks/useAuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hover, setHover] = useState(false);
  const { login, error, isLoading } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const { state } = useAuthcontext();
  const { user } = state;

  // Form is expanded if hovered or if email/password is filled
  const expanded = hover || email.length > 0 || password.length > 0;

  // Animation on the login.
  useEffect(() => {
    let angle = 0;
    let animationFrameId: number;

    const animate = () => {
      angle = (angle + 1) % 360;
      // Update the CSS variable --angle on the .login-form element
      const form = document.querySelector<HTMLElement>(".login-form");
      if (form) {
        form.style.setProperty("--angle", `${angle}deg`);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(email, password);
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
    
    <div className="login-container">
      <video className="login-background" autoPlay muted loop playsInline>
        <source src="/SL_VID_1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <form
        className={`login-form ${expanded ? "expanded" : ""}`}
        onSubmit={handleSubmit}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <h2 className="login-title">Login</h2>
        <label htmlFor="email" className="login-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="login-input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password" className="login-label">
          Password
        </label>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className="login-input"
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
        {user && (<span>{user.email} is logged in</span>)}
        <button type="submit" className="login-button" disabled={!!isLoading}>
          Sign In
        </button>
        <div className="login-links">
          <Link to="#" className="login-link">
            Forgot Password
          </Link>
          <span className="login-separator">|</span>
          <Link to="#" className="login-link">
            Sign up
          </Link>
        </div>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default Login;
