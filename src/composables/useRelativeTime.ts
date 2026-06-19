export function useRelativeTime() {
  function formatDeadline(dateStr: string): string {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

    if (diff < 0) return 'Срок истёк'
    if (days === 0) return 'Сегодня'
    if (days === 1) return 'Завтра'
    if (days < 7) return `Осталось ${days} дн.`
    if (days < 30) return `Осталось ${Math.floor(days / 7)} нед.`
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  function formatDateTime(dateStr: string): string {
    return new Date(dateStr).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return { formatDeadline, formatDate, formatDateTime }
}
