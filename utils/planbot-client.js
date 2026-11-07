export function chatContext(messages) {
  return messages.filter(message => !message.isError && typeof message.text === 'string').slice(-12).map(message => ({ role: message.sender === 'user' ? 'user' : 'assistant', content: message.text.slice(0, 3000) }));
}
export function chatError(error) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return 'You appear to be offline. Please reconnect and try again.';
  if (error.code === 'ECONNABORTED') return 'PlanBot took too long to reply. Please try again.';
  return error.response?.data?.message || 'PlanBot could not connect. Please try again in a moment.';
}
