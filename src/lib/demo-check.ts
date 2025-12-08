
export const isDemoUser = (email?: string | null) => {
    const demoEmails = [
        "demo-turk@qrmenu.com",
        "demo-kore@qrmenu.com"
    ];
    return email && demoEmails.includes(email);
};
