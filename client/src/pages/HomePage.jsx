import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

const HomePage = () => {
  return (
    <main>
        <Navbar/>
        <div className="pattern" aria-hidden />
        <div className="wrapper">
            <h1>Home Page</h1>
            <Link to="/warehouses">
                <h2>Warehouse</h2>
            </Link>
        </div>
        
    </main>

  )
}

export default HomePage