export default function ChatMessageText({ text = '' }) {
  return text.split(/(https?:\/\/[^\s<>]+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi).map((part, index) => {
    if (!/^https?:\/\//i.test(part) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(part)) return part;
    const trailing = part.match(/[.,!?;:]+$/)?.[0] || '';
    const label = trailing ? part.slice(0, -trailing.length) : part;
    const web = /^https?:\/\//i.test(label);
    return <span key={index}><a href={web ? label : `mailto:${label}`} target={web ? '_blank' : undefined} rel={web ? 'noopener noreferrer' : undefined} style={{ textDecoration: 'underline', textUnderlineOffset: '3px', overflowWrap: 'anywhere' }}>{label}</a>{trailing}</span>;
  });
}
