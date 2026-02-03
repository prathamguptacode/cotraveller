export const getFormattedTime = (time: string) => {
    const formattedTime = new Date(time).toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        year: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    })
    return formattedTime
}