import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_KEY } from './config.js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function getCurrentUser() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
}

export async function signIn(email, password) {
    return await supabase.auth.signInWithPassword({
        email,
        password
    });
}

export async function signUp(email, password, username) {
    return await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { username }
        }
    });
}

export async function signOut() {
    return await supabase.auth.signOut();
}

export function onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
}
