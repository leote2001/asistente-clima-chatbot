export const recaptcha = async (recaptchaToken: string) => {
    try {
    const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: `secret=${process.env.RECAPTCHA_SECRET}&response=${recaptchaToken}` });
    const verifyResData = await verifyRes.json();
    console.log(`score: ${verifyResData.score}`);
    if (!verifyResData.success || verifyResData.score < 0.5 || verifyResData.action !== "chat_submit") {
        return {success: false, error: "Actividad sospechosa detectada.", status: 403};
    }
    return {success: true};
} catch (err: any) {
    return {success: false, error: "Error inesperado al verificar recaptcha.", status: 500};
}
}