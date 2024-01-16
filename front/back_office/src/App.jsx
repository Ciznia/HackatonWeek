import { Router } from './pages/router';
import { NavigationBar } from './components/navigationBar';
import 'bootstrap/dist/css/bootstrap.css';


export const App = () => {
  return (
    <div className="container">
      <NavigationBar />
      <Router />
    </div>
  );
}
