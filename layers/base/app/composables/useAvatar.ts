const GRAVATAR_HASH = "662dc1c0b497bc93a080830d45ca2a7b"

export const useAvatar = () => {
  const avatarUrl = computed(() => `https://www.gravatar.com/avatar/${GRAVATAR_HASH}`)

  return {
    avatarUrl
  }
}
