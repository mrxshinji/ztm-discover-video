import { Magic } from "magic-sdk";

const createMagic = () => {
  return typeof window !== "undefined" && new Magic(process.env.NEXT_PUBLIC_MAGIC_P_KEY);
};

export const m = createMagic();

export const loginInWithMagicLink = async (email) => {
    try {
        console.log('server log loginWithMagicLink', email)
        const didToken = await m.auth.loginWithMagicLink({ email })
        console.log({didToken})
        return didToken
    } catch (err) {
        console.error('Login error', err)
        return (err)
    }
}

