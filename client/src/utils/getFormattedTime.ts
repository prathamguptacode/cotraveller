export const getFormattedTime = (time: string) => {
    const timeZ = new Date(time)
    return timeZ.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    })
}
