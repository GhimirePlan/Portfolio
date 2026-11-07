import ChatHistoryView from '../ChatHistoryView';
export const metadata = { title: 'PlanBot conversation', robots: { index: false, follow: false } };
export default function ChatPage({ params }) { return <ChatHistoryView sessionId={params.sessionId} />; }
