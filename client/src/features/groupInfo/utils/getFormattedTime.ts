export const getFormattedTime = (time: string) => {
    const formattedTime = new Date(time).toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        year: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    })

    return formattedTime
}