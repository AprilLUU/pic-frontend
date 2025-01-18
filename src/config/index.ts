let FRONTEND_BASE_URL = ""
let BACKEND_BASE_URL = ""

if (process.env.NODE_ENV === "development") {
  FRONTEND_BASE_URL = "http://localhost:5173"
  BACKEND_BASE_URL = "http://localhost:8123"
} else if (process.env.NODE_ENV === "production") {
} else {
}
export { FRONTEND_BASE_URL, BACKEND_BASE_URL }
