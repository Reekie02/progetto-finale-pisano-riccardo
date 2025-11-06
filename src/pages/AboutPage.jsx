// import { useEffect, useState } from "react";
// import { supabase } from "../supabase/supabaseClient.js";

// export default function AboutPage() {
//     const [status, setStatus] = useState("Verifica connessione...");

//     useEffect(() => {
//         async function checkConnection() {
//             const { data, error } = await supabase.from("test_table").select("*").limit(1);
//             if (error) {
//                 setStatus("✅ Supabase connesso ma tabella non trovata (ok, config funzionante).");
//             } else {
//                 setStatus(`✅ Connessione riuscita, tabella 'test_table' trovata (${data.length} righe).`);
//             }
//         }
//         checkConnection();
//     }, []);

//     return (
//         <div className="max-w-xl mx-auto text-center mt-20">
//             <h1 className="text-3xl font-bold mb-4">Verifica Supabase</h1>
//             <p className="text-gray-700">{status}</p>
//         </div>
//     );
// }