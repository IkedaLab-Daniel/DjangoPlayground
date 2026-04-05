import { useMemo, useState } from "react"
import "./App.css"

const initialRegister = {
  username: "",
  email: "",
  password: "",
  re_password: "",
}

const initialLogin = {
  username: "",
  password: "",
}

const initialResetRequest = {
  email: "",
}

const initialResetConfirm = {
  uid: "",
  token: "",
  new_password: "",
  re_new_password: "",
}

const toJson = async (response) => {
  const text = await response.text()
  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return { raw: text }
  }
}

const App = () => {
  const [baseUrl, setBaseUrl] = useState("http://127.0.0.1:8000/auth")
  const [registerData, setRegisterData] = useState(initialRegister)
  const [loginData, setLoginData] = useState(initialLogin)
  const [resetRequestData, setResetRequestData] = useState(initialResetRequest)
  const [resetConfirmData, setResetConfirmData] = useState(initialResetConfirm)
  const [token, setToken] = useState("")
  const [loadingKey, setLoadingKey] = useState("")
  const [log, setLog] = useState([])

  const normalizedBaseUrl = useMemo(
    () => baseUrl.trim().replace(/\/+$/, ""),
    [baseUrl],
  )

  const appendLog = (entry) => {
    setLog((previous) => [
      {
        id: crypto.randomUUID(),
        at: new Date().toLocaleTimeString(),
        ...entry,
      },
      ...previous,
    ])
  }

  const callEndpoint = async ({ key, endpoint, method = "POST", body }) => {
    setLoadingKey(key)
    const url = `${normalizedBaseUrl}${endpoint}`

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Token ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      })

      const payload = await toJson(response)

      appendLog({
        success: response.ok,
        label: `${method} ${endpoint}`,
        status: response.status,
        payload,
      })

      return { ok: response.ok, payload }
    } catch (error) {
      appendLog({
        success: false,
        label: `${method} ${endpoint}`,
        status: "NETWORK",
        payload: { detail: error.message },
      })

      return { ok: false }
    } finally {
      setLoadingKey("")
    }
  }

  const handleRegister = async (event) => {
    event.preventDefault()
    await callEndpoint({
      key: "register",
      endpoint: "/users/",
      body: registerData,
    })
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    const result = await callEndpoint({
      key: "login",
      endpoint: "/token/login/",
      body: loginData,
    })

    if (result.ok && result.payload?.auth_token) {
      setToken(result.payload.auth_token)
    }
  }

  const handleLogout = async () => {
    const result = await callEndpoint({
      key: "logout",
      endpoint: "/token/logout/",
      body: {},
    })

    if (result.ok) {
      setToken("")
    }
  }

  const handleResetRequest = async (event) => {
    event.preventDefault()
    await callEndpoint({
      key: "reset-request",
      endpoint: "/users/reset_password/",
      body: resetRequestData,
    })
  }

  const handleResetConfirm = async (event) => {
    event.preventDefault()
    await callEndpoint({
      key: "reset-confirm",
      endpoint: "/users/reset_password_confirm/",
      body: resetConfirmData,
    })
  }

  return (
    <div className="page">
      <div className="aurora" aria-hidden />
      <main className="shell">
        <header className="hero">
          <p className="kicker">Djoser Playground</p>
          <h1>Dummy Auth Client</h1>
          <p>
            Use this page to verify register, token login, password reset request,
            and reset confirmation against your Django server.
          </p>
        </header>

        <section className="panel settings-panel">
          <label htmlFor="baseUrl">Auth Base URL</label>
          <input
            id="baseUrl"
            value={baseUrl}
            onChange={(event) => setBaseUrl(event.target.value)}
            placeholder="http://127.0.0.1:8000/auth"
          />
          <p className="hint">
            Current target: <strong>{normalizedBaseUrl}</strong>
          </p>
        </section>

        <section className="grid">
          <form className="panel" onSubmit={handleRegister}>
            <h2>Register</h2>
            <input
              placeholder="username"
              value={registerData.username}
              onChange={(event) =>
                setRegisterData((prev) => ({ ...prev, username: event.target.value }))
              }
              required
            />
            <input
              type="email"
              placeholder="email"
              value={registerData.email}
              onChange={(event) =>
                setRegisterData((prev) => ({ ...prev, email: event.target.value }))
              }
              required
            />
            <input
              type="password"
              placeholder="password"
              value={registerData.password}
              onChange={(event) =>
                setRegisterData((prev) => ({ ...prev, password: event.target.value }))
              }
              required
            />
            <input
              type="password"
              placeholder="confirm password"
              value={registerData.re_password}
              onChange={(event) =>
                setRegisterData((prev) => ({ ...prev, re_password: event.target.value }))
              }
              required
            />
            <button disabled={loadingKey === "register"} type="submit">
              {loadingKey === "register" ? "Sending..." : "Create User"}
            </button>
          </form>

          <form className="panel" onSubmit={handleLogin}>
            <h2>Token Login</h2>
            <input
              placeholder="username"
              value={loginData.username}
              onChange={(event) =>
                setLoginData((prev) => ({ ...prev, username: event.target.value }))
              }
              required
            />
            <input
              type="password"
              placeholder="password"
              value={loginData.password}
              onChange={(event) =>
                setLoginData((prev) => ({ ...prev, password: event.target.value }))
              }
              required
            />
            <button disabled={loadingKey === "login"} type="submit">
              {loadingKey === "login" ? "Sending..." : "Login"}
            </button>
            <button
              disabled={loadingKey === "logout" || !token}
              type="button"
              className="secondary"
              onClick={handleLogout}
            >
              {loadingKey === "logout" ? "Sending..." : "Logout"}
            </button>
            <p className="token-line">Token: {token || "none"}</p>
          </form>

          <form className="panel" onSubmit={handleResetRequest}>
            <h2>Reset Request</h2>
            <input
              type="email"
              placeholder="email"
              value={resetRequestData.email}
              onChange={(event) =>
                setResetRequestData({ email: event.target.value })
              }
              required
            />
            <button disabled={loadingKey === "reset-request"} type="submit">
              {loadingKey === "reset-request" ? "Sending..." : "Send Reset Email"}
            </button>
          </form>

          <form className="panel" onSubmit={handleResetConfirm}>
            <h2>Reset Confirm</h2>
            <input
              placeholder="uid"
              value={resetConfirmData.uid}
              onChange={(event) =>
                setResetConfirmData((prev) => ({ ...prev, uid: event.target.value }))
              }
              required
            />
            <input
              placeholder="token"
              value={resetConfirmData.token}
              onChange={(event) =>
                setResetConfirmData((prev) => ({ ...prev, token: event.target.value }))
              }
              required
            />
            <input
              type="password"
              placeholder="new password"
              value={resetConfirmData.new_password}
              onChange={(event) =>
                setResetConfirmData((prev) => ({ ...prev, new_password: event.target.value }))
              }
              required
            />
            <input
              type="password"
              placeholder="confirm new password"
              value={resetConfirmData.re_new_password}
              onChange={(event) =>
                setResetConfirmData((prev) => ({ ...prev, re_new_password: event.target.value }))
              }
              required
            />
            <button disabled={loadingKey === "reset-confirm"} type="submit">
              {loadingKey === "reset-confirm" ? "Sending..." : "Confirm Password Reset"}
            </button>
          </form>
        </section>

        <section className="panel log-panel">
          <div className="log-header">
            <h2>Response Log</h2>
            <button type="button" className="secondary" onClick={() => setLog([])}>
              Clear
            </button>
          </div>
          {log.length === 0 ? (
            <p className="hint">No calls yet.</p>
          ) : (
            <ul>
              {log.map((entry) => (
                <li key={entry.id} className={entry.success ? "ok" : "fail"}>
                  <p>
                    <strong>{entry.at}</strong> {entry.label} [{entry.status}]
                  </p>
                  <pre>{JSON.stringify(entry.payload, null, 2)}</pre>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}

export default App