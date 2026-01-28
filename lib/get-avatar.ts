export const getAvatar = (userPicture: string | null, userEmail: string) => {
  return (
    userPicture || `https://avatar.vercel.sh/${encodeURIComponent(userEmail)}`
  )
}
