import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyChzGJO0ITNM6Kx6mpVd5qWz2gHZx6yAVM",
    authDomain: "project-management-9638c.firebaseapp.com",
    projectId: "project-management-9638c",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
