import { useState } from "react";
import { Building2, CheckCircle2, GraduationCap, LogIn, MailCheck } from "lucide-react";
import { loginAccount, registerAccount, verifyAccount } from "../api";
import { courseInfo } from "../data/courseData";

const emptyForm = {
  role: "company",
  name: "",
  company_name: "",
  email: "",
  password: "",
  google_signup: false,
};

function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(emptyForm);
  const [verificationCode, setVerificationCode] = useState("");
  const [demoCode, setDemoCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function updateForm(field, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  async function handleRegister(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await registerAccount(form);
      setDemoCode(response.data.verification_code || "");
      setMode("verify");
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.detail || "Could not create the account.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await verifyAccount({
        email: form.email,
        code: verificationCode,
      });
      onLogin(response.data);
    } catch (error) {
      setMessage(error.response?.data?.detail || "Verification failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await loginAccount({
        email: form.email,
        password: form.password,
      });
      onLogin(response.data);
    } catch (error) {
      setMessage(error.response?.data?.detail || "Could not log in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <span className="navbar__logo" aria-hidden="true">
          <GraduationCap size={26} />
        </span>
        <span className="eyebrow">{courseInfo.systemShortName}</span>
        <h1>{courseInfo.systemName}</h1>
        <p>
          Company accounts create intern profiles and weekly reports. Lecturer accounts review
          companies, open student reports, and assign marks.
        </p>
      </section>

      <section className="auth-panel" aria-label="Account access">
        <div className="segmented-control">
          <button
            className={mode === "login" ? "segmented-control__item active" : "segmented-control__item"}
            onClick={() => setMode("login")}
            type="button"
          >
            <LogIn size={16} />
            Have account
          </button>
          <button
            className={mode === "register" ? "segmented-control__item active" : "segmented-control__item"}
            onClick={() => setMode("register")}
            type="button"
          >
            <CheckCircle2 size={16} />
            Create account
          </button>
        </div>

        {mode === "login" ? (
          <form className="form-panel" onSubmit={handleLogin}>
            <div className="section-heading">
              <span className="section-heading__icon">
                <LogIn size={20} />
              </span>
              <div>
                <h2>Login</h2>
                <p>Use a verified company or lecturer account.</p>
              </div>
            </div>
            <label>
              Email Address
              <input
                inputMode="email"
                required
                type="text"
                value={form.email}
                onChange={(event) => updateForm("email", event.target.value)}
                placeholder="name@example.com"
              />
            </label>
            <label>
              Password
              <input
                required
                type="password"
                value={form.password}
                onChange={(event) => updateForm("password", event.target.value)}
                placeholder="Account password"
              />
            </label>
            <button className="button button--primary" disabled={loading} type="submit">
              <LogIn size={16} />
              Login
            </button>
          </form>
        ) : null}

        {mode === "register" ? (
          <form className="form-panel" onSubmit={handleRegister}>
            <div className="section-heading">
              <span className="section-heading__icon section-heading__icon--green">
                {form.role === "company" ? <Building2 size={20} /> : <GraduationCap size={20} />}
              </span>
              <div>
                <h2>Create Account</h2>
                <p>Select whether this account belongs to a company or lecturer.</p>
              </div>
            </div>

            <div className="role-selector" aria-label="Account type">
              <button
                className={form.role === "company" ? "role-choice active" : "role-choice"}
                onClick={() => updateForm("role", "company")}
                type="button"
              >
                <Building2 size={18} />
                Company
              </button>
              <button
                className={form.role === "lecturer" ? "role-choice active" : "role-choice"}
                onClick={() => updateForm("role", "lecturer")}
                type="button"
              >
                <GraduationCap size={18} />
                Lecturer
              </button>
            </div>

            {form.role === "company" ? (
              <label>
                Company Name
                <input
                  required
                  type="text"
                  value={form.company_name}
                  onChange={(event) => updateForm("company_name", event.target.value)}
                  placeholder="Company or organization name"
                />
              </label>
            ) : (
              <label>
                Lecturer Name
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(event) => updateForm("name", event.target.value)}
                  placeholder="Lecturer full name"
                />
              </label>
            )}

            <label>
              Email Address
              <input
                inputMode="email"
                required
                type="text"
                value={form.email}
                onChange={(event) => updateForm("email", event.target.value)}
                placeholder="name@example.com"
              />
            </label>
            <label>
              Password
              <input
                required={!form.google_signup}
                type="password"
                value={form.password}
                onChange={(event) => updateForm("password", event.target.value)}
                placeholder="Create a password"
              />
            </label>
            <label className="toggle-row">
              <span>Continue with Google account</span>
              <input
                checked={form.google_signup}
                onChange={(event) => updateForm("google_signup", event.target.checked)}
                type="checkbox"
              />
            </label>
            <button className="button button--primary" disabled={loading} type="submit">
              <MailCheck size={16} />
              Send Verification
            </button>
          </form>
        ) : null}

        {mode === "verify" ? (
          <form className="form-panel" onSubmit={handleVerify}>
            <div className="section-heading">
              <span className="section-heading__icon section-heading__icon--amber">
                <MailCheck size={20} />
              </span>
              <div>
                <h2>Email Verification</h2>
                <p>Enter the number sent to {form.email}.</p>
              </div>
            </div>
            <label>
              Verification Number
              <input
                inputMode="numeric"
                maxLength="6"
                required
                value={verificationCode}
                onChange={(event) => setVerificationCode(event.target.value)}
                placeholder="6 digit code"
              />
            </label>
            {demoCode ? <div className="inline-note">Demo verification code: {demoCode}</div> : null}
            <button className="button button--primary" disabled={loading} type="submit">
              <CheckCircle2 size={16} />
              Verify Account
            </button>
          </form>
        ) : null}

        {message ? <div className="inline-note">{message}</div> : null}
      </section>
    </main>
  );
}

export default Login;
