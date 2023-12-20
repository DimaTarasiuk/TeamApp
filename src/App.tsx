import { Footer } from "./components/footer/Footer";
import { Header } from "./components/header/Header";
import Home from "./pages/home/Home";

import './styles/global.scss'

function App() {

  return (
    <div className="main">
      <Header />
      <Home />
      <Footer />
    </div>
  )
}

export default App;
