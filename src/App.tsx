import "./index.css"
import "./App.css"
import { RouterProvider } from "react-router-dom"
import { router } from "@/routes"

export default function App() {
  // the router defines all of the layouts and pages for the app;
  // wrapping at the top level allows us to keep this component very small.
  return <RouterProvider router={router} />
}
