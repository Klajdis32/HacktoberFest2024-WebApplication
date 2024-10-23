import "./header.css";
import LogoDarkGreenHorizontal from '../Assets/Images/LogoDarkGreenHorizontal.svg';
import Separator from '../Assets/Images/Separator.svg';
import { Link, useLocation } from "react-router-dom";

const Header = () => {
    const location = useLocation(); 

    return (
        <div className="Header">
            <div className="LogoSvg">
                <img src={LogoDarkGreenHorizontal} alt="Logo" id="Logo" />
            </div>

            <div className="downdiv">
                <div className="buttons">
                    <Link
                        to='/'
                        className={`Link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Register
                    </Link>

                    <Link
                        to='/participants'
                        className={`Link ${location.pathname === '/participants' ? 'active' : ''}`}
                    >
                        Participants
                    </Link>
                </div>

                <div className="SeparatorSvg">
                    <img src={Separator} alt="Logo" id="Separator" style={{ fill: '#1C1C1C' }}/>
                </div>

            </div>
        </div>
    );
}

export default Header;
