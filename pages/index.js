import ChatBox from "../components/chat/ChatBox/ChatBox";
import Messenger from "../components/chat/Messenger/Messenger";
import BaseLayout from "../layouts/BaseLayout";

export default function Home() {
  console.log('HOMEPAGE RENDERED');

  return (
    <BaseLayout title="Homepage">
      <div className="Home">
        <ChatBox />
        <Messenger />
      </div>
    </BaseLayout>
  );
}
