import Navbar from './components/Navbar';
import Home from './pages/Home';
import SoftBackdrop from './components/SoftBackdrop';
import Footer from './components/Footer';
import LenisScroll from './components/lenis';
import { Routes , Route} from 'react-router-dom';

import Plans from './pages/Plans';
import MyGeneration from './pages/MyGeneration';
import Result from './pages/Result';

import Community from './pages/Community';
import Genetator from './pages/Genetator';
import Loading from './pages/Loading';
import {Toaster} from 'react-hot-toast'


function App() {
	return (
		<>
		<Toaster toastOptions={{style: {background: '#333', color: '#fff'}}}/>
			<SoftBackdrop />
			<LenisScroll />
			<Navbar />
			<Routes>
		   <Route path='/' element={<Home />}/>
		   <Route path='/generate' element={<Genetator/>}/>
		   <Route path='/result/:projectId' element={<Result />}/>
		   <Route path='/my-generations' element={<MyGeneration/>}/>
		   <Route path='/community' element={<Community />}/>
		   <Route path='/plans' element={<Plans />}/>
		   <Route path='/loading' element={<Loading/>}/>
		 </Routes>
			
			<Footer />
		</>
	);
}
export default App;