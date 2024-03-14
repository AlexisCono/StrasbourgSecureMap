import Banner from "./Banner";
import Button from "./Button";
import "./styles/Backups.css";


const BackupsPage = () => {
    return(
        <div>
            <Banner>
                <Button href="/" classe="buttonRetourAcc">
                    Accueil
                </Button>
            </Banner>
            <header className="App-header">
            <div className="container">
                <div className="logoBackupsPage">
                    <img src="public\image\logoSSM.png" alt="Logo" />
                </div>
                <div className="separator"></div> {/* Barre de séparation */}
                <div className="links">
                    <ul>
                    <li><a href="/">Accueil</a></li>
                    <li><a href="/">Accueil</a></li>
                    <li><a href="/">Accueil</a></li>
                    {/* Ajoutez d'autres liens au besoin */}
                    </ul>
                </div>
                </div>
            </header>
        </div>
    )
}

export default BackupsPage;