
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./redux/authReducer";
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from './pages/home/Home';
import Add from './pages/add/Add';
import Assign from './pages/assign/Assign';
import Login from './pages/login/Login';
import ScreenCast from './pages/screencast/ScreenCast';
import Profile from './pages/profile/Profile';

function App() {
  var user = useSelector(selectCurrentToken) ?? null

  return (
    //admin için şifre değiştirme kısmı
      <BrowserRouter>
        <Routes>
            <Route path="/" element={user ? <Home/> : <Login/>}/>
            <Route path="/add" element={user ? <Add/> : <Login/>}/>
            <Route path="/assign" element={user ? <Assign/> : <Login/>}/>
            <Route path="/profile" element={user ? <Profile/> : <Login/>}/>
            <Route path='/view' element={<ScreenCast/>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
