import Chat from "./components/Chat";
import RecaptchaProvider from "./components/RecaptchaProvider";

export default function Home() {
 return (
  <RecaptchaProvider>
  <Chat />
  </RecaptchaProvider>
 ); 
}