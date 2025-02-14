let FRONTEND_BASE_URL = ""
let BACKEND_BASE_URL = ""
let WS_BASE_URL = ""

if (process.env.NODE_ENV === "development") {
  FRONTEND_BASE_URL = "http://localhost:5173"
  BACKEND_BASE_URL = "http://localhost:8123"
  WS_BASE_URL = "ws://localhost:8123"
} else if (process.env.NODE_ENV === "production") {
  FRONTEND_BASE_URL = "http://8.134.191.187"
  BACKEND_BASE_URL = "http://8.134.191.187"
  WS_BASE_URL = "ws://8.134.191.187"
} else {
}

export { FRONTEND_BASE_URL, BACKEND_BASE_URL, WS_BASE_URL }
