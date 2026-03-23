
import { Outlet } from 'react-router-dom';


export default function DefaultLayout() {
    const title: string = "Happy Tails";

    return (
        <div className="App">
            <header>
                <h1>
                    <a href="/" >Home</a>
                </h1>
            </header>

            <header className="header">
                <h1>Welcome to {title}</h1>
                <p>A unified platform for pet care and adoption</p>
            </header>

            <main>
                <Outlet />
            </main>

            <footer className="footer">
                <p>© 2026 {title}. All rights reserved.</p>
            </footer>
        </div>
    );
};
