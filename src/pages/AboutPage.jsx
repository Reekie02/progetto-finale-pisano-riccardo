export default function AboutPage() {
    return (
        <div className="min-h-screen px-6 py-12 text-white md:mt-10">
            {/* HERO SECTION */}
            <section className="max-w-5xl mx-auto text-center mb-16">
                <p className="uppercase tracking-[0.25em] text-xs text-green-500 mb-4">
                    GAMING INTELLIGENCE PLATFORM
                </p>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                    A•KAI è il tuo vantaggio
                    <span className="block text-green-400 mt-1">
                        nel cosmo del gaming.
                    </span>
                </h1>
                <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
                    Una piattaforma pensata per chi vuole prendere decisioni più intelligenti:
                    scoprire titoli, leggere i dati che contano e vivere il gaming come
                    un ecosistema professionale, fluido e potente.
                </p>
            </section>

            {/* STRIP / STATI VELOCI */}
            <section className="max-w-4xl mx-auto mb-16">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="bg-[#151515] border border-green-500/20 rounded-2xl py-6 px-4">
                        <p className="text-2xl font-bold text-green-400">Realtime</p>
                        <p className="text-xs text-gray-400 mt-2">
                            Dati aggiornati e flussi dinamici per esplorare il mercato gaming.
                        </p>
                    </div>
                    <div className="bg-[#151515] border border-green-500/20 rounded-2xl py-6 px-4">
                        <p className="text-2xl font-bold text-green-400">Insight</p>
                        <p className="text-xs text-gray-400 mt-2">
                            Informazioni strutturate su giochi, generi e trend emergenti.
                        </p>
                    </div>
                    <div className="bg-[#151515] border border-green-500/20 rounded-2xl py-6 px-4">
                        <p className="text-2xl font-bold text-green-400">Focus</p>
                        <p className="text-xs text-gray-400 mt-2">
                            Un ambiente progettato per chi vive il gaming come qualcosa di serio.
                        </p>
                    </div>
                </div>
            </section>

            {/* SEZIONE VALORE */}
            <section className="max-w-5xl mx-auto grid gap-10 md:grid-cols-2 items-start mt-16 md:my-26 ">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        Un hub operativo per professionisti, creator e appassionati.
                    </h2>
                    <p className="text-gray-300 text-sm md:text-base mb-4">
                        A•KAI non è solo una vetrina di giochi: è un ambiente in cui
                        ogni interazione è pensata per essere chiara, misurabile e utile.
                        L’obiettivo è semplificare l’accesso alle informazioni, ridurre
                        il rumore e mettere al centro ciò che davvero conta.
                    </p>
                    <p className="text-gray-300 text-sm md:text-base">
                        Che tu stia cercando il prossimo titolo da portare in streaming,
                        analizzando un catalogo per il tuo progetto o semplicemente
                        esplorando nuovi mondi digitali, A•KAI ti fornisce una base solida
                        su cui decidere e agire.
                    </p>
                </div>

                <div className="bg-linear-to-br from-green-500/10 via-transparent to-green-500/10 border border-green-500/20 rounded-2xl p-6 md:p-7">
                    <p className="uppercase tracking-[0.25em] text-xs text-green-400 mb-3">
                        COSMIC DESIGN • DATA-DRIVEN • MODERN UI
                    </p>
                    <p className="text-sm md:text-base text-gray-200 mb-4">
                        L’interfaccia è costruita per essere essenziale ma espressiva:
                        pochi elementi, alta leggibilità, focus sui contenuti.
                    </p>
                    <p className="text-sm md:text-base text-gray-200 mb-4">
                        Il tema cosmico non è solo estetica: rappresenta il modo in cui
                        vediamo il gaming — un universo in continua espansione, dove
                        ogni gioco è un sistema, ogni genere una galassia e ogni utente
                        un esploratore con obiettivi diversi.
                    </p>
                    <p className="text-sm md:text-base text-green-400 font-semibold">
                        A•KAI esiste per dare struttura a questo caos creativo e trasformarlo
                        in un’esperienza navigabile.
                    </p>
                </div>
            </section>

            {/* CALL TO ACTION FINALE */}
            <section className="max-w-3xl mx-auto text-center mt-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-3">
                    Entra nel cosmo A•KAI.
                </h3>
                <p className="text-gray-300 text-sm md:text-base mb-4">
                    Esplora, analizza, scopri: ogni pagina che visiti è un tassello in più
                    nel tuo modo di vivere il gaming. Non è solo una piattaforma, è
                    il tuo pannello di controllo nel panorama videoludico.
                </p>
                <p className="text-green-400 font-semibold text-sm md:text-base">
                    A•KAI — Designed for those who take gaming seriously.
                </p>
            </section>
        </div>
    );
}