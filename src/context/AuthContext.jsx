// // import { createContext, useContext, useEffect, useState } from "react";
// // import { supabase } from "../supabase/supabaseClient.js";

// // const AuthContext = createContext(null);

// // export function AuthProvider({ children }) {
// //     const [user, setUser] = useState(null);
// //     const [initializing, setInitializing] = useState(true);
// //     const [profileUsername, setProfileUsername] = useState("");

// //     // carica sessione all'avvio
// //     useEffect(() => {
// //         let mounted = true;

// //         async function loadSession() {
// //             const { data, error } = await supabase.auth.getSession();
// //             if (!mounted) return;
// //             if (error) {
// //                 console.error("getSession error:", error);
// //                 setUser(null);
// //             } else {
// //                 setUser(data?.session?.user ?? null);
// //             }
// //             setInitializing(false);
// //         }

// //         loadSession();

// //         // listener cambi di auth
// //         const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
// //             setUser(session?.user ?? null);
// //         });

// //         return () => {
// //             mounted = false;
// //             sub?.subscription?.unsubscribe?.();
// //         };
// //     }, []);

// //     // carica username quando cambia user
// //     useEffect(() => {
// //         let cancelled = false;

// //         async function loadUsername() {
// //             if (!user) {
// //                 setProfileUsername("");
// //                 return;
// //             }
// //             const { data, error } = await supabase
// //                 .from("profiles")
// //                 .select("username")
// //                 .eq("id", user.id)
// //                 .single();

// //             if (!cancelled) {
// //                 if (error && error.code !== "PGRST116") {
// //                     console.warn("loadUsername error:", error.message);
// //                     setProfileUsername("");
// //                 } else {
// //                     setProfileUsername(data?.username || "");
// //                 }
// //             }
// //         }

// //         loadUsername();
// //         return () => {
// //             cancelled = true;
// //         };
// //     }, [user]);

// //     // realtime: ascolta INSERT/UPDATE del proprio profilo
// //     useEffect(() => {
// //         if (!user) return;

// //         const channel = supabase
// //             .channel("profiles-realtime")
// //             .on(
// //                 "postgres_changes",
// //                 { event: "*", schema: "public", table: "profiles", filter: `id=eq.${user.id}` },
// //                 (payload) => {
// //                     const next = payload?.new?.username ?? "";
// //                     setProfileUsername(next);
// //                 }
// //             )
// //             .subscribe();

// //         return () => {
// //             supabase.removeChannel(channel);
// //         };
// //     }, [user]);

// //     // azioni auth
// //     const signUp = async ({ email, password }) => {
// //         const { data, error } = await supabase.auth.signUp({ email, password });
// //         if (error) throw error;
// //         return data;
// //     };

// //     const signIn = async ({ email, password }) => {
// //         const { data, error } = await supabase.auth.signInWithPassword({
// //             email,
// //             password,
// //         });
// //         if (error) throw error;
// //         return data;
// //     };

// //     const signOut = async () => {
// //         const { error } = await supabase.auth.signOut();
// //         if (error) throw error;
// //     };

// //     // utility: permetti ai componenti (es. ProfilePage) di aggiornare subito la UI
// //     const setUsernameOptimistic = (name) => setProfileUsername(name || "");

// //     const value = {
// //         user,
// //         initializing,
// //         signUp,
// //         signIn,
// //         signOut,
// //         profileUsername,
// //         setUsernameOptimistic,
// //     };

// //     return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// // }

// // export function useAuth() {
// //     return useContext(AuthContext);
// // }

// import { createContext, useContext, useEffect, useState } from "react";
// import { supabase } from "../supabase/supabaseClient";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//     const [session, setSession] = useState(null);
//     const [profile, setProfile] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         supabase.auth.getSession().then(({ data: { session } }) => {
//             setSession(session);
//             if (session?.user) {
//                 loadProfile(session.user.id);
//             } else {
//                 setLoading(false);
//             }
//         });
//         const { data: listener } = supabase.auth.onAuthStateChange(
//             (_event, session) => {
//                 setSession(session);
//                 if (session?.user) {
//                     loadProfile(session.user.id);
//                 } else {
//                     setProfile(null);
//                     setLoading(false);
//                 }
//             }
//         );

//         return () => listener.subscription.unsubscribe();
//     }, []);

//     const loadProfile = async (userId) => {
//         const { data, error } = await supabase
//             .from("profiles")
//             .select("username")
//             .eq("id", userId)
//             .single();

//         if (error) {
//             console.error("Load profile error:", error);
//         } else {
//             setProfile(data);
//         }
//         setLoading(false);
//     };

//     const value = {
//         session,
//         user: session?.user,
//         username: profile?.username,
//         loading,
//     };

//     return (
//         <AuthContext.Provider value={value}>
//             {!loading && children}
//         </AuthContext.Provider>
//     );
// }

// export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);

    // carica sessione e profilo all'avvio
    useEffect(() => {
        let mounted = true;

        async function init() {
            const { data, error } = await supabase.auth.getSession();
            if (!mounted) return;

            if (error) {
                console.error("getSession error:", error);
                setSession(null);
                setUsername("");
                setLoading(false);
                return;
            }

            const nextSession = data?.session ?? null;
            setSession(nextSession);

            if (nextSession?.user) {
                await loadProfile(nextSession.user.id);
            } else {
                setLoading(false);
            }
        }

        init();

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, newSession) => {
                setSession(newSession);
                if (newSession?.user) {
                    loadProfile(newSession.user.id);
                } else {
                    setUsername("");
                    setLoading(false);
                }
            }
        );

        return () => {
            mounted = false;
            listener?.subscription?.unsubscribe?.();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // carica username dal profilo
    const loadProfile = async (userId) => {
        const { data, error } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", userId)
            .single();

        if (error && error.code !== "PGRST116") {
            console.error("Load profile error:", error);
            setUsername("");
        } else {
            setUsername(data?.username || "");
        }

        setLoading(false);
    };

    // azioni auth
    const signUp = async ({ email, password }) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        return data;
    };

    const signIn = async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setSession(null);
        setUsername("");
    };

    // permette a Profile di aggiornare subito la navbar
    const setUsernameOptimistic = (name) => setUsername(name || "");

    const value = {
        session,
        user: session?.user,
        username,
        loading,
        signUp,
        signIn,
        signOut,
        setUsernameOptimistic,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext)