export { };

declare global {
    interface Window {
        toastify: (msg: string, type?: "success" | "info" | "error" | "warning") => void;
    }
}
