import type { JSX } from 'react'; 
{/*insert Header component here*/}

export default function BrowseAdoptables(): JSX.Element {
    return (
        <main className="main-content">
            
            <section className="hero">
                <h2>Browse Adoptables</h2>
                <p>Search and filter pets available for adoption.</p>
            </section>

            {/*Filter Sidebar - LEFT SIDE*/}
            <section className="browse-layout">

            </section>

            {/*Grid of adoptables - RIGHT SIDE*/}
            <section className="adoptables-grid">

            </section>

            {/*How to Adopt - Bottom section*/}
            <section className="how-to-adopt">
                <h2>How to Adopt?</h2>
                    <p>
                    1. Browse adoptables → 2. View a profile → 3. Submit an application → 4. Meet & finalize adoption.
                    </p>
            </section>

        </main>

    );

}